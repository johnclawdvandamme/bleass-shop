const { chromium } = require('/Users/johnclawd/.nvm/versions/node/v22.22.1/lib/node_modules/playwright');
const fs = require('fs');
const path = require('path');

const PRODUCT_URLS = [
  "https://www.bleass.com/product/all-synths-bundle/",
  "https://www.bleass.com/product/bleass-alpha-synthesizer/",
  "https://www.bleass.com/product/bleass-alpha-bundle/",
  "https://www.bleass.com/product/bleass-arpeggiator/",
  "https://www.bleass.com/product/bleass-megalit/",
  "https://www.bleass.com/product/bleass-megalit-bundle/",
  "https://www.bleass.com/product/bleass-monolit/",
  "https://www.bleass.com/product/bleass-omega-synthesizer/",
  "https://www.bleass.com/product/bleass-omega-bundle/",
  "https://www.bleass.com/product/bleass-samplewiz-2/",
  "https://www.bleass.com/product/bleass-samplewiz-2-bundle/",
  "https://www.bleass.com/product/granular-bundle/",
  "https://www.bleass.com/product/bleass-voices/",
  "https://www.bleass.com/product/bleass-vox/",
  "https://www.bleass.com/product/bleass-vocal-bundle/",
  "https://www.bleass.com/product/bleass-dragonfly/",
  "https://www.bleass.com/product/bleass-fusion/",
  "https://www.bleass.com/product/bleass-granulizer-desktop-plugin/",
  "https://www.bleass.com/product/bleass-motion-eq/",
  "https://www.bleass.com/product/bleass-motion-fx-desktop-plugin/",
  "https://www.bleass.com/product/bleass-phase-mutant/",
  "https://www.bleass.com/product/bleass-slow-machine-desktop-plugin/",
  "https://www.bleass.com/product/bleass-peaks/",
  "https://www.bleass.com/product/bleass-sidekick/",
  "https://www.bleass.com/product/bleass-tides/",
  "https://www.bleass.com/product/bleass-multiband-compressor/",
  "https://www.bleass.com/product/creative-fxs-bundle/",
  "https://www.bleass.com/product/everything-bundle/",
  "https://www.bleass.com/product/all-bleass-classic-fxs/",
];

function parsePrice(str) {
  if (!str) return 0;
  const clean = str.replace(/[^\d.,]/g, '').trim().replace(',', '.');
  const match = clean.match(/([\d.]+)/);
  return match ? Math.round(parseFloat(match[1]) * 100) : 0;
}

function parseOriginalPrice(text) {
  if (!text) return null;
  const match = text.match(/Original price was:\s*([\d,.]+)/);
  return match ? parsePrice(match[1]) : null;
}

function getDiscount(text) {
  const match = text.match(/-(\d+)%/);
  return match ? parseInt(match[1]) : null;
}

async function scrapeProduct(browser, url) {
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
    extraHTTPHeaders: {
      'Accept-Language': 'en-US,en;q=0.9',
    }
  });
  
  const page = await context.newPage();
  
  try {
    const response = await page.goto(url, { 
      waitUntil: 'networkidle', 
      timeout: 25000 
    });
    
    if (!response || response.status() !== 200) {
      console.log(`  HTTP ${response?.status() || 'no response'}`);
      return null;
    }

    // Wait a bit for dynamic content
    await page.waitForTimeout(2000);
    
    // Get title
    const title = await page.$eval('h1', el => el.textContent.trim()).catch(() => '');
    
    // Get all text content
    const bodyText = await page.evaluate(() => document.body.innerText);
    
    // Parse prices from text
    let currentPrice = 0;
    let originalPrice = null;
    let discount = null;
    let isFree = false;
    
    // Check for "Original price was" pattern (discount)
    if (bodyText.includes('Original price was:')) {
      const origMatch = bodyText.match(/Original price was:\s*([\d,.]+)/);
      if (origMatch) {
        originalPrice = parsePrice(origMatch[1]);
        const currentMatch = bodyText.match(/Current price is:\s*([\d,.]+)/);
        if (currentMatch) {
          currentPrice = parsePrice(currentMatch[1]);
        }
        const pctMatch = bodyText.match(/-(\d+)%/);
        if (pctMatch) discount = parseInt(pctMatch[1]);
      }
    } else {
      // Try to find price near the product title
      const priceMatch = bodyText.match(/€\s*(\d+[\d,.]*)/);
      if (priceMatch) {
        currentPrice = parsePrice(priceMatch[1]);
      }
    }
    
    // Check for free
    if (bodyText.includes('FREE') || bodyText.includes('0.00€') || bodyText.includes('0,00€')) {
      isFree = true;
      currentPrice = 0;
    }
    
    // If price is still 0 but we have a reference, use shop page data
    if (currentPrice === 0 && title) {
      // Try to get price from HTML
      const priceHtml = await page.$eval('.product-page-price, .price, .woocommerce-Price-amount', el => el.innerHTML).catch(() => '');
      if (priceHtml) {
        currentPrice = parsePrice(priceHtml);
      }
    }
    
    // Get images - main product image first
    const images = await page.$$eval('.product-gallery img, .product-images img, .woocommerce-product-gallery img, .entry-content img', imgs => {
      return imgs.map(img => {
        const src = img.src || img.dataset.src || img.dataset.lazySrc || '';
        if (src && src.includes('wp-content') && src.includes('uploads')) {
          return src.split('?')[0]; // Remove query params
        }
        return '';
      }).filter(Boolean);
    });
    
    // Also check og:image
    const ogImage = await page.$eval('meta[property="og:image"]', el => el.content).catch(() => '');
    if (ogImage && ogImage.includes('wp-content')) {
      images.unshift(ogImage.split('?')[0]);
    }
    
    const uniqueImages = [...new Set(images)];
    
    // Get categories
    const categories = await page.$$eval('.product-category a, .posted_in a, [rel="tag"]', els => 
      els.map(el => el.textContent.trim())
    ).catch(() => []);
    
    // Get description from tab panel
    const description = await page.$eval('#tab-description', el => el.textContent.replace(/\s+/g, ' ').trim()).catch(() => bodyText.substring(0, 500));
    
    // Determine OS from description text
    let os = ['iOS', 'Mac'];
    const textLower = (description + bodyText).toLowerCase();
    if (textLower.includes('windows') || textLower.includes('vst')) os.push('Windows');
    if (textLower.includes('auv3') || textLower.includes('audio unit')) {
      os = ['iOS', 'Mac'];
    }
    
    // Check if free bundle (Monolit is free)
    if (bodyText.includes('0.00€') || title.toLowerCase().includes('free')) {
      isFree = true;
      currentPrice = 0;
    }
    
    // Extract handle from URL
    const handle = url.replace('https://www.bleass.com/product/', '').replace(/\/$/, '');
    
    // Get additional info from description
    const shortDesc = await page.$eval('.product-short-description', el => el.textContent.trim()).catch(() => '');
    
    return {
      handle,
      url,
      title,
      currentPrice,
      originalPrice: discount ? originalPrice : null,
      discount,
      isFree,
      description: description.substring(0, 800),
      shortDescription: shortDesc,
      images: uniqueImages.slice(0, 8), // max 8 images
      categories: [...new Set(categories)],
      os,
    };
    
  } catch (e) {
    console.log(`  Error: ${e.message.substring(0, 100)}`);
    return null;
  } finally {
    await page.close();
    await context.close();
  }
}

async function main() {
  console.log('Starting Playwright scraper for BLEASS products...\n');
  
  const browser = await chromium.launch({
    headless: true,
    executablePath: '/Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-blink-features=AutomationControlled',
    ]
  });
  
  const results = [];
  
  for (let i = 0; i < PRODUCT_URLS.length; i++) {
    const url = PRODUCT_URLS[i];
    process.stdout.write(`[${i+1}/${PRODUCT_URLS.length}] ${url}... `);
    
    const data = await scrapeProduct(browser, url);
    
    if (data) {
      results.push(data);
      const priceStr = data.isFree ? 'FREE' : `${data.currentPrice/100}€`;
      const discountStr = data.discount ? ` (-${data.discount}%)` : '';
      console.log(`✓ "${data.title}" | ${priceStr}${discountStr} | ${data.images.length} imgs`);
    } else {
      console.log('✗ FAILED');
    }
    
    await new Promise(r => setTimeout(r, 2000)); // Rate limiting
  }

  await browser.close();
  
  // Save results
  const outputPath = path.join(__dirname, 'product_data.json');
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
  
  console.log(`\n✅ Scraped ${results.length} products`);
  console.log(`📁 Data saved to: ${outputPath}`);
  
  // Show summary
  const freeCount = results.filter(r => r.isFree).length;
  const discountCount = results.filter(r => r.discount).length;
  console.log(`\n📊 Summary: ${freeCount} free | ${discountCount} discounted | ${results.length} total`);
}

main().catch(console.error);
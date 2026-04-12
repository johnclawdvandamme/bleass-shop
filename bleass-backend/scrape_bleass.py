#!/usr/bin/env python3
"""
BLEASS Shop Scraper - Extract product data from bleass.com
Usage: python3 scrape_bleass.py
"""

import json
import os
import sys
import time
import re
from urllib.request import Request, urlopen
from urllib.error import URLError, HTTPError

# Suppress SSL warnings
import urllib3
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.5',
    'Accept-Encoding': 'gzip, deflate, br',
    'Connection': 'keep-alive',
}

PRODUCTS_URLS = [
    # SYNTHS
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
    # VOCAL FXs
    "https://www.bleass.com/product/bleass-voices/",
    "https://www.bleass.com/product/bleass-vox/",
    "https://www.bleass.com/product/bleass-vocal-bundle/",
    # CREATIVE FXs
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
    # Extra bundles that appear in shop
    "https://www.bleass.com/product/everything-bundle/",
    "https://www.bleass.com/product/all-bleass-classic-fxs/",
]

def fetch(url, retries=3):
    """Fetch a URL with retries"""
    for attempt in range(retries):
        try:
            req = Request(url, headers=HEADERS)
            response = urlopen(req, timeout=15)
            html = response.read().decode('utf-8', errors='replace')
            return html
        except (HTTPError, URLError) as e:
            print(f"  Attempt {attempt+1} failed: {e}", file=sys.stderr)
            if attempt < retries - 1:
                time.sleep(2)
    return None

def parse_price(price_str):
    """Parse price string like '69.00€' or '19.99€' to cents"""
    if not price_str:
        return 0
    # Remove currency symbol and spaces
    clean = re.sub(r'[^\d.,]', '', price_str).strip()
    # Handle French formatting (1 234,56) or English (1234.56)
    clean = clean.replace(' ', '').replace(',', '.')
    try:
        euros = float(clean)
        return int(euros * 100)
    except:
        return 0

def parse_compare_price(text):
    """Extract original price from text like 'Original price was: 595.00€. Current price is: 399.00€.'"""
    match = re.search(r'Original price was:\s*([\d\s,.]+)€', text)
    if match:
        return parse_price(match.group(1))
    return None

def parse_discount_pct(text):
    """Extract discount percentage from text like '-33%' or '-52%'"""
    match = re.search(r'-(\d+)%', text)
    if match:
        return int(match.group(1))
    return None

def parse_os_from_text(text):
    """Try to determine OS compatibility from description text"""
    text_lower = text.lower()
    os_list = []
    if 'ios' in text_lower or 'iphone' in text_lower or 'ipad' in text_lower:
        os_list.append('iOS')
    if 'mac' in text_lower or 'macos' in text_lower or 'auv3' in text_lower or 'audio unit' in text_lower:
        os_list.append('Mac')
    if 'windows' in text_lower or 'pc' in text_lower or 'vst' in text_lower:
        os_list.append('Windows')
    if not os_list:
        os_list = ['iOS', 'Mac']  # default
    return os_list

def extract_product_data(html, url):
    """Extract product data from HTML page"""
    from html.parser import HTMLParser
    
    class ProductParser(HTMLParser):
        def __init__(self):
            super().__init__()
            self.in_title = False
            self.in_price = False
            self.in_desc = False
            self.in_category = False
            self.in_tabs = False
            self.in_tabpanel = False
            self.in_gallery = False
            self.images = []
            self.title = ""
            self.current_price = 0
            self.original_price = None
            self.discount = None
            self.description = ""
            self.categories = []
            self.is_free = False
            self.os = ['iOS', 'Mac']
            self.gallery_opened = False
            
        def handle_starttag(self, tag, attrs):
            attrs_dict = dict(attrs)
            cls = attrs_dict.get('class', '')
            
            if tag == 'img' and 'attachment-' in attrs_dict.get('src', ''):
                src = attrs_dict['src']
                if 'Shop-Synthesizers' in src or 'All-Synths' in src or 'product' in src:
                    if src not in self.images:
                        self.images.append(src)
            
            if tag == 'h1' and 'product_title' in cls:
                self.in_title = True
            if tag == 'img' and self.gallery_opened:
                src = attrs_dict.get('src', '')
                if src and 'wp-content' in src and src not in self.images:
                    self.images.append(src)
            
            if tag == 'span' and 'Amount' in cls:
                self.in_price = True
            
            if tag == 'div' and 'product-short-description' in cls:
                self.in_desc = True
                
            if tag == 'a' and 'product-category' in cls:
                self.in_category = True
                
            if tag == 'tab' and attrs_dict.get('aria-selected') == 'true':
                self.in_tabs = True
                
            if tag == 'div' and 'woocommerce-Tabs-panel' in cls:
                self.in_tabpanel = True
                
            if tag == 'a' and 'woocommerce-product-gallery__trigger' in cls:
                self.gallery_opened = True
        
        def handle_endtag(self, tag):
            if tag == 'h1':
                self.in_title = False
            if tag == 'span':
                self.in_price = False
            if tag == 'div':
                self.in_desc = False
                self.in_tabpanel = False
                
        def handle_data(self, data):
            data = data.strip()
            if not data:
                return
                
            if self.in_title:
                self.title = data
                
            if self.in_price:
                self.current_price = parse_price(data)
                
            if 'Original price was:' in data:
                self.original_price = parse_compare_price(data)
                
            if '-' in data and '%' in data:
                pct = parse_discount_pct(data)
                if pct:
                    self.discount = pct
                    
            if 'FREE' in data.upper() or '0.00€' in data or '0,00€' in data:
                self.is_free = True
                
            if self.in_category:
                self.categories.append(data)
                
            if self.in_tabpanel:
                self.description += data + "\n"
    
    parser = ProductParser()
    try:
        parser.feed(html)
    except:
        pass
    
    return {
        'title': parser.title,
        'url': url,
        'current_price': parser.current_price,
        'original_price': parser.original_price,
        'discount': parser.discount,
        'is_free': parser.is_free,
        'description': parser.description.strip() if parser.description else '',
        'categories': parser.categories,
        'images': parser.images[:10],  # limit to 10 images
        'os': parser.os,
    }

def main():
    print("Starting BLEASS product scraper...", file=sys.stderr)
    
    all_products = []
    
    for i, url in enumerate(PRODUCTS_URLS):
        print(f"[{i+1}/{len(PRODUCTS_URLS)}] Fetching: {url}", file=sys.stderr)
        html = fetch(url)
        
        if html:
            data = extract_product_data(html, url)
            all_products.append(data)
            print(f"  → {data.get('title', 'UNKNOWN')} | {data.get('current_price', 0)/100}€ | {len(data.get('images', []))} images")
        else:
            print(f"  → FAILED")
        
        time.sleep(1)  # Be polite to the server
    
    # Save to JSON
    output_path = os.path.expanduser("~/bleass-backend/product_data.json")
    with open(output_path, 'w') as f:
        json.dump(all_products, f, indent=2, ensure_ascii=False)
    
    print(f"\n✅ Scraped {len(all_products)} products", file=sys.stderr)
    print(f"📁 Saved to {output_path}", file=sys.stderr)

if __name__ == '__main__':
    main()
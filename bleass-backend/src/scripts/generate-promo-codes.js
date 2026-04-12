// Custom BLEASS promo code generator
// Usage: node src/scripts/generate-promo-codes.js <count> <discount> <prefix>
// Example: node src/scripts/generate-promo-codes.js 50 25 LOYALTY
const { Client } = require("pg");

const client = new Client({ host: "/tmp", user: "johnclawd", database: "bleass_db" });

function generateCode(prefix, length = 6) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no I, O, 0, 1 to avoid confusion
  let code = prefix.toUpperCase();
  for (let i = 0; i < length; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

async function main() {
  const args = process.argv.slice(2);
  const count = parseInt(args[0]) || 50;
  const discount = parseInt(args[1]) || 20;
  const prefix = args[2] || "BLEASS";
  const campaignDesc = args[3] || `${prefix} campaign — ${discount}% off`;

  await client.connect();
  const now = new Date().toISOString();

  console.log(`\n🎁 Generating ${count} promo codes (${discount}% off, prefix: ${prefix})\n`);

  // ─── Get or create campaign ───────────────────────────────────────────────
  const campId = `camp_${Date.now()}`;
  await client.query(`
    INSERT INTO promotion_campaign (id, name, campaign_identifier, starts_at, ends_at, description, created_at, updated_at)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $7)
  `, [
    campId, `${prefix} Campaign`, `${prefix.toUpperCase()}${Date.now()}`,
    now, new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    campaignDesc, now,
  ]);
  const campaignId = campId;

  console.log(`📦 Campaign: ${campaignId}`);

  // ─── Generate unique codes ────────────────────────────────────────────────
  const generated = new Set();
  let attempts = 0;
  while (generated.size < count && attempts < count * 3) {
    attempts++;
    const code = generateCode(prefix);
    // Check uniqueness in DB
    const exists = await client.query(`SELECT id FROM promotion WHERE code = $1`, [code]);
    if (exists.rows.length === 0) {
      generated.add(code);
    }
  }

  console.log(`🔑 Generated ${generated.size} unique codes\n`);

  // ─── Create one promo per code (individual tracking per customer) ───────────
  const created = [];
  for (const code of generated) {
    const promoId = `promo_${Date.now()}_${code}`;
    const limit = 1; // single use per customer
    await client.query(`
      INSERT INTO promotion (id, code, campaign_id, is_automatic, type, status, is_tax_inclusive, "limit", used, created_at, updated_at)
      VALUES ($1, $2, $3, false, 'standard', 'active', false, $4, 0, $5, $5)
    `, [promoId, code, campaignId, limit, now]);

    // Application method: percentage discount
    const appId = `appmeth_${Date.now()}_${code}`;
    await client.query(`
      INSERT INTO promotion_application_method (id, promotion_id, type, value, target_type, allocation, created_at, updated_at)
      VALUES ($1, $2, 'percentage', $3, 'items', 'each', $4, $4)
    `, [appId, promoId, discount, now]);

    // Rule: applies to all products
    const ruleId = `rule_${Date.now()}_${code}`;
    await client.query(`
      INSERT INTO promotion_rule (id, description, attribute, operator, created_at, updated_at)
      VALUES ($1, 'All products', 'product_id', 'in', $2, $2)
    `, [ruleId, now]);

    await client.query(`
      INSERT INTO promotion_promotion_rule (promotion_id, promotion_rule_id)
      VALUES ($1, $2)
    `, [promoId, ruleId]);

    created.push(code);
  }

  // ─── Print first 20 codes ──────────────────────────────────────────────────
  console.log("First 20 codes:");
  created.slice(0, 20).forEach(c => console.log(`  ${c}`));
  console.log(`\n... and ${created.length - 20} more\n`);

  // ─── Save full list to file ───────────────────────────────────────────────
  const fs = require("fs");
  const outFile = `/tmp/promo-codes_${prefix}_${Date.now()}.txt`;
  fs.writeFileSync(outFile, created.join("\n"));
  console.log(`💾 Full list saved to: ${outFile}`);

  // ─── Summary ──────────────────────────────────────────────────────────────
  const res = await client.query(`
    SELECT COUNT(*) as total, SUM(used::int) as used
    FROM promotion WHERE campaign_id = $1 AND deleted_at IS NULL
  `, [campaignId]);
  console.log(`\n📊 Campaign stats: ${res.rows[0].total} codes, ${res.rows[0].used} used`);

  await client.end();
  console.log("\n✅ Done!");
}

main().catch(e => { console.error("\n❌ Error:", e.message); process.exit(1); });
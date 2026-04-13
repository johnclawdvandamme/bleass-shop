// Direct DB approach for creating Black Friday promo
// Tables: promotion, promotion_campaign, promotion_application_method,
//         promotion_rule, promotion_rule_value, promotion_promotion_rule
const { Client } = require("pg");

const client = new Client({ host: "/tmp", user: "johnclawd", database: "bleass_db" });

async function main() {
  await client.connect();
  const now = new Date().toISOString();

  console.log("🔥 Creating Black Friday 2026 promotion...\n");

  // ─── STEP 1: Campaign ─────────────────────────────────────────────────────
  const campaignId = `camp_${Date.now()}`;
  await client.query(`
    INSERT INTO promotion_campaign (id, name, campaign_identifier, starts_at, ends_at, description, created_at, updated_at)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $7)
  `, [
    campaignId, "Black Friday 2026", "BLACKFRIDAY2026",
    "2026-11-27T00:00:00Z", "2026-12-01T23:59:59Z",
    "Black Friday 2026 — 20% off all BLEASS plugins", now,
  ]);
  console.log("✅ Campaign:", campaignId, "(Nov 27 → Dec 1, 2026)");

  // ─── PROMO A: BLACKFRIDAY20 — 20% off all products, code required ─────────
  const promoAId = `promo_${Date.now()}`;
  await client.query(`
    INSERT INTO promotion (id, code, campaign_id, is_automatic, type, status, is_tax_inclusive, "limit", used, created_at, updated_at)
    VALUES ($1, $2, $3, false, 'standard', 'active', false, 1000, 0, $4, $4)
  `, [promoAId, "BLACKFRIDAY20", campaignId, now]);
  console.log("✅ Promo A: BLACKFRIDAY20 — 20% off all products, max 1000 uses");

  // Application method: 20% off
  const appAId = `appmeth_${Date.now()}`;
  await client.query(`
    INSERT INTO promotion_application_method (id, promotion_id, type, value, target_type, allocation, created_at, updated_at)
    VALUES ($1, $2, 'percentage', 20, 'items', 'each', $3, $3)
  `, [appAId, promoAId, now]);

  // Rule: applies to all products (empty "in" = all)
  const ruleAId = `rule_${Date.now()}`;
  await client.query(`
    INSERT INTO promotion_rule (id, description, attribute, operator, created_at, updated_at)
    VALUES ($1, 'All products', 'product_id', 'in', $2, $2)
  `, [ruleAId, now]);

  await client.query(`
    INSERT INTO promotion_promotion_rule (promotion_id, promotion_rule_id)
    VALUES ($1, $2)
  `, [promoAId, ruleAId]);
  console.log("   Rule: all products | Method: 20% off");

  // ─── PROMO B: AUTO $5 off orders over $50 ──────────────────────────────────
  // Note: code cannot be NULL — use a placeholder that won't be shared publicly
  const promoBId = `promo_${Date.now()}`;
  await client.query(`
    INSERT INTO promotion (id, code, campaign_id, is_automatic, type, status, is_tax_inclusive, "limit", used, created_at, updated_at)
    VALUES ($1, $2, $3, true, 'standard', 'active', false, NULL, 0, $4, $4)
  `, [promoBId, "AUTO50", campaignId, now]);
  console.log("✅ Promo B: $5 off orders over $50 (auto, no code needed)");

  const appBId = `appmeth_${Date.now()}`;
  await client.query(`
    INSERT INTO promotion_application_method (id, promotion_id, type, value, target_type, allocation, created_at, updated_at)
    VALUES ($1, $2, 'fixed', 500, 'items', 'each', $3, $3)
  `, [appBId, promoBId, now]);

  // Rule: cart.subtotal >= $50 (5000 cents)
  const ruleBId = `rule_${Date.now()}`;
  await client.query(`
    INSERT INTO promotion_rule (id, description, attribute, operator, created_at, updated_at)
    VALUES ($1, 'Min cart $50', 'cart.subtotal', 'gte', $2, $2)
  `, [ruleBId, now]);

  await client.query(`
    INSERT INTO promotion_rule_value (id, promotion_rule_id, value, created_at)
    VALUES ($1, $2, '5000', $3)
  `, [`rv_${Date.now()}`, ruleBId, now]);

  await client.query(`
    INSERT INTO promotion_promotion_rule (promotion_id, promotion_rule_id)
    VALUES ($1, $2)
  `, [promoBId, ruleBId]);

  // ─── PROMO C: BUNDLE30 — 30% off specific bundles ──────────────────────────
  const bundles = await client.query(`
    SELECT id, handle FROM product
    WHERE handle LIKE '%bundle%' OR handle LIKE '%all-synths%'
  `);
  const bundleIds = bundles.rows.map(r => r.id);

  if (bundleIds.length > 0) {
    const promoCId = `promo_${Date.now()}`;
    await client.query(`
      INSERT INTO promotion (id, code, campaign_id, is_automatic, type, status, is_tax_inclusive, "limit", used, created_at, updated_at)
      VALUES ($1, $2, $3, false, 'standard', 'active', false, 200, 0, $4, $4)
    `, [promoCId, "BUNDLE30", campaignId, now]);

    const appCId = `appmeth_${Date.now()}`;
    await client.query(`
      INSERT INTO promotion_application_method (id, promotion_id, type, value, target_type, allocation, created_at, updated_at)
      VALUES ($1, $2, 'percentage', 30, 'items', 'each', $3, $3)
    `, [appCId, promoCId, now]);

    const ruleCId = `rule_${Date.now()}`;
    await client.query(`
      INSERT INTO promotion_rule (id, description, attribute, operator, created_at, updated_at)
      VALUES ($1, 'Bundles only', 'product_id', 'in', $2, $2)
    `, [ruleCId, now]);

    for (const bid of bundleIds) {
      await client.query(`
        INSERT INTO promotion_rule_value (id, promotion_rule_id, value, created_at)
        VALUES ($1, $2, $3, $4)
      `, [`rv_${Date.now()}_${bid.slice(-4)}`, ruleCId, bid, now]);
    }

    await client.query(`
      INSERT INTO promotion_promotion_rule (promotion_id, promotion_rule_id)
      VALUES ($1, $2)
    `, [promoCId, ruleCId]);
    console.log(`✅ Promo C: BUNDLE30 — 30% off ${bundleIds.length} bundle products`);
  }

  // ─── Verify ───────────────────────────────────────────────────────────────
  const res = await client.query(`
    SELECT
      p.code, p.status, p.is_automatic, p."limit",
      am.value, am.type as method_type,
      pc.name as campaign, pc.starts_at, pc.ends_at
    FROM promotion p
    JOIN promotion_campaign pc ON p.campaign_id = pc.id
    LEFT JOIN promotion_application_method am ON am.promotion_id = p.id
    WHERE p.deleted_at IS NULL AND pc.deleted_at IS NULL
    ORDER BY p.created_at DESC
  `);

  console.log("\n📋 Promotions in DB:");
  res.rows.forEach(r => {
    const discount = r.method_type === "percentage" ? `${r.value}% off` :
                     r.method_type === "fixed" ? `$${(Number(r.value)/100).toFixed(2)} off` : r.method_type;
    const auto = r.is_automatic ? "AUTO (no code)" : `Code: ${r.code}`;
    const limit = r.limit ? `, max ${r.limit} uses` : ", unlimited";
    console.log(`  ${auto} | ${discount}${limit}`);
  });

  await client.end();
  console.log("\n✅ Done! All Black Friday promos created.");
}

main().catch(e => { console.error("\n❌ Error:", e.message); process.exit(1); });
import { ExecArgs } from "@medusajs/framework/types";
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";

// ─── BLACK FRIDAY 2026 — Direct DB approach ───────────────────────────────────
// Medusa 2.x exec script with proper module resolution

export default async function createBlackFridayPromo({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const dbModule = container.resolve("database");

  // Direct SQL approach since module resolution is tricky in exec context
  const client = (dbModule as any).manager;

  logger.info("🔥 Creating Black Friday 2026 promotion via DB...");

  try {
    // ─── STEP 1: Create campaign ───────────────────────────────────────────
    const campaignId = `camp_${Date.now()}`;
    await client.query(`
      INSERT INTO promotion_campaign (id, name, campaign_identifier, starts_at, ends_at, description, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
    `, [campaignId, "Black Friday 2026", "BLACKFRIDAY2026",
        new Date("2026-11-27"), new Date("2026-12-01"), "Black Friday 2026 — 20% off all BLEASS plugins"]);

    logger.info(`  ✅ Campaign created: ${campaignId}`);

    // ─── STEP 2: Create promotion ──────────────────────────────────────────
    const promoId = `promo_${Date.now()}`;
    await client.query(`
      INSERT INTO promotion (id, code, campaign_id, is_automatic, type, status, is_tax_inclusive, limit, used, created_at, updated_at)
      VALUES ($1, $2, $3, false, 'standard', 'active', false, 1000, 0, NOW(), NOW())
    `, [promoId, "BLACKFRIDAY20", campaignId]);

    logger.info(`  ✅ Promotion created: ${promoId} (code: BLACKFRIDAY20)`);

    // ─── STEP 3: Create application method (20% off) ──────────────────────
    const appMethodId = `appmeth_${Date.now()}`;
    await client.query(`
      INSERT INTO application_method (id, promotion_id, type, value, max_quantity, created_at, updated_at)
      VALUES ($1, $2, 'percentage', 20, NULL, NOW(), NOW())
    `, [appMethodId, promoId]);

    logger.info(`  ✅ Application method: ${appMethodId} (20% off)`);

    // ─── STEP 4: Create rule — apply to ALL products ─────────────────────
    const ruleId = `rule_${Date.now()}`;
    await client.query(`
      INSERT INTO promotion_rule (id, promotion_id, description, attribute, operator, values, created_at, updated_at)
      VALUES ($1, $2, 'All products', 'product_id', 'in', '{}', NOW(), NOW())
    `, [ruleId, promoId]);

    logger.info(`  ✅ Rule: applies to all products (empty values = match all)`);

    logger.info("");
    logger.info("✅ Black Friday promo created via DB!");
    logger.info("");
    logger.info("Summary:");
    logger.info(`  Campaign ID : ${campaignId}`);
    logger.info(`  Promotion ID: ${promoId}`);
    logger.info(`  Code        : BLACKFRIDAY20`);
    logger.info(`  Discount     : 20% off`);
    logger.info(`  Valid       : Nov 27 2026 → Dec 1 2026`);
    logger.info(`  Max uses    : 1000`);
    logger.info("");
    logger.info("Note: For automatic application (no code entry),");
    logger.info("set is_automatic=true. For fixed amount discount,");
    logger.info("change type to 'fixed' and value to cents amount.");

  } catch (error: any) {
    logger.error(`  ❌ Error: ${error.message}`);
    throw error;
  }
}
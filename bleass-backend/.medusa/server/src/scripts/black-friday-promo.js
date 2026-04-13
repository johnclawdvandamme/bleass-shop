"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = createBlackFridayPromo;
const utils_1 = require("@medusajs/framework/utils");
// ─── BLACK FRIDAY 2026 — Direct DB approach ───────────────────────────────────
// Medusa 2.x exec script with proper module resolution
async function createBlackFridayPromo({ container }) {
    const logger = container.resolve(utils_1.ContainerRegistrationKeys.LOGGER);
    const dbModule = container.resolve("database");
    // Direct SQL approach since module resolution is tricky in exec context
    const client = dbModule.manager;
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
    }
    catch (error) {
        logger.error(`  ❌ Error: ${error.message}`);
        throw error;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmxhY2stZnJpZGF5LXByb21vLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL3NjcmlwdHMvYmxhY2stZnJpZGF5LXByb21vLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBTUEseUNBa0VDO0FBdkVELHFEQUErRTtBQUUvRSxpRkFBaUY7QUFDakYsdURBQXVEO0FBRXhDLEtBQUssVUFBVSxzQkFBc0IsQ0FBQyxFQUFFLFNBQVMsRUFBWTtJQUMxRSxNQUFNLE1BQU0sR0FBRyxTQUFTLENBQUMsT0FBTyxDQUFDLGlDQUF5QixDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ25FLE1BQU0sUUFBUSxHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7SUFFL0Msd0VBQXdFO0lBQ3hFLE1BQU0sTUFBTSxHQUFJLFFBQWdCLENBQUMsT0FBTyxDQUFDO0lBRXpDLE1BQU0sQ0FBQyxJQUFJLENBQUMsbURBQW1ELENBQUMsQ0FBQztJQUVqRSxJQUFJLENBQUM7UUFDSCwwRUFBMEU7UUFDMUUsTUFBTSxVQUFVLEdBQUcsUUFBUSxJQUFJLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQztRQUN4QyxNQUFNLE1BQU0sQ0FBQyxLQUFLLENBQUM7OztLQUdsQixFQUFFLENBQUMsVUFBVSxFQUFFLG1CQUFtQixFQUFFLGlCQUFpQjtZQUNsRCxJQUFJLElBQUksQ0FBQyxZQUFZLENBQUMsRUFBRSxJQUFJLElBQUksQ0FBQyxZQUFZLENBQUMsRUFBRSxnREFBZ0QsQ0FBQyxDQUFDLENBQUM7UUFFdkcsTUFBTSxDQUFDLElBQUksQ0FBQyx5QkFBeUIsVUFBVSxFQUFFLENBQUMsQ0FBQztRQUVuRCwwRUFBMEU7UUFDMUUsTUFBTSxPQUFPLEdBQUcsU0FBUyxJQUFJLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQztRQUN0QyxNQUFNLE1BQU0sQ0FBQyxLQUFLLENBQUM7OztLQUdsQixFQUFFLENBQUMsT0FBTyxFQUFFLGVBQWUsRUFBRSxVQUFVLENBQUMsQ0FBQyxDQUFDO1FBRTNDLE1BQU0sQ0FBQyxJQUFJLENBQUMsMEJBQTBCLE9BQU8sd0JBQXdCLENBQUMsQ0FBQztRQUV2RSx5RUFBeUU7UUFDekUsTUFBTSxXQUFXLEdBQUcsV0FBVyxJQUFJLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQztRQUM1QyxNQUFNLE1BQU0sQ0FBQyxLQUFLLENBQUM7OztLQUdsQixFQUFFLENBQUMsV0FBVyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUM7UUFFM0IsTUFBTSxDQUFDLElBQUksQ0FBQywyQkFBMkIsV0FBVyxZQUFZLENBQUMsQ0FBQztRQUVoRSx3RUFBd0U7UUFDeEUsTUFBTSxNQUFNLEdBQUcsUUFBUSxJQUFJLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQztRQUNwQyxNQUFNLE1BQU0sQ0FBQyxLQUFLLENBQUM7OztLQUdsQixFQUFFLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUM7UUFFdEIsTUFBTSxDQUFDLElBQUksQ0FBQyw4REFBOEQsQ0FBQyxDQUFDO1FBRTVFLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDaEIsTUFBTSxDQUFDLElBQUksQ0FBQyxzQ0FBc0MsQ0FBQyxDQUFDO1FBQ3BELE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDaEIsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUN4QixNQUFNLENBQUMsSUFBSSxDQUFDLG1CQUFtQixVQUFVLEVBQUUsQ0FBQyxDQUFDO1FBQzdDLE1BQU0sQ0FBQyxJQUFJLENBQUMsbUJBQW1CLE9BQU8sRUFBRSxDQUFDLENBQUM7UUFDMUMsTUFBTSxDQUFDLElBQUksQ0FBQywrQkFBK0IsQ0FBQyxDQUFDO1FBQzdDLE1BQU0sQ0FBQyxJQUFJLENBQUMsMEJBQTBCLENBQUMsQ0FBQztRQUN4QyxNQUFNLENBQUMsSUFBSSxDQUFDLDBDQUEwQyxDQUFDLENBQUM7UUFDeEQsTUFBTSxDQUFDLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO1FBQ3BDLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDaEIsTUFBTSxDQUFDLElBQUksQ0FBQyxrREFBa0QsQ0FBQyxDQUFDO1FBQ2hFLE1BQU0sQ0FBQyxJQUFJLENBQUMsbURBQW1ELENBQUMsQ0FBQztRQUNqRSxNQUFNLENBQUMsSUFBSSxDQUFDLG1EQUFtRCxDQUFDLENBQUM7SUFFbkUsQ0FBQztJQUFDLE9BQU8sS0FBVSxFQUFFLENBQUM7UUFDcEIsTUFBTSxDQUFDLEtBQUssQ0FBQyxjQUFjLEtBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDO1FBQzVDLE1BQU0sS0FBSyxDQUFDO0lBQ2QsQ0FBQztBQUNILENBQUMifQ==
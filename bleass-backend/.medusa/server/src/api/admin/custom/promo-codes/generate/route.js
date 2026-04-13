"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = POST;
const pg_1 = require("pg");
function generateCode(prefix, length = 6) {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let code = prefix.toUpperCase();
    for (let i = 0; i < length; i++) {
        code += chars[Math.floor(Math.random() * chars.length)];
    }
    return code;
}
async function POST(req, res) {
    const { count = 50, discountPercent = 20, prefix = "BLEASS", description } = req.body;
    if (count > 1000) {
        res.status(400).json({ error: "Max 1000 codes per request" });
        return;
    }
    const client = new pg_1.Client({ host: "/tmp", user: "johnclawd", database: "bleass_db" });
    try {
        await client.connect();
        const now = new Date().toISOString();
        const campaignId = `camp_${Date.now()}`;
        const campaignDesc = description || `${prefix} campaign — ${discountPercent}% off`;
        // Create campaign
        await client.query(`
      INSERT INTO promotion_campaign (id, name, campaign_identifier, starts_at, ends_at, description, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $7)
    `, [
            campaignId, `${prefix} Campaign`, `${prefix.toUpperCase()}${Date.now()}`,
            now, new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
            campaignDesc, now,
        ]);
        // Generate unique codes
        const generated = [];
        let attempts = 0;
        while (generated.length < count && attempts < count * 3) {
            attempts++;
            const code = generateCode(prefix);
            const exists = await client.query(`SELECT id FROM promotion WHERE code = $1`, [code]);
            if (exists.rows.length === 0)
                generated.push(code);
        }
        // Batch insert promos
        for (const code of generated) {
            const idx = generated.indexOf(code);
            const promoId = `promo_${Date.now()}_${idx}`;
            await client.query(`
        INSERT INTO promotion (id, code, campaign_id, is_automatic, type, status, is_tax_inclusive, "limit", used, created_at, updated_at)
        VALUES ($1, $2, $3, false, 'standard', 'active', false, 1, 0, $4, $4)
      `, [promoId, code, campaignId, now]);
            const appId = `appmeth_${Date.now()}_${idx}`;
            await client.query(`
        INSERT INTO promotion_application_method (id, promotion_id, type, value, target_type, allocation, created_at, updated_at)
        VALUES ($1, $2, 'percentage', $3, 'items', 'each', $4, $4)
      `, [appId, promoId, discountPercent, now]);
            const ruleId = `rule_${Date.now()}_${idx}`;
            await client.query(`
        INSERT INTO promotion_rule (id, description, attribute, operator, created_at, updated_at)
        VALUES ($1, 'All products', 'product_id', 'in', $2, $2)
      `, [ruleId, now]);
            await client.query(`
        INSERT INTO promotion_promotion_rule (promotion_id, promotion_rule_id)
        VALUES ($1, $2)
      `, [promoId, ruleId]);
        }
        res.json({
            success: true,
            campaignId,
            count: generated.length,
            discountPercent,
            codes: generated,
            message: `${generated.length} unique codes generated. Single-use, ${discountPercent}% off all products.`,
        });
    }
    finally {
        await client.end();
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvYXBpL2FkbWluL2N1c3RvbS9wcm9tby1jb2Rlcy9nZW5lcmF0ZS9yb3V0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQWdCQSxvQkErRUM7QUExRkQsMkJBQTRCO0FBRTVCLFNBQVMsWUFBWSxDQUFDLE1BQWMsRUFBRSxNQUFNLEdBQUcsQ0FBQztJQUM5QyxNQUFNLEtBQUssR0FBRyxrQ0FBa0MsQ0FBQztJQUNqRCxJQUFJLElBQUksR0FBRyxNQUFNLENBQUMsV0FBVyxFQUFFLENBQUM7SUFDaEMsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO1FBQ2hDLElBQUksSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7SUFDMUQsQ0FBQztJQUNELE9BQU8sSUFBSSxDQUFDO0FBQ2QsQ0FBQztBQUVNLEtBQUssVUFBVSxJQUFJLENBQUMsR0FBa0IsRUFBRSxHQUFtQjtJQUNoRSxNQUFNLEVBQUUsS0FBSyxHQUFHLEVBQUUsRUFBRSxlQUFlLEdBQUcsRUFBRSxFQUFFLE1BQU0sR0FBRyxRQUFRLEVBQUUsV0FBVyxFQUFFLEdBQUcsR0FBRyxDQUFDLElBS2hGLENBQUM7SUFFRixJQUFJLEtBQUssR0FBRyxJQUFJLEVBQUUsQ0FBQztRQUNqQixHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLEtBQUssRUFBRSw0QkFBNEIsRUFBRSxDQUFDLENBQUM7UUFDOUQsT0FBTztJQUNULENBQUM7SUFFRCxNQUFNLE1BQU0sR0FBRyxJQUFJLFdBQU0sQ0FBQyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLFdB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
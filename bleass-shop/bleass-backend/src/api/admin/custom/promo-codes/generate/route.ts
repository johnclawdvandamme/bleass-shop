// POST /admin/custom/promo-codes/generate
// Admin endpoint to bulk-generate unique promo codes
// Body: { count: number, discountPercent: number, prefix: string, description?: string }
import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { Modules } from "@medusajs/framework/utils";
import { Client } from "pg";

function generateCode(prefix: string, length = 6): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = prefix.toUpperCase();
  for (let i = 0; i < length; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const { count = 50, discountPercent = 20, prefix = "BLEASS", description } = req.body as {
    count?: number;
    discountPercent?: number;
    prefix?: string;
    description?: string;
  };

  if (count > 1000) {
    res.status(400).json({ error: "Max 1000 codes per request" });
    return;
  }

  const client = new Client({ host: "/tmp", user: "johnclawd", database: "bleass_db" });

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
    const generated: string[] = [];
    let attempts = 0;
    while (generated.length < count && attempts < count * 3) {
      attempts++;
      const code = generateCode(prefix);
      const exists = await client.query(`SELECT id FROM promotion WHERE code = $1`, [code]);
      if (exists.rows.length === 0) generated.push(code);
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
  } finally {
    await client.end();
  }
}
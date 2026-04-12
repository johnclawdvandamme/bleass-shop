// GET /store/custom/promo-codes/validate/:code
// Validates a promo code and returns discount info
import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { Modules } from "@medusajs/framework/utils";

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const { code } = req.params;

  if (!code) {
    res.status(400).json({ error: "Code required" });
    return;
  }

  // Query DB directly for promo details
  const { Client } = require("pg");
  const client = new Client({ host: "/tmp", user: "johnclawd", database: "bleass_db" });

  try {
    await client.connect();

    const result = await client.query(`
      SELECT
        p.code, p.status, p."limit", p.used, p.type,
        am.type as discount_type, am.value as discount_value,
        pc.name as campaign, pc.starts_at, pc.ends_at
      FROM promotion p
      LEFT JOIN promotion_application_method am ON am.promotion_id = p.id
      LEFT JOIN promotion_campaign pc ON pc.id = p.campaign_id
      WHERE p.code = $1 AND p.deleted_at IS NULL
    `, [code.toUpperCase()]);

    if (result.rows.length === 0) {
      res.status(404).json({ valid: false, error: "Code not found" });
      return;
    }

    const promo = result.rows[0];

    // Check if already used up
    if (promo.limit !== null && promo.used >= promo.limit) {
      res.status(400).json({ valid: false, error: "Code has reached its usage limit" });
      return;
    }

    // Check if campaign is active
    const now = new Date();
    if (promo.starts_at && new Date(promo.starts_at) > now) {
      res.status(400).json({ valid: false, error: "Campaign has not started yet" });
      return;
    }
    if (promo.ends_at && new Date(promo.ends_at) < now) {
      res.status(400).json({ valid: false, error: "Campaign has ended" });
      return;
    }

    const discountLabel = promo.discount_type === "percentage"
      ? `${promo.discount_value}% off`
      : `$${(Number(promo.discount_value) / 100).toFixed(2)} off`;

    res.json({
      valid: true,
      code: promo.code,
      discountType: promo.discount_type,
      discountValue: promo.discount_value,
      discountLabel,
      campaign: promo.campaign,
      remaining: promo.limit !== null ? promo.limit - promo.used : null,
    });
  } finally {
    await client.end();
  }
}
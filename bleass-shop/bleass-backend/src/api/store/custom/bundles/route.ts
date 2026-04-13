// GET /store/custom/bundles
// Returns all products flagged as bundles with their included plugins and pricing
import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { Client } from "pg";

function formatPrice(cents: number, currency = "eur"): string {
  const symbols: Record<string, string> = { eur: "€", usd: "$", gbp: "£" };
  return `${(cents / 100).toFixed(2)}${symbols[currency] || "€"}`;
}

async function getVariantPrice(client: any, variantId: string): Promise<number> {
  const res = await client.query(
    `SELECT pr.amount FROM product_variant pv
     JOIN product_variant_price_set pvps ON pvps.variant_id = pv.id
     JOIN price_set ps ON ps.id = pvps.price_set_id
     JOIN price pr ON pr.price_set_id = ps.id AND pr.currency_code = 'eur'
     WHERE pv.id = $1 LIMIT 1`,
    [variantId]
  );
  return res.rows[0]?.amount || 0;
}

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const client = new Client({ host: "/tmp", user: "johnclawd", database: "bleass_db" });

  try {
    await client.connect();

    // Get bundles (products with includedPlugins metadata AND isBundle=true)
    const result = await client.query(`
      SELECT p.id, p.title, p.handle, p.thumbnail, p.metadata
      FROM product p
      WHERE p.metadata->'includedPlugins' IS NOT NULL
        AND p.metadata->>'isBundle' = 'true'
        AND p.deleted_at IS NULL
      ORDER BY p.title
    `);

    const bundles = await Promise.all(
      result.rows.map(async (row) => {
        const plugins: Array<{
          id: string;
          handle: string;
          name: string;
          price: number;
        }> = row.metadata?.includedPlugins || [];

        const originalPriceTotal = plugins.reduce((sum, p) => sum + (p.price || 0), 0);

        // Get variant ID and price for the bundle product
        const variantRes = await client.query(
          `SELECT pv.id, pv.title, pr.amount
           FROM product_variant pv
           JOIN product_variant_price_set pvps ON pvps.variant_id = pv.id
           JOIN price_set ps ON ps.id = pvps.price_set_id
           JOIN price pr ON pr.price_set_id = ps.id AND pr.currency_code = 'eur'
           WHERE pv.product_id = $1 LIMIT 1`,
          [row.id]
        );

        const variant = variantRes.rows[0];
        const bundlePrice = variant?.amount || originalPriceTotal;
        const savings = originalPriceTotal - bundlePrice;
        const savingsPercent =
          originalPriceTotal > 0 ? Math.round((savings / originalPriceTotal) * 100) : 0;

        return {
          id: row.id,
          title: row.title,
          handle: row.handle,
          thumbnail: row.thumbnail,
          variantId: variant?.id || null,
          plugins: plugins.map((p) => ({
            ...p,
            priceLabel: formatPrice(p.price),
          })),
          pricing: {
            originalTotal: originalPriceTotal,
            originalTotalLabel: formatPrice(originalPriceTotal),
            bundlePrice,
            bundlePriceLabel: formatPrice(bundlePrice),
            savings,
            savingsLabel: formatPrice(savings),
            savingsPercent,
          },
        };
      })
    );

    res.json({ bundles, count: bundles.length });
  } finally {
    await client.end();
  }
}
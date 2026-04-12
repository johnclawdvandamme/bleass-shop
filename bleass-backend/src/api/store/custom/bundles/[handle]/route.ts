// GET /store/custom/bundles/[handle]
// Returns a specific bundle with full plugin breakdown
import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { Client } from "pg";

function formatPrice(cents: number, currency = "eur"): string {
  const symbols: Record<string, string> = { eur: "€", usd: "$", gbp: "£" };
  return `${(cents / 100).toFixed(2)}${symbols[currency] || "€"}`;
}

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const { handle } = req.params;

  if (!handle) {
    res.status(400).json({ error: "Handle required" });
    return;
  }

  const client = new Client({ host: "/tmp", user: "johnclawd", database: "bleass_db" });

  try {
    await client.connect();

    // Get the bundle product by handle
    const productRes = await client.query(
      `SELECT p.id, p.title, p.handle, p.description, p.thumbnail, p.metadata
       FROM product p
       WHERE p.handle = $1 AND p.deleted_at IS NULL`,
      [handle]
    );

    if (productRes.rows.length === 0) {
      res.status(404).json({ error: "Bundle not found" });
      return;
    }

    const product = productRes.rows[0];
    const plugins: Array<{ id: string; handle: string; name: string; price: number }> =
      product.metadata?.includedPlugins || [];

    // Get variant for the bundle
    const variantRes = await client.query(
      `SELECT pv.id, pv.title, pr.amount as price
       FROM product_variant pv
       JOIN product_variant_price_set pvps ON pvps.variant_id = pv.id
       JOIN price_set ps ON ps.id = pvps.price_set_id
       JOIN price pr ON pr.price_set_id = ps.id AND pr.currency_code = 'eur'
       WHERE pv.product_id = $1 LIMIT 1`,
      [product.id]
    );

    const variant = variantRes.rows[0];
    const bundlePrice = variant?.price || 0;
    const originalPriceTotal = plugins.reduce((sum, p) => sum + (p.price || 0), 0);
    const savings = originalPriceTotal - bundlePrice;
    const savingsPercent =
      originalPriceTotal > 0 ? Math.round((savings / originalPriceTotal) * 100) : 0;

    // Get thumbnails for each included plugin
    const pluginDetails = await Promise.all(
      plugins.map(async (p) => {
        const pluginRes = await client.query(
          `SELECT p.thumbnail, p.description
           FROM product p WHERE p.id = $1 AND p.deleted_at IS NULL LIMIT 1`,
          [p.id]
        );
        return {
          ...p,
          priceLabel: formatPrice(p.price),
          thumbnail: pluginRes.rows[0]?.thumbnail || null,
          description: pluginRes.rows[0]?.description?.slice(0, 200) || null,
        };
      })
    );

    res.json({
      bundle: {
        id: product.id,
        title: product.title,
        handle: product.handle,
        description: product.description,
        thumbnail: product.thumbnail,
        variantId: variant?.id || null,
        plugins: pluginDetails,
        pricing: {
          originalTotal: originalPriceTotal,
          originalTotalLabel: formatPrice(originalPriceTotal),
          bundlePrice,
          bundlePriceLabel: formatPrice(bundlePrice),
          savings,
          savingsLabel: formatPrice(savings),
          savingsPercent,
        },
      },
    });
  } finally {
    await client.end();
  }
}
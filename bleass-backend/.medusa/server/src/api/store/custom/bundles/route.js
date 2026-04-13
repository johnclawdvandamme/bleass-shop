"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = GET;
const pg_1 = require("pg");
function formatPrice(cents, currency = "eur") {
    const symbols = { eur: "€", usd: "$", gbp: "£" };
    return `${(cents / 100).toFixed(2)}${symbols[currency] || "€"}`;
}
async function getVariantPrice(client, variantId) {
    const res = await client.query(`SELECT pr.amount FROM product_variant pv
     JOIN product_variant_price_set pvps ON pvps.variant_id = pv.id
     JOIN price_set ps ON ps.id = pvps.price_set_id
     JOIN price pr ON pr.price_set_id = ps.id AND pr.currency_code = 'eur'
     WHERE pv.id = $1 LIMIT 1`, [variantId]);
    return res.rows[0]?.amount || 0;
}
async function GET(req, res) {
    const client = new pg_1.Client({ host: "/tmp", user: "johnclawd", database: "bleass_db" });
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
        const bundles = await Promise.all(result.rows.map(async (row) => {
            const plugins = row.metadata?.includedPlugins || [];
            const originalPriceTotal = plugins.reduce((sum, p) => sum + (p.price || 0), 0);
            // Get variant ID and price for the bundle product
            const variantRes = await client.query(`SELECT pv.id, pv.title, pr.amount
           FROM product_variant pv
           JOIN product_variant_price_set pvps ON pvps.variant_id = pv.id
           JOIN price_set ps ON ps.id = pvps.price_set_id
           JOIN price pr ON pr.price_set_id = ps.id AND pr.currency_code = 'eur'
           WHERE pv.product_id = $1 LIMIT 1`, [row.id]);
            const variant = variantRes.rows[0];
            const bundlePrice = variant?.amount || originalPriceTotal;
            const savings = originalPriceTotal - bundlePrice;
            const savingsPercent = originalPriceTotal > 0 ? Math.round((savings / originalPriceTotal) * 100) : 0;
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
        }));
        res.json({ bundles, count: bundles.length });
    }
    finally {
        await client.end();
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvYXBpL3N0b3JlL2N1c3RvbS9idW5kbGVzL3JvdXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBc0JBLGtCQXVFQztBQTFGRCwyQkFBNEI7QUFFNUIsU0FBUyxXQUFXLENBQUMsS0FBYSxFQUFFLFFBQVEsR0FBRyxLQUFLO0lBQ2xELE1BQU0sT0FBTyxHQUEyQixFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUM7SUFDekUsT0FBTyxHQUFHLENBQUMsS0FBSyxHQUFHLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLElBQUksR0FBRyxFQUFFLENBQUM7QUFDbEUsQ0FBQztBQUVELEtBQUssVUFBVSxlQUFlLENBQUMsTUFBVyxFQUFFLFNBQWlCO0lBQzNELE1BQU0sR0FBRyxHQUFHLE1BQU0sTUFBTSxDQUFDLEtBQUssQ0FDNUI7Ozs7OEJBSTBCLEVBQzFCLENBQUMsU0FBUyxDQUFDLENBQ1osQ0FBQztJQUNGLE9BQU8sR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxNQUFNLElBQUksQ0FBQyxDQUFDO0FBQ2xDLENBQUM7QUFFTSxLQUFLLFVBQVUsR0FBRyxDQUFDLEdBQWtCLEVBQUUsR0FBbUI7SUFDL0QsTUFBTSxNQUFNLEdBQUcsSUFBSSxXQUFNLENBQUMsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUUsUUFBUSxFQUFFLFdBQVcsRUFBRSxDQUFDLENBQUM7SUFFdEYsSUFBSSxDQUFDO1FBQ0gsTUFBTSxNQUFNLENBQUMsT0FBTyxFQUFFLENBQUM7UUFFdkIseUVBQXlFO1FBQ3pFLE1BQU0sTUFBTSxHQUFHLE1BQU0sTUFBTSxDQUFDLEtBQUssQ0FBQzs7Ozs7OztLQU9qQyxDQUFDLENBQUM7UUFFSCxNQUFNLE9BQU8sR0FBRyxNQUFNLE9BQU8sQ0FBQyxHQUFHLENBQy9CLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsRUFBRTtZQUM1QixNQUFNLE9BQU8sR0FLUixHQUFHLENBQUMsUUFBUSxFQUFFLGVBQWUsSUFBSSxFQUFFLENBQUM7WUFFekMsTUFBTSxrQkFBa0IsR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEtBQUssSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUUvRSxrREFBa0Q7WUFDbEQsTUFBTSxVQUFVLEdBQUcsTUFBTSxNQUFNLENBQUMsS0FBSyxDQUNuQzs7Ozs7NENBS2tDLEVBQ2xDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUNULENBQUM7WUFFRixNQUFNLE9BQU8sR0FBRyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ25DLE1BQU0sV0FBVyxHQUFHLE9BQU8sRUFBRSxNQUFNLElBQUksa0JBQWtCLENBQUM7WUFDMUQsTUFBTSxPQUFPLEdBQUcsa0JBQWtCLEdBQUcsV0FBVyxDQUFDO1lBQ2pELE1BQU0sY0FBYyxHQUNsQixrQkFBa0IsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxPQUFPLEdBQUcsa0JBQWtCLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBRWhGLE9BQU87Z0JBQ0wsRUFBRSxFQUFFLEdBQUcsQ0FBQyxFQUFFO2dCQUNWLEtBQUssRUFBRSxHQUFHLENBQUMsS0FBSztnQkFDaEIsTUFBTSxFQUFFLEdBQUcsQ0FBQyxNQUFNO2dCQUNsQixTQUFTLEVBQUUsR0FBRyxDQUFDLFNBQVM7Z0JBQ3hCLFNBQVMsRUFBRSxPQUFPLEVBQUUsRUFBRSxJQUFJLElBQUk7Z0JBQzlCLE9BQU8sRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO29CQUMzQixHQUFHLENBQUM7b0JBQ0osVUFBVSxFQUFFLFdBQVcsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO2lCQUNqQyxDQUFDLENBQUM7Z0JBQ0gsT0FBTyxFQUFFO29CQUNQLGFBQWEsRUFBRSxrQkFBa0I7b0JBQ2pDLGtCQUFrQixFQUFFLFdBQVcsQ0FBQyxrQkFBa0IsQ0FBQztvQkFDbkQsV0FBVztvQkFDWCxnQkFBZ0IsRUFBRSxXQUFXLENBQUMsV0FBVyxDQUFDO29CQUMxQyxPQUFPO29CQUNQLFlBQVksRUFBRSxXQUFXLENBQUMsT0FBTyxDQUFDO29CQUNsQyxjQUFjO2lCQUNmO2FBQ0YsQ0FBQztRQUNKLENBQUMsQ0FBQyxDQUNILENBQUM7UUFFRixHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQztJQUMvQyxDQUFDO1lBQVMsQ0FBQztRQUNULE1BQU0sTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDO0lBQ3JCLENBQUM7QUFDSCxDQUFDIn0=
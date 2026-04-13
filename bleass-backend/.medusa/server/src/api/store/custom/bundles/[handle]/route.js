"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = GET;
const pg_1 = require("pg");
function formatPrice(cents, currency = "eur") {
    const symbols = { eur: "€", usd: "$", gbp: "£" };
    return `${(cents / 100).toFixed(2)}${symbols[currency] || "€"}`;
}
async function GET(req, res) {
    const { handle } = req.params;
    if (!handle) {
        res.status(400).json({ error: "Handle required" });
        return;
    }
    const client = new pg_1.Client({ host: "/tmp", user: "johnclawd", database: "bleass_db" });
    try {
        await client.connect();
        // Get the bundle product by handle
        const productRes = await client.query(`SELECT p.id, p.title, p.handle, p.description, p.thumbnail, p.metadata
       FROM product p
       WHERE p.handle = $1 AND p.deleted_at IS NULL`, [handle]);
        if (productRes.rows.length === 0) {
            res.status(404).json({ error: "Bundle not found" });
            return;
        }
        const product = productRes.rows[0];
        const plugins = product.metadata?.includedPlugins || [];
        // Get variant for the bundle
        const variantRes = await client.query(`SELECT pv.id, pv.title, pr.amount as price
       FROM product_variant pv
       JOIN product_variant_price_set pvps ON pvps.variant_id = pv.id
       JOIN price_set ps ON ps.id = pvps.price_set_id
       JOIN price pr ON pr.price_set_id = ps.id AND pr.currency_code = 'eur'
       WHERE pv.product_id = $1 LIMIT 1`, [product.id]);
        const variant = variantRes.rows[0];
        const bundlePrice = variant?.price || 0;
        const originalPriceTotal = plugins.reduce((sum, p) => sum + (p.price || 0), 0);
        const savings = originalPriceTotal - bundlePrice;
        const savingsPercent = originalPriceTotal > 0 ? Math.round((savings / originalPriceTotal) * 100) : 0;
        // Get thumbnails for each included plugin
        const pluginDetails = await Promise.all(plugins.map(async (p) => {
            const pluginRes = await client.query(`SELECT p.thumbnail, p.description
           FROM product p WHERE p.id = $1 AND p.deleted_at IS NULL LIMIT 1`, [p.id]);
            return {
                ...p,
                priceLabel: formatPrice(p.price),
                thumbnail: pluginRes.rows[0]?.thumbnail || null,
                description: pluginRes.rows[0]?.description?.slice(0, 200) || null,
            };
        }));
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
    }
    finally {
        await client.end();
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvYXBpL3N0b3JlL2N1c3RvbS9idW5kbGVzL1toYW5kbGVdL3JvdXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBVUEsa0JBd0ZDO0FBL0ZELDJCQUE0QjtBQUU1QixTQUFTLFdBQVcsQ0FBQyxLQUFhLEVBQUUsUUFBUSxHQUFHLEtBQUs7SUFDbEQsTUFBTSxPQUFPLEdBQTJCLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQztJQUN6RSxPQUFPLEdBQUcsQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsSUFBSSxHQUFHLEVBQUUsQ0FBQztBQUNsRSxDQUFDO0FBRU0sS0FBSyxVQUFVLEdBQUcsQ0FBQyxHQUFrQixFQUFFLEdBQW1CO0lBQy9ELE1BQU0sRUFBRSxNQUFNLEVBQUUsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDO0lBRTlCLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUNaLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsS0FBSyxFQUFFLGlCQUFpQixFQUFFLENBQUMsQ0FBQztRQUNuRCxPQUFPO0lBQ1QsQ0FBQztJQUVELE1BQU0sTUFBTSxHQUFHLElBQUksV0FBTSxDQUFDLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFLFFBQVEsRUFBRSxXQUFXLEVBQUUsQ0FBQyxDQUFDO0lBRXRGLElBQUksQ0FBQztRQUNILE1BQU0sTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBRXZCLG1DQUFtQztRQUNuQyxNQUFNLFVBQVUsR0FBRyxNQUFNLE1BQU0sQ0FBQyxLQUFLLENBQ25DOztvREFF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
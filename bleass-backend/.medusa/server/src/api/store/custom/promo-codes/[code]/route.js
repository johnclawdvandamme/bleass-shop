"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = GET;
async function GET(req, res) {
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
    }
    finally {
        await client.end();
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvYXBpL3N0b3JlL2N1c3RvbS9wcm9tby1jb2Rlcy9bY29kZV0vcm91dGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFLQSxrQkFrRUM7QUFsRU0sS0FBSyxVQUFVLEdBQUcsQ0FBQyxHQUFrQixFQUFFLEdBQW1CO0lBQy9ELE1BQU0sRUFBRSxJQUFJLEVBQUUsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDO0lBRTVCLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNWLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsS0FBSyxFQUFFLGVBQWUsRUFBRSxDQUFDLENBQUM7UUFDakQsT0FBTztJQUNULENBQUM7SUFFRCxzQ0FBc0M7SUFDdEMsTUFBTSxFQUFFLE1BQU0sRUFBRSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNqQyxNQUFNLE1BQU0sR0FBRyxJQUFJLE1BQU0sQ0FBQyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRSxRQUFRLEVBQUUsV0FBVyxFQUFFLENBQUMsQ0FBQztJQUV0RixJQUFJLENBQUM7UUFDSCxNQUFNLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUV2QixNQUFNLE1BQU0sR0FBRyxNQUFNLE1BQU0sQ0FBQyxLQUFLLENBQUM7Ozs7Ozs7OztLQVNqQyxFQUFFLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUV6QixJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRSxDQUFDO1lBQzdCLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsZ0JBQWdCLEVBQUUsQ0FBQyxDQUFDO1lBQ2hFLE9BQU87UUFDVCxDQUFDO1FBRUQsTUFBTSxLQUFLLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUU3QiwyQkFBMkI7UUFDM0IsSUFBSSxLQUFLLENBQUMsS0FBSyxLQUFLLElBQUksSUFBSSxLQUFLLENBQUMsSUFBSSxJQUFJLEtBQUssQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUN0RCxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLGtDQUFrQyxFQUFFLENBQUMsQ0FBQztZQUNsRixPQUFPO1FBQ1QsQ0FBQztRQUVELDhCQUE4QjtRQUM5QixNQUFNLEdBQUcsR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDO1FBQ3ZCLElBQUksS0FBSyxDQUFDLFNBQVMsSUFBSSxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUM7WUFDdkQsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSw4QkFBOEIsRUFBRSxDQUFDLENBQUM7WUFDOUUsT0FBTztRQUNULENBQUM7UUFDRCxJQUFJLEtBQUssQ0FBQyxPQUFPLElBQUksSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDO1lBQ25ELEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsb0JBQW9CLEVBQUUsQ0FBQyxDQUFDO1lBQ3BFLE9BQU87UUFDVCxDQUFDO1FBRUQsTUFBTSxhQUFhLEdBQUcsS0FBSyxDQUFDLGFBQWEsS0FBSyxZQUFZO1lBQ3hELENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxjQUFjLE9BQU87WUFDaEMsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDO1FBRTlELEdBQUcsQ0FBQyxJQUFJLENBQUM7WUFDUCxLQUFLLEVBQUUsSUFBSTtZQUNYLElBQUksRUFBRSxLQUFLLENBQUMsSUFBSTtZQUNoQixZQUFZLEVBQUUsS0FBSyxDQUFDLGFBQWE7WUFDakMsYUFBYSxFQUFFLEtBQUssQ0FBQyxjQUFjO1lBQ25DLGFBQWE7WUFDYixRQUFRLEVBQUUsS0FBSyxDQUFDLFFBQVE7WUFDeEIsU0FBUyxFQUFFLEtBQUssQ0FBQyxLQUFLLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUk7U0FDbEUsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztZQUFTLENBQUM7UUFDVCxNQUFNLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQztJQUNyQixDQUFDO0FBQ0gsQ0FBQyJ9
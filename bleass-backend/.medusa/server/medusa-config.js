"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { defineConfig } = require("@medusajs/framework/utils");
module.exports = defineConfig({
    projectConfig: {
        databaseUrl: process.env.DATABASE_URL || "postgresql://bleass_db_user:oGDjhWteQN8PuSzVoBqvFmRLrTOAFfvB@dpg-d7e8okreo5us7383u2ag-a/bleass_db",
        databaseType: "postgres",
        http: {
            storeCors: process.env.STORE_CORS || "*",
            adminCors: process.env.ADMIN_CORS || "http://localhost:5173",
            authCors: process.env.AUTH_CORS || "http://localhost:5173",
            jwtSecret: process.env.JWT_SECRET || "bleass_jwt_secret_2026",
            cookieSecret: process.env.COOKIE_SECRET || "bleass_cookie_secret_2026",
        },
    },
    admin: {
        path: "/app",
        port: process.env.MEDUSA_ADMIN_PORT || 9000,
    },
    // ═══════════════════════════════════════════════════════════════
    // PLUGINS / MODULES INSTALLED
    // (ecosystem is much smaller than WooCommerce — Medusa v2 = ~20 plugins)
    // ═══════════════════════════════════════════════════════════════
    modules: {
    // ── File Storage ─────────────────────────────────────────
    // Local storage (default, always present)
    // S3 (installed: @medusajs/file-s3)
    // Uncomment and configure below when AWS credentials are ready
    // "@medusajs/file-s3": {
    //   resolve: "@medusajs/file-s3",
    //   options: {
    //     awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
    //     awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    //     awsRegion: process.env.AWS_REGION || "eu-west-1",
    //     bucket: process.env.AWS_S3_BUCKET,
    //     urlPrefix: process.env.AWS_S3_URL_PREFIX,
    //   },
    // },
    // ── Notifications ─────────────────────────────────────────
    // SendGrid (installed: @medusajs/notification-sendgrid)
    // Configure in .env: SENDGRID_API_KEY, SENDGRID_FROM
    // "@medusajs/notification-sendgrid": {
    //   resolve: "@medusajs/notification-sendgrid",
    //   options: {
    //     apiKey: process.env.SENDGRID_API_KEY,
    //     from: process.env.SENDGRID_FROM || "noreply@bleass.com",
    //   },
    // },
    // ── Payments ──────────────────────────────────────────────
    // Stripe (installed: @medusajs/payment-stripe)
    // Note: v2 modules are registered via MedusaModule.register() in src/index.ts
    // not via medusa-config.ts modules{} block. See src/index.ts for module setup.
    //
    // HOW TO CONFIGURE STRIPE in Medusa v2:
    // 1. Set environment vars: STRIPE_API_KEY, STRIPE_WEBHOOK_SECRET
    // 2. Create/update src/index.ts to register the payment module
    // 3. Restart the server
    //
    // @medusajs/payment-stripe exports services: StripeProviderService (stripe),
    // StripeIdealService, StripeGiropayService, StripeBancontactService,
    // StripeBlikService, StripePrzelewy24Service, StripePromptpayService,
    // OxxoProviderService (stripe-oxxo)
    //
    // payment: {
    //   resolve: "@medusajs/payment-stripe",
    //   options: {
    //     apiKey: process.env.STRIPE_API_KEY,
    //     webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
    //   },
    // },
    // ── Auth ──────────────────────────────────────────────────
    // Google OAuth (installed: @medusajs/auth-google)
    // "@medusajs/auth-google": {
    //   resolve: "@medusajs/auth-google",
    //   options: {
    //     clientId: process.env.GOOGLE_CLIENT_ID,
    //     clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    //     adminCors: process.env.ADMIN_CORS || "http://localhost:5173",
    //     authCors: process.env.AUTH_CORS || "http://localhost:5173",
    //     callbackUrl: process.env.GOOGLE_CALLBACK_URL || "http://localhost:9000/auth/google/callback",
    //   },
    // },
    // GitHub OAuth (installed: @medusajs/auth-github)
    // "@medusajs/auth-github": {
    //   resolve: "@medusajs/auth-github",
    //   options: {
    //     clientId: process.env.GITHUB_CLIENT_ID,
    //     clientSecret: process.env.GITHUB_CLIENT_SECRET,
    //     adminCors: process.env.ADMIN_CORS || "http://localhost:5173",
    //     authCors: process.env.AUTH_CORS || "http://localhost:5173",
    //     callbackUrl: process.env.GITHUB_CALLBACK_URL || "http://localhost:9000/auth/github/callback",
    //   },
    // },
    // ── Redis (optional — requires Redis running) ─────────────
    // Uncomment if Redis is available. Falls back to in-memory when absent.
    // "@medusajs/cache-redis": {
    //   resolve: "@medusajs/cache-redis",
    //   options: {
    //     redisUrl: process.env.REDIS_URL || "redis://red-d7e92kvaqgkc73fu221g:6379",
    //   },
    // },
    // "@medusajs/event-bus-redis": {
    //   resolve: "@medusajs/event-bus-redis",
    //   options: {
    //     redisUrl: process.env.REDIS_URL || "redis://red-d7e92kvaqgkc73fu221g:6379",
    //   },
    // },
    },
    // ═══════════════════════════════════════════════════════════════
    // PLUGINS COMMUNITY (v1-only, NOT compatible with Medusa v2)
    // These exist on npm but require Medusa v1.x — they will NOT work:
    //   medusa-plugin-sendgrid       → v1 only (superseded by @medusajs/notification-sendgrid)
    //   medusa-plugin-twilio-sms     → v1 only
    //   medusa-plugin-algolia        → v1 only (no v2 equivalent)
    //   medusa-plugin-meilisearch    → v1 only (no v2 equivalent)
    //   medusa-plugin-segment        → v1 only (no v2 equivalent)
    //   medusa-plugin-sentry         → v1 only (no v2 equivalent)
    //   medusa-plugin-paypal         → v1 only (use @medusajs/payment-stripe instead)
    //   medusa-plugin-postmark       → v1 only
    //   medusa-plugin-klaviyo       → v1 only
    //   medusa-plugin-contentful    → v1 only (no v2 equivalent)
    //   medusa-plugin-sanity         → v1 only (no v2 equivalent)
    //   medusa-plugin-strapi         → v1 only (no v2 equivalent)
    //   medusa-plugin-abandoned-cart → v1 only (no v2 equivalent)
    //   medusa-plugin-file-cloud-storage → v1 only (use @medusajs/file-s3)
    //   medusa-plugin-r2             → v2 but requires admin-sdk 2.12.4 vs 2.13.6 installed
    //
    // MEDUSA v2 ECOSYSTEM REALITY: only ~8 community plugins work, vs 20k+ for WooCommerce
    // ═══════════════════════════════════════════════════════════════
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVkdXNhLWNvbmZpZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL21lZHVzYS1jb25maWcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxNQUFNLEVBQUUsWUFBWSxFQUFFLEdBQUcsT0FBTyxDQUFDLDJCQUEyQixDQUFDLENBQUM7QUFFOUQsTUFBTSxDQUFDLE9BQU8sR0FBRyxZQUFZLENBQUM7SUFDNUIsYUFBYSxFQUFFO1FBQ2IsV0FBVyxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsWUFBWSxJQUFJLG1HQUFtRztRQUM1SSxZQUFZLEVBQUUsVUFBVTtRQUN4QixJQUFJLEVBQUU7WUFDSixTQUFTLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFVLElBQUksR0FBRztZQUN4QyxTQUFTLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFVLElBQUksdUJBQXVCO1lBQzVELFFBQVEsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLFNBQVMsSUFBSSx1QkFBdUI7WUFDMUQsU0FBUyxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxJQUFJLHdCQUF3QjtZQUM3RCxZQUFZLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxhQUFhLElBQUksMkJBQTJCO1NBQ3ZFO0tBQ0Y7SUFDRCxLQUFLLEVBQUU7UUFDTCxJQUFJLEVBQUUsTUFBTTtRQUNaLElBQUksRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLGlCQUFpQixJQUFJLElBQUk7S0FDNUM7SUFFRCxrRUFBa0U7SUFDbEUsOEJBQThCO0lBQzlCLHlFQUF5RTtJQUN6RSxrRUFBa0U7SUFFbEUsT0FBTyxFQUFFO0lBQ1AsNERBQTREO0lBQzVELDBDQUEwQztJQUMxQyxvQ0FBb0M7SUFDcEMsK0RBQStEO0lBQy9ELHlCQUF5QjtJQUN6QixrQ0FBa0M7SUFDbEMsZUFBZTtJQUNmLHFEQUFxRDtJQUNyRCw2REFBNkQ7SUFDN0Qsd0RBQXdEO0lBQ3hELHlDQUF5QztJQUN6QyxnREFBZ0Q7SUFDaEQsT0FBTztJQUNQLEtBQUs7SUFFTCw2REFBNkQ7SUFDN0Qsd0RBQXdEO0lBQ3hELHFEQUFxRDtJQUNyRCx1Q0FBdUM7SUFDdkMsZ0RBQWdEO0lBQ2hELGVBQWU7SUFDZiw0Q0FBNEM7SUFDNUMsK0RBQStEO0lBQy9ELE9BQU87SUFDUCxLQUFLO0lBRUwsNkRBQTZEO0lBQzdELCtDQUErQztJQUMvQyw4RUFBOEU7SUFDOUUsK0VBQStFO0lBQy9FLEVBQUU7SUFDRix3Q0FBd0M7SUFDeEMsaUVBQWlFO0lBQ2pFLCtEQUErRDtJQUMvRCx3QkFBd0I7SUFDeEIsRUFBRTtJQUNGLDZFQUE2RTtJQUM3RSxxRUFBcUU7SUFDckUsc0VBQXNFO0lBQ3RFLG9DQUFvQztJQUNwQyxFQUFFO0lBQ0YsYUFBYTtJQUNiLHlDQUF5QztJQUN6QyxlQUFlO0lBQ2YsMENBQTBDO0lBQzFDLHdEQUF3RDtJQUN4RCxPQUFPO0lBQ1AsS0FBSztJQUVMLDZEQUE2RDtJQUM3RCxrREFBa0Q7SUFDbEQsNkJBQTZCO0lBQzdCLHNDQUFzQztJQUN0QyxlQUFlO0lBQ2YsOENBQThDO0lBQzlDLHNEQUFzRDtJQUN0RCxvRUFBb0U7SUFDcEUsa0VBQWtFO0lBQ2xFLG9HQUFvRztJQUNwRyxPQUFPO0lBQ1AsS0FBSztJQUVMLGtEQUFrRDtJQUNsRCw2QkFBNkI7SUFDN0Isc0NBQXNDO0lBQ3RDLGVBQWU7SUFDZiw4Q0FBOEM7SUFDOUMsc0RBQXNEO0lBQ3RELG9FQUFvRTtJQUNwRSxrRUFBa0U7SUFDbEUsb0dBQW9HO0lBQ3BHLE9BQU87SUFDUCxLQUFLO0lBRUwsNkRBQTZEO0lBQzdELHdFQUF3RTtJQUN4RSw2QkFBNkI7SUFDN0Isc0NBQXNDO0lBQ3RDLGVBQWU7SUFDZixrRkFBa0Y7SUFDbEYsT0FBTztJQUNQLEtBQUs7SUFDTCxpQ0FBaUM7SUFDakMsMENBQTBDO0lBQzFDLGVBQWU7SUFDZixrRkFBa0Y7SUFDbEYsT0FBTztJQUNQLEtBQUs7S0FDTjtJQUVELGtFQUFrRTtJQUNsRSw2REFBNkQ7SUFDN0QsbUVBQW1FO0lBQ25FLDJGQUEyRjtJQUMzRiwyQ0FBMkM7SUFDM0MsOERBQThEO0lBQzlELDhEQUE4RDtJQUM5RCw4REFBOEQ7SUFDOUQsOERBQThEO0lBQzlELGtGQUFrRjtJQUNsRiwyQ0FBMkM7SUFDM0MsMENBQTBDO0lBQzFDLDZEQUE2RDtJQUM3RCw4REFBOEQ7SUFDOUQsOERBQThEO0lBQzlELDhEQUE4RDtJQUM5RCx1RUFBdUU7SUFDdkUsd0ZBQXdGO0lBQ3hGLEVBQUU7SUFDRix1RkFBdUY7SUFDdkYsa0VBQWtFO0NBQ25FLENBQUMsQ0FBQyJ9
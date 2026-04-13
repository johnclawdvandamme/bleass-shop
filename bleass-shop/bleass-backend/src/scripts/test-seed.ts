import { ExecArgs } from "@medusajs/framework/types";
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";
import { ProductStatus } from "@medusajs/framework/utils";

export default async function testSeed({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const productService = container.resolve(Modules.PRODUCT);

  logger.info("Testing product creation...");

  // List existing products
  const existing = await productService.listProducts({});
  logger.info(`Existing products: ${existing.length}`);

  // Try creating a simple product
  try {
    const result = await productService.createProducts({
      title: "Test Product",
      status: ProductStatus.PUBLISHED,
      options: [{ title: "Size", values: ["S", "M", "L"] }],
      variants: [
        {
          title: "Medium",
          sku: "TEST-MEDIUM",
          prices: [{ amount: 2999, currency_code: "eur" }],
        },
      ],
    });
    logger.info(`Created product: ${result.id}`);
  } catch (e) {
    logger.error(`Error creating product: ${e.message}`);
  }

  // List products again
  const after = await productService.listProducts({});
  logger.info(`Products after: ${after.length}`);
}
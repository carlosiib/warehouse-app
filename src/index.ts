import { serve } from "@hono/node-server";
import { Hono } from "hono";
import dotenv from "dotenv";

dotenv.config();

const app = new Hono();
const port = Number(process.env.PORT) || 3000;

const SHOP = process.env.SHOPIFY_STORE!;
const TOKEN = process.env.SHOPIFY_ACCESS_TOKEN!;

console.log({ SHOP, TOKEN });

app.get("/", (c) => {
  return c.json({ message: "warehouse app" });
});

app.get("/products", async (c) => {
  const response = await fetch(
    `https://${SHOP}/admin/api/2025-07/graphql.json`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": TOKEN,
      },
      body: JSON.stringify({
        query: `
          query {
            products(first: 20) {
              nodes {
                id
                title
                handle
                vendor
                status
                featuredImage {
                  url
                }
                variants(first: 5) {
                  nodes {
                    id
                    title
                    price
                  }
                }
              }
            }
          }
        `,
      }),
    },
  );

  if (!response.ok) {
    return c.json(await response.json(), response);
  }

  const data = await response.json();

  return c.json(data.data.products.nodes);
});

serve(
  {
    fetch: app.fetch,
    port,
  },
  (info) => {
    console.log(
      `Server is running on http://localhost:${info.port}`,
    );
  },
);

import { serve } from "@hono/node-server";
import { Hono } from "hono";

const app = new Hono();
const port = Number(process.env.PORT) || 3000;

app.get("/", (c) => {
  return c.json({ message: "warehouse app" });
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

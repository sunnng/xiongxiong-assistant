import { Hono } from "hono";

const app = new Hono().post("sign-up", (c) => {
  return c.json({ success: true });
});

export default app;

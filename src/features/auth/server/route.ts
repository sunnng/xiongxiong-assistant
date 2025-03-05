import { Hono } from "hono";
import { ID } from "node-appwrite";
import { setCookie, deleteCookie } from "hono/cookie";

import { zValidator } from "@/lib/validator-wrapper";
import { handleAppwriteError } from "@/lib/error-handle";
import { AUTH_COOKIE, createAdminClient } from "@/lib/appwrite";
import { sessionMiddleware } from "@/lib/session-middleware";

import { signUpSchema, signInSchema } from "../schemas";

const app = new Hono()
  .post("register", zValidator("json", signUpSchema), async (c) => {
    const { name, email, password } = c.req.valid("json");

    try {
      const { account } = await createAdminClient();

      await account.create(ID.unique(), email, password, name);

      const session = await account.createEmailPasswordSession(email, password);

      setCookie(c, AUTH_COOKIE, session.secret, {
        path: "/",
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 30,
      });

      return c.json({
        success: true,
        message: "注册成功！",
      });
    } catch (e) {
      const { isHandled, userMessage, errorCode } = handleAppwriteError(e, {
        logDetails: true,
      });

      return c.json(
        {
          success: false,
          message: userMessage,
        },
        isHandled === true ? errorCode : 500
      );
    }
  })
  .post("login", zValidator("json", signInSchema), async (c) => {
    const { email, password } = c.req.valid("json");

    try {
      const { account } = await createAdminClient();

      const session = await account.createEmailPasswordSession(email, password);

      setCookie(c, AUTH_COOKIE, session.secret, {
        path: "/",
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 30,
      });

      return c.json({
        success: true,
        message: "登录成功！",
      });
    } catch (e) {
      const { isHandled, userMessage, errorCode } = handleAppwriteError(e, {
        logDetails: true,
      });

      return c.json(
        {
          success: false,
          message: userMessage,
        },
        isHandled === true ? errorCode : 500
      );
    }
  })
  .post("logout", sessionMiddleware, async (c) => {
    const account = c.get("account");

    deleteCookie(c, AUTH_COOKIE);
    await account.deleteSession("current");

    return c.json({ success: true, message: "退出登录成功！" });
  })
  .get("current", sessionMiddleware, async (c) => {
    const user = c.get("user");

    return c.json({ success: true, data: user });
  });

export default app;

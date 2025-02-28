import { Hono } from "hono";
import { setCookie } from "hono/cookie";
import { AppwriteException, ID } from "node-appwrite";
import {
  ClientErrorStatusCode,
  ServerErrorStatusCode,
} from "hono/utils/http-status";

import { AUTH_COOKIE, createAdminClient } from "@/lib/appwrite";
import { zValidator } from "@/lib/validator-wrapper";

import { signUpSchema } from "../schemas";

const app = new Hono().post(
  "register",
  zValidator("json", signUpSchema),
  async (c) => {
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
      if (e instanceof AppwriteException) {
        return c.json(
          {
            success: false,
            message: e.message,
          },
          e.code as ClientErrorStatusCode | ServerErrorStatusCode
        );
      } else {
        return c.json(
          {
            success: false,
            message: (e as Error).message,
          },
          401
        );
      }
    }
  }
);

export default app;

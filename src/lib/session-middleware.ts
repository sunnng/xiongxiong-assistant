import "server-only";

import {
  Account,
  Client,
  Databases,
  Models,
  Storage,
  type Account as AccountType,
  type Storage as StorageType,
  type Users as UsersType,
  type Databases as DatabasesType,
} from "node-appwrite";
import { getCookie } from "hono/cookie";
import { createMiddleware } from "hono/factory";

import { AUTH_COOKIE } from "./appwrite";
import { handleAppwriteError } from "./error-handle";

type AdditionalContext = {
  Variables: {
    account: AccountType;
    databases: DatabasesType;
    storage: StorageType;
    users: UsersType;
    user: Models.User<Models.Preferences>;
  };
};

export const sessionMiddleware = createMiddleware<AdditionalContext>(
  async (c, next) => {
    try {
      const client = new Client()
        .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
        .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);

      const session = getCookie(c, AUTH_COOKIE);

      if (!session) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      client.setSession(session);

      const account = new Account(client);
      const databases = new Databases(client);
      const storage = new Storage(client);

      const user = await account.get();

      c.set("account", account);
      c.set("databases", databases);
      c.set("storage", storage);
      c.set("user", user);

      await next();
    } catch (error) {
      const { isHandled, userMessage, errorCode } = handleAppwriteError(error, {
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
  }
);

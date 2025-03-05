import { z } from "zod";
import { Hono } from "hono";
import { Query } from "node-appwrite";

import { DATABASE_ID, GUILDBATTLE_ID } from "@/config";
import { sessionMiddleware } from "@/lib/session-middleware";
import { zValidator } from "@/lib/validator-wrapper";

const app = new Hono().post(
  "battle/records",
  sessionMiddleware,
  zValidator(
    "query",
    z.object({
      guildName: z.string().nullish(),
      seasonName: z.string().nullish(),
      username: z.string().nullish(),
    })
  ),
  async (c) => {
    const databases = c.get("databases");

    const { guildName, seasonName, username } = c.req.valid("query");

    const query = [Query.orderDesc("joinTime")];

    if (guildName) {
      console.log("guildName: ", guildName);
      query.push(Query.equal("guildName", guildName));
    }

    if (seasonName) {
      console.log("seasonName: ", seasonName);
      query.push(Query.equal("seasonName", seasonName));
    }
    if (username) {
      console.log("username: ", username);
      query.push(Query.equal("username", username));
    }

    const records = await databases.listDocuments(
      DATABASE_ID,
      GUILDBATTLE_ID,
      query
    );

    return c.json({
      success: true,
      data: records,
    });
  }
);

export default app;

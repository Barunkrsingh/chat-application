"use node";

import type { WebhookEvent } from "@clerk/clerk-sdk-node";
import { v } from "convex/values";
import { Webhook } from "svix";

import { internalAction } from "./_generated/server";

const WEB_HOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET as string;

export const fulfill = internalAction({
  args: {
    headers: v.object({
      "svix-id": v.string(),
      "svix-signature": v.string(),
      "svix-timestamp": v.string(),
    }),
    payload: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      if (!WEB_HOOK_SECRET) {
        throw new Error("CLERK_WEBHOOK_SECRET is not set in environment.");
      }

      const wh = new Webhook(WEB_HOOK_SECRET);

      const payload = wh.verify(args.payload, {
        "svix-id": args.headers["svix-id"],
        "svix-signature": args.headers["svix-signature"],
        "svix-timestamp": args.headers["svix-timestamp"],
      }) as WebhookEvent;

      console.log("✅ Clerk webhook verified:", payload.type);
      return payload;

    } catch (err) {
      console.error("❌ Failed to verify Clerk webhook:", err);
      throw new Error("Invalid Clerk Webhook");
    }
  },
});

"use node";

import { httpAction } from "./_generated/server";
import { Webhook } from "svix";
import type { WebhookEvent } from "@clerk/clerk-sdk-node";

const WEB_HOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET as string;

export const clerk = httpAction(async (ctx, request) => {
  const payload = await request.text();
  const headers = Object.fromEntries(request.headers.entries());

  try {
    const wh = new Webhook(WEB_HOOK_SECRET);
    const evt = wh.verify(payload, headers) as WebhookEvent;

    console.log("✅ Clerk Webhook Verified:", evt.type);

    // TODO: Do something with evt (like user.created)
    return new Response(null, { status: 200 });
  } catch (err) {
    console.error("❌ Webhook verification failed:", err);
    return new Response("Invalid webhook", { status: 400 });
  }
});

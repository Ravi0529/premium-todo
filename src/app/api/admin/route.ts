import { clerkClient } from "@clerk/nextjs/server";

export async function isAdmin(userId: string) {
  const client = await clerkClient();
  const user = client.users.getUser(userId);
  (await user).privateMetadata.role === "admin";
}

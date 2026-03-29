import { NextResponse } from "next/server";
import { getSessionUserId, COOKIE_NAME } from "@/lib/session";
import { getUserById, deleteUser } from "@/lib/users";

export async function DELETE() {
  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await getUserById(userId);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  await deleteUser(userId, user.email);

  const res = NextResponse.json({ ok: true, message: "Account deleted" });
  res.cookies.set(COOKIE_NAME, "", { maxAge: 0, path: "/" });
  return res;
}

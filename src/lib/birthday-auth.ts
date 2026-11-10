import type { NextRequest } from "next/server";
import { IPTV_ADMIN_COOKIE, isValidAdminToken } from "@/lib/iptv-auth";

// The birthday calendar shares the site admin login (same password/cookie as IPTV admin).
export function isAdmin(req: NextRequest) {
  return isValidAdminToken(req.cookies.get(IPTV_ADMIN_COOKIE)?.value);
}

import crypto from "crypto";

export const IPTV_ADMIN_COOKIE = "iptv_admin_token";
const ADMIN_PASSWORD = process.env.IPTV_ADMIN_PASSWORD || "riaz1234";

function tokenFor(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex");
}

export function checkPassword(password: string): boolean {
  return password === ADMIN_PASSWORD;
}

export const IPTV_ADMIN_TOKEN = tokenFor(ADMIN_PASSWORD);

export function isValidAdminToken(token: string | undefined | null): boolean {
  if (!token) return false;
  const a = Buffer.from(token);
  const b = Buffer.from(IPTV_ADMIN_TOKEN);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

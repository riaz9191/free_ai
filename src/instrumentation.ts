export async function register() {
  // On Vercel, reminders run via Vercel Cron (vercel.json). When running the app
  // ourselves (npm run dev / npm start), check for tomorrow's birthdays every hour.
  if (process.env.NEXT_RUNTIME !== "nodejs" || process.env.VERCEL) return;
  const { sendDueReminders } = await import("./lib/birthday-store");
  const run = () =>
    sendDueReminders()
      .then((r) => r.sent.length && console.log(`[birthday] reminder sent for ${r.sent.join(", ")} → ${r.to}`))
      .catch((err) => console.error("[birthday] reminder failed:", err.message));
  setTimeout(run, 10_000);
  setInterval(run, 60 * 60 * 1000);
}

"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowLeft, CalendarDays, Info, MoonStar, PartyPopper } from "lucide-react";
import { NavBar } from "@/components/nav-bar";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

const HOLIDAYS = [
  { no: 1, date: "1-Jan-2026", day: "Thursday", days: 1, name: "UK Bank Holiday (New Year's Day)" },
  { no: 2, date: "4-Feb-2026", day: "Wednesday", days: 1, name: "Shab-e-Barat", moon: true },
  { no: 3, date: "21-Feb-2026", day: "Saturday", days: 1, name: "International Mother Language Day" },
  { no: 4, date: "17-Mar-2026", day: "Tuesday", days: 1, name: "Shab-e-Qadar", moon: true },
  { no: 5, date: "20-Mar-2026 to 23-Mar-2026", day: "Friday–Monday", days: 4, name: "Eid-Ul-Fitr", moon: true },
  { no: 6, date: "26-Mar-2026", day: "Thursday", days: 1, name: "Independence day" },
  { no: 7, date: "3-Apr-2026", day: "Friday", days: 1, name: "UK Bank Holiday (Good Friday)" },
  { no: 8, date: "6-Apr-2026", day: "Monday", days: 1, name: "UK Bank Holiday (Easter Monday)" },
  { no: 9, date: "14-Apr-2026", day: "Tuesday", days: 1, name: "Bengali New Year" },
  { no: 10, date: "1-May-2026", day: "Friday", days: 1, name: "May Day (Labor Day)" },
  { no: 11, date: "1-May-2026", day: "Friday", days: 1, name: "Buddha Purnima", moon: true },
  { no: 12, date: "4-May-2026", day: "Monday", days: 1, name: "UK Bank Holiday (Early May Bank Holiday)" },
  { no: 13, date: "25-May-2026", day: "Monday", days: 1, name: "UK Bank Holiday (Spring Bank Holiday)" },
  { no: 14, date: "27-May-2026 to 30-May-2026", day: "Wednesday–Saturday", days: 4, name: "Eid-Ul-Adha", moon: true },
  { no: 15, date: "5-Aug-2026", day: "Wednesday", days: 1, name: "July Mass Uprising Day" },
  { no: 16, date: "26-Aug-2026", day: "Wednesday", days: 1, name: "Eid-e-Miladunnabi", moon: true },
  { no: 17, date: "31-Aug-2026", day: "Monday", days: 1, name: "UK Bank Holiday (Summer Bank Holiday)" },
  { no: 18, date: "20-Oct-2026 to 21-Oct-2026", day: "Tuesday–Wednesday", days: 2, name: "Durga Puja" },
  { no: 19, date: "16-Dec-2026", day: "Wednesday", days: 1, name: "Victory Day" },
  { no: 20, date: "25-Dec-2026", day: "Friday", days: 1, name: "Christmas Day" },
  { no: 21, date: "28-Dec-2026", day: "Monday", days: 1, name: "UK Bank Holiday (Boxing Day)" },
  { no: 22, date: "29-Dec-2026 to 31-Dec-2026", day: "Tuesday–Thursday", days: 3, name: "Christmas Break" },
];

const NOTES = [
  "Subject to moon sighting/lunar calendar (Shab-e-Barat, Shab-e-Qadar, Eid-Ul-Fitr, Eid-Ul-Adha, Eid-e-Miladunnabi, Buddha Purnima).",
  "This Holiday Schedule is for the Calendar Year 2026. The Management of PEN Global Limited reserves the right to change this schedule if it is required as per the government announcement received further.",
  "All employees of PEN Global Limited will be entitled to 13 mandatory holidays as suggested by Bangladesh Labour Law and the rest of the holidays of this schedule will be adjusted with their Earned Leave (EL) and Casual Leave (CL) as applicable.",
  "The entitlement for Earned Leave, Casual Leave and Sick Leave will be 14, 10 and 14 respectively.\nEntitlement for Earned Leave will be effective after completing 01 year of service length at a stretch. If any other leave/holiday/weekends falls in between the duration of EL, that leave/holiday/weekends will be considered as EL. If any number of earned EL is not availed in a particular calendar year, the number of earned EL will be carried forward to the next year.\nEntitlement for Sick Leave (SL) and Casual Leave (CL) will be on a pro-rata basis effective from the Date of Joining (DOJ). Please note that SL & CL will not be carried forward to the following year. If any other leave/holiday/weekends falls in between the duration of SL, that leave/holiday/weekends will be considered as SL. If any other leave/holiday/weekends falls in between the duration of CL, that leave/holiday/weekends will be considered as CL.",
  "The leave applications should be approved by the Line Manager and be forwarded to HR and Country Manager - CTG Office for future reference.",
  "The Management of PEN Global Limited reserves the right to call and engage an employee to work on any holiday and allow equivalent compensatory leave as applicable.",
];

const TOTAL_DAYS = HOLIDAYS.reduce((sum, h) => sum + h.days, 0);
const MULTI_DAY = HOLIDAYS.filter((h) => h.days > 1).length;

const MONTHS: Record<string, number> = {
  Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
  Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
};

function parseHolidayDate(part: string): Date {
  const [day, mon, year] = part.trim().split("-");
  return new Date(Number(year), MONTHS[mon], Number(day));
}

function getEndDate(date: string): Date {
  const last = date.includes(" to ") ? date.split(" to ")[1] : date;
  return parseHolidayDate(last);
}

const TODAY = new Date();
TODAY.setHours(0, 0, 0, 0);

export default function PenHoliday2026Page() {
  return (
    <div className="relative flex min-h-screen flex-col bg-background text-foreground">
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 left-1/4 size-[36rem] rounded-full bg-violet-600/15 blur-[130px]" />
        <div className="absolute top-32 -right-32 size-[32rem] rounded-full bg-blue-600/10 blur-[130px]" />
      </div>

      <NavBar />

      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-16">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back home
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
          className="mt-8 flex flex-col gap-4"
        >
          <span className="flex w-fit items-center gap-2 rounded-full border border-border bg-muted/20 py-1 pr-3.5 pl-1.5 text-xs font-medium text-foreground/80">
            <span className="flex size-5 items-center justify-center rounded-full bg-gradient-to-r from-violet-500 to-blue-500">
              <CalendarDays className="size-3 text-white" />
            </span>
            PEN Global Limited
          </span>
          <h1 className="text-4xl leading-[1.08] font-extrabold tracking-tight sm:text-5xl">
            Holiday Schedule{" "}
            <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-blue-400 bg-clip-text text-transparent">
              2026
            </span>
          </h1>
          <p className="max-w-lg text-base text-muted-foreground">
            January&nbsp;1 to December&nbsp;31, 2026 — every holiday, bank
            holiday, and observance across the calendar year.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05, ease: EASE }}
          className="mt-8 grid grid-cols-3 divide-x divide-border rounded-2xl border border-border"
        >
          {[
            { value: String(HOLIDAYS.length), label: "Holidays listed" },
            { value: String(TOTAL_DAYS), label: "Total days off" },
            { value: String(MULTI_DAY), label: "Multi-day breaks" },
          ].map((s) => (
            <div key={s.label} className="flex flex-col gap-1 px-6 py-5">
              <div className="text-2xl font-bold tracking-tight tabular-nums">
                {s.value}
              </div>
              <div className="text-xs text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: EASE }}
          className="mt-8 overflow-hidden rounded-2xl border border-border"
        >
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse text-sm">
              <thead>
                <tr className="bg-gradient-to-r from-violet-600 to-blue-600 text-left text-white">
                  <th className="px-5 py-3.5 text-xs font-semibold tracking-wide uppercase">
                    #
                  </th>
                  <th className="px-5 py-3.5 text-xs font-semibold tracking-wide uppercase">
                    Date
                  </th>
                  <th className="px-5 py-3.5 text-xs font-semibold tracking-wide uppercase">
                    Day
                  </th>
                  <th className="px-5 py-3.5 text-xs font-semibold tracking-wide uppercase">
                    Duration
                  </th>
                  <th className="px-5 py-3.5 text-xs font-semibold tracking-wide uppercase">
                    Holiday
                  </th>
                </tr>
              </thead>
              <tbody>
                {HOLIDAYS.map((h, i) => {
                  const isDone = getEndDate(h.date) < TODAY;
                  return (
                    <tr
                      key={h.no}
                      className={cn(
                        "group transition-colors hover:bg-violet-500/[0.06]",
                        i % 2 === 0 ? "bg-background" : "bg-muted/[0.15]",
                        isDone && "opacity-45"
                      )}
                    >
                      <td className="border-t border-border px-5 py-3 font-mono text-xs text-muted-foreground/70 tabular-nums">
                        {String(h.no).padStart(2, "0")}
                      </td>
                      <td
                        className={cn(
                          "border-t border-border px-5 py-3 font-medium tabular-nums whitespace-nowrap",
                          isDone && "line-through decoration-muted-foreground/60"
                        )}
                      >
                        {h.date}
                      </td>
                      <td
                        className={cn(
                          "border-t border-border px-5 py-3 text-muted-foreground whitespace-nowrap",
                          isDone && "line-through decoration-muted-foreground/60"
                        )}
                      >
                        {h.day}
                      </td>
                      <td className="border-t border-border px-5 py-3">
                        <span
                          className={cn(
                            "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium tabular-nums whitespace-nowrap",
                            h.days > 1
                              ? "bg-gradient-to-r from-violet-500/15 to-blue-500/15 text-violet-300"
                              : "bg-muted/40 text-muted-foreground"
                          )}
                        >
                          {h.days} {h.days === 1 ? "day" : "days"}
                        </span>
                      </td>
                      <td
                        className={cn(
                          "border-t border-border px-5 py-3 font-medium",
                          isDone && "line-through decoration-muted-foreground/60"
                        )}
                      >
                        <span className="flex items-center gap-1.5">
                          {h.name}
                          {h.moon && (
                            <MoonStar
                              className="size-3.5 shrink-0 text-muted-foreground/60"
                              aria-label="Subject to moon sighting"
                            />
                          )}
                          {isDone && (
                            <span className="ml-1 rounded-full bg-muted/40 px-2 py-0.5 text-[10px] font-normal text-muted-foreground no-underline">
                              Done
                            </span>
                          )}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.16, ease: EASE }}
          className="mt-4 flex items-center gap-2 text-xs text-muted-foreground"
        >
          <MoonStar className="size-3.5 shrink-0" />
          Marked dates are subject to moon sighting / the lunar calendar and
          may shift.
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: EASE }}
          className="mt-10 rounded-2xl border border-border bg-muted/[0.07] p-6"
        >
          <div className="mb-4 flex items-center gap-2">
            <Info className="size-4 text-violet-400" />
            <h2 className="text-sm font-semibold tracking-tight">
              Policy notes
            </h2>
          </div>
          <ol className="flex flex-col gap-3 text-sm leading-relaxed text-muted-foreground">
            {NOTES.map((note, i) => (
              <li key={i} className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-mono text-xs text-muted-foreground/50 tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="whitespace-pre-line">{note}</span>
              </li>
            ))}
          </ol>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5, delay: 0.05, ease: EASE }}
          className="mt-8 flex items-center gap-3 rounded-2xl border border-border bg-gradient-to-br from-violet-600/10 via-transparent to-blue-600/10 px-6 py-5"
        >
          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-blue-500">
            <PartyPopper className="size-4 text-white" />
          </span>
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">30 days off</span>{" "}
            across the year, plus your Earned, Casual, and Sick Leave — as
            outlined in the policy notes above.
          </p>
        </motion.div>
      </main>

      <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground">
        © 2026 PEN Global Limited.
      </footer>
    </div>
  );
}

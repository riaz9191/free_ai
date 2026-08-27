"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowLeft, CalendarDays } from "lucide-react";
import { NavBar } from "@/components/nav-bar";

const EASE = [0.16, 1, 0.3, 1] as const;

const HOLIDAYS = [
  { no: 1, date: "1-Jan-2026", day: "Thursday", days: "01 Day", name: "UK Bank Holiday (New Year's Day)" },
  { no: 2, date: "4-Feb-2026", day: "Wednesday", days: "01 Day", name: "*Shab-e-Barat" },
  { no: 3, date: "21-Feb-2026", day: "Saturday", days: "01 Day", name: "International Mother Language Day" },
  { no: 4, date: "17-Mar-2026", day: "Tuesday", days: "01 Day", name: "*Shab-e-Qadar" },
  { no: 5, date: "20-Mar-2026 to 23-Mar-2026", day: "Friday-Monday", days: "04 Days", name: "*Eid-Ul-Fitr" },
  { no: 6, date: "26-Mar-2026", day: "Thursday", days: "01 Day", name: "Independence day" },
  { no: 7, date: "3-Apr-2026", day: "Friday", days: "01 Day", name: "UK Bank Holiday (Good Friday)" },
  { no: 8, date: "6-Apr-2026", day: "Monday", days: "01 Day", name: "UK Bank Holiday (Easter Monday)" },
  { no: 9, date: "14-Apr-2026", day: "Tuesday", days: "01 Day", name: "Bengali New Year" },
  { no: 10, date: "1-May-2026", day: "Friday", days: "01 Day", name: "May Day (Labor Day)" },
  { no: 11, date: "1-May-2026", day: "Friday", days: "01 Day", name: "*Buddha Purnima" },
  { no: 12, date: "4-May-2026", day: "Monday", days: "01 Day", name: "UK Bank Holiday (Early May Bank Holiday)" },
  { no: 13, date: "25-May-2026", day: "Monday", days: "01 Day", name: "UK Bank Holiday (Spring Bank Holiday)" },
  { no: 14, date: "27-May-2026 to 30-May-2026", day: "Wednesday-Saturday", days: "04 Days", name: "*Eid-Ul-Adha" },
  { no: 15, date: "5-Aug-2026", day: "Wednesday", days: "01 Day", name: "July Mass Uprising Day" },
  { no: 16, date: "26-Aug-2026", day: "Wednesday", days: "01 Day", name: "*Eid-e-Miladunnabi" },
  { no: 17, date: "31-Aug-2026", day: "Monday", days: "01 Day", name: "UK Bank Holiday (Summer Bank Holiday)" },
  { no: 18, date: "20-Oct-2026 to 21-Oct-2026", day: "Tuesday-Wednesday", days: "02 Days", name: "Durga Puja" },
  { no: 19, date: "16-Dec-2026", day: "Wednesday", days: "01 Day", name: "Victory Day" },
  { no: 20, date: "25-Dec-2026", day: "Friday", days: "01 Day", name: "Christmas Day" },
  { no: 21, date: "28-Dec-2026", day: "Monday", days: "01 Day", name: "UK Bank Holiday (Boxing Day)" },
  { no: 22, date: "29-Dec-2026 to 31-Dec-2026", day: "Tuesday-Thursday", days: "03 Days", name: "Christmas Break" },
];

const NOTES = [
  "*Subject to moon sighting/lunar calendar (Shab-e-Barat, Shab-e-Qadar, Eid-Ul-Fitr, Eid-Ul-Adha, Eid-e-Miladunnabi, Buddha Purnima).",
  "**This Holiday Schedule is for the Calendar Year 2026. The Management of PEN Global Limited reserves the right to change this schedule if it is required as per the government announcement received further.",
  "***All employees of PEN Global Limited will be entitled to 13 mandatory holidays as suggested by Bangladesh Labour Law and the rest of the holidays of this schedule will be adjusted with their Earned Leave (EL) and Casual Leave (CL) as applicable.",
  "**** The entitlement for Earned Leave, Casual Leave and Sick Leave will be 14, 10 and 14 respectively.\nEntitlement for Earned Leave will be effective after completing 01 year of service length at a stretch. If any other leave/holiday/weekends falls in between the duration of EL, that leave/holiday/weekends will be considered as EL. If any number of earned EL is not availed in a particular calendar year, the number of earned EL will be carried forward to the next year.\nEntitlement for Sick Leave (SL) and Casual Leave (CL) will be on a pro-rata basis effective from the Date of Joining (DOJ). Please note that SL & CL will not be carried forward to the following year. If any other leave/holiday/weekends falls in between the duration of SL, that leave/holiday/weekends will be considered as SL. If any other leave/holiday/weekends falls in between the duration of CL, that leave/holiday/weekends will be considered as CL.",
  "The leave applications should be approved by the Line Manager and be forwarded to HR and Country Manager - CTG Office for future reference.",
  "*****The Management of PEN Global Limited reserves the right to call and engage an employee to work on any holiday and allow equivalent compensatory leave as applicable.",
];

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
          className="mt-6 flex flex-col gap-3"
        >
          <span className="flex w-fit items-center gap-2 rounded-full border border-border bg-muted/20 py-1 pr-3 pl-1 text-xs text-foreground/80">
            <span className="flex size-5 items-center justify-center rounded-full bg-gradient-to-r from-violet-500 to-blue-500">
              <CalendarDays className="size-3 text-white" />
            </span>
            PEN Global Limited
          </span>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Holiday Schedule — January 2026 to December 2026
          </h1>
          <p className="text-sm text-muted-foreground">30 Days total</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.08, ease: EASE }}
          className="mt-8 overflow-x-auto rounded-2xl border border-border"
        >
          <table className="w-full min-w-[720px] border-collapse text-sm">
            <thead>
              <tr className="bg-gradient-to-r from-violet-600 to-blue-600 text-left text-white">
                <th className="px-4 py-3 font-semibold">Sl. No.</th>
                <th className="px-4 py-3 font-semibold">Date of Holiday</th>
                <th className="px-4 py-3 font-semibold">Day</th>
                <th className="px-4 py-3 font-semibold">Number of Days</th>
                <th className="px-4 py-3 font-semibold">Name of Holiday</th>
              </tr>
            </thead>
            <tbody>
              {HOLIDAYS.map((h, i) => (
                <tr
                  key={h.no}
                  className={i % 2 === 0 ? "bg-background" : "bg-muted/20"}
                >
                  <td className="border-t border-border px-4 py-2.5 text-muted-foreground">{h.no}</td>
                  <td className="border-t border-border px-4 py-2.5">{h.date}</td>
                  <td className="border-t border-border px-4 py-2.5">{h.day}</td>
                  <td className="border-t border-border px-4 py-2.5">{h.days}</td>
                  <td className="border-t border-border px-4 py-2.5 font-medium">{h.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.14, ease: EASE }}
          className="mt-8 flex flex-col gap-2 rounded-2xl border border-border bg-muted/[0.07] p-5 text-xs leading-relaxed text-muted-foreground"
        >
          {NOTES.map((note, i) => (
            <p key={i} className="whitespace-pre-line">
              {note}
            </p>
          ))}
        </motion.div>
      </main>

      <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground">
        © 2026 PEN Global Limited.
      </footer>
    </div>
  );
}

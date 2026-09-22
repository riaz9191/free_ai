import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { NavBar } from "@/components/nav-bar";
import { LessonSidebar } from "@/components/lesson-sidebar";

export default function LessonsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <NavBar />

      <div className="mx-auto flex max-w-6xl gap-8 px-6 py-10">
        <aside className="hidden w-56 shrink-0 lg:block">
          <div className="sticky top-20">
            <Link
              href="/ai/ml"
              className="mb-4 flex items-center gap-1.5 px-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="size-3.5" />
              Routine-এ ফিরে যাও
            </Link>
            <LessonSidebar />
          </div>
        </aside>

        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}

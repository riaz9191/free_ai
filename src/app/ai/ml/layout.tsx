import { Hind_Siliguri } from "next/font/google";

// Geist has no Bengali glyphs; listing Hind Siliguri after it lets the Bangla
// text in notes and the routine fall through to a face designed for it.
const bangla = Hind_Siliguri({
  variable: "--font-bangla",
  subsets: ["bengali"],
  weight: ["400", "500", "600", "700"],
});

export default function MlLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={bangla.variable}
      style={{ fontFamily: "var(--font-sans), var(--font-bangla), sans-serif" }}
    >
      {children}
    </div>
  );
}

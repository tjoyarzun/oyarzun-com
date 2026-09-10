import { colophon, issue } from "@/lib/copy";
import { fill, lines } from "@/lib/thrasher/fill";

/**
 * The colophon. A magazine states how it was made; so does this.
 *
 * The text lives in `colophon` in lib/copy.ts.
 *
 * NOTE — it claims no analytics. That is only true while @vercel/analytics
 * stays out of app/layout.tsx. The claim and the dependency have to move
 * together, which is why the copy file says so next to the sentence.
 */
export default function Colophon() {
  return (
    <footer className="colo">
      <div className="lg">Oyarzun</div>
      <p>{fill(colophon)}</p>
      <div className="mono" style={{ textAlign: "right" }}>
        {lines([
          `Issue ${issue.number} · ${issue.dateline}`,
          issue.place,
          issue.domain,
        ])}
      </div>
    </footer>
  );
}

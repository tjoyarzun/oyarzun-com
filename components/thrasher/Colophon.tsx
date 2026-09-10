import { colophon, issue } from "@/lib/copy";
import { fill, lines } from "@/lib/thrasher/fill";

/**
 * The colophon. A magazine states how it was made; so does this.
 *
 * The text lives in `colophon` in lib/copy.ts. It describes the printing and
 * makes no claim about the reader, so nothing here has to be kept in step
 * with what app/layout.tsx mounts.
 */
export default function Colophon() {
  return (
    <footer className="colo">
      <div className="lg">Oyarzun</div>
      <p>{fill(colophon)}</p>
      <div className="mono" style={{ textAlign: "right" }}>
        {lines([
          `Issue ${issue.number} · ${issue.dateline}`,
          `Sandy, Utah · ${issue.elevation}`,
          issue.domain,
        ])}
      </div>
    </footer>
  );
}

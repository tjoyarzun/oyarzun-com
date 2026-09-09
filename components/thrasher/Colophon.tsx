/**
 * The colophon. A magazine states how it was made; so does this.
 *
 * NOTE — the last sentence claims no analytics. That is currently false:
 * app/layout.tsx has historically mounted @vercel/analytics. Either the
 * package comes out or this sentence changes, and it is a decision rather
 * than a bug, so it is flagged here rather than quietly edited.
 */
export default function Colophon() {
  return (
    <footer className="colo">
      <div className="lg">Oyarzun</div>
      <p>
        Oyarzun.com, Issue 04. Set in Big Shoulders Display, Archivo Narrow and
        Anonymous Pro. Every photograph on this site is screened by hand — dot
        radius computed from the luminance of the pixel underneath it, black
        plate at forty-five degrees, screen ruling keyed to reproduction size.
        The site is printed in one ink; the photographs are not, and clicking
        any of them shows you the difference. Negative in the top bar runs the
        whole issue as a photocopier would, and it remembers. No analytics, no
        newsletter, nothing here is measuring you.
      </p>
      <div className="mono" style={{ textAlign: "right" }}>
        Issue 04 · Sep 2026
        <br />
        Sandy, Utah · 4,505 ft
        <br />
        oyarzun.com
      </div>
    </footer>
  );
}

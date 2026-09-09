/**
 * The site is printed in one ink. The photographs are not.
 *
 * Markup only — the open/close/preload behaviour is wired by
 * lib/thrasher/behaviours.ts, which also re-wires every new .plate after a
 * client navigation. Rendering this once in the root layout means the overlay
 * survives navigation and there is only ever one of it in the document.
 */
export default function Lightbox() {
  return (
    <div id="lb" hidden>
      <button type="button">Close</button>
      <div className="stage">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img alt="" />
        <div className="meta">
          <span>
            <b className="t" />
          </span>
          <span>
            <span className="sw">Actual colour</span> · <span className="d" />
          </span>
        </div>
      </div>
    </div>
  );
}

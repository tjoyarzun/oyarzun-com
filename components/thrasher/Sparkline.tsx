/**
 * A sparkline, drawn server-side.
 *
 * Deliberately not in lib/thrasher/behaviours.ts with the other drawings:
 * these have no interaction and no theme-dependent colour beyond `currentColor`,
 * so they can be plain SVG in the markup. That means they are in the HTML on
 * first paint rather than appearing after hydration — which matters on a panel
 * whose whole job is to be readable at a glance.
 *
 * `currentColor` is why they need no repaint under Negative: the stroke
 * inherits from whatever cell the sparkline sits in, including the reversed-out
 * vermilion one.
 */
export interface SparklineProps {
  values: number[];
  /** Draw the area under the line as well as the line. */
  fill?: boolean;
  /** Mark the last point. Use when the series' end is the headline figure. */
  endpoint?: boolean;
  /** Bars instead of a line — right for counts, wrong for a rate. */
  bars?: boolean;
  label?: string;
}

export default function Sparkline({
  values,
  fill = false,
  endpoint = true,
  bars = false,
  label,
}: SparklineProps) {
  if (!values.length) return null;
  const W = 200;
  const H = 26;
  /* Scale from zero, always. A sparkline scaled to its own min exaggerates
     small variation into drama — the classic way a chart lies by accident. */
  const max = Math.max(...values, 1);
  const x = (i: number) =>
    values.length === 1 ? W / 2 : (i / (values.length - 1)) * W;
  const y = (v: number) => H - (v / max) * (H - 2) - 1;

  const pts = values.map((v, i) => `${x(i).toFixed(1)},${y(v).toFixed(1)}`);
  const last = values[values.length - 1];

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      role="img"
      aria-label={label ?? `Sparkline, ${values.length} points, latest ${last}`}
    >
      {bars ? (
        values.map((v, i) => {
          const bw = W / values.length;
          const bh = (v / max) * (H - 2);
          return (
            <rect
              key={i}
              x={(i * bw + bw * 0.16).toFixed(1)}
              y={(H - bh - 1).toFixed(1)}
              width={(bw * 0.68).toFixed(1)}
              height={Math.max(0.8, bh).toFixed(1)}
              fill="currentColor"
              opacity={v ? 0.85 : 0.18}
            />
          );
        })
      ) : (
        <>
          {fill ? (
            <polygon
              points={`0,${H} ${pts.join(" ")} ${W},${H}`}
              fill="currentColor"
              opacity="0.13"
            />
          ) : null}
          <polyline
            points={pts.join(" ")}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            vectorEffect="non-scaling-stroke"
          />
          {endpoint ? (
            <circle
              cx={x(values.length - 1).toFixed(1)}
              cy={y(last).toFixed(1)}
              r="2.4"
              fill="currentColor"
            />
          ) : null}
        </>
      )}
    </svg>
  );
}

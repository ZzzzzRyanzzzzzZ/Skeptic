export function wilson(successes: number, total: number, z = 1.96) {
  if (total === 0) return { low: 0, high: 1, point: 0 };
  const p = successes / total;
  const z2 = z * z;
  const denom = 1 + z2 / total;
  const centre = (p + z2 / (2 * total)) / denom;
  const spread =
    (z * Math.sqrt((p * (1 - p)) / total + z2 / (4 * total * total))) / denom;
  return {
    point: p,
    low: Math.max(0, centre - spread),
    high: Math.min(1, centre + spread),
  };
}

export function formatRate(successes: number, total: number): string {
  const { point, low, high } = wilson(successes, total);
  const pct = (v: number) => (v * 100).toFixed(1);
  return `${pct(point)}% (${pct(low)}–${pct(high)})`;
}

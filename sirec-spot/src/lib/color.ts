const parse = (h: string) => {
  const hex = h.length === 4 ? "#" + h[1] + h[1] + h[2] + h[2] + h[3] + h[3] : h;
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};
export const mix = (a: string, b: string, t: number) => {
  const A = parse(a), B = parse(b);
  const k = Math.min(1, Math.max(0, t));
  return `rgb(${Math.round(A[0] + (B[0] - A[0]) * k)},${Math.round(A[1] + (B[1] - A[1]) * k)},${Math.round(A[2] + (B[2] - A[2]) * k)})`;
};
export const alpha = (h: string, a: number) => {
  const [r, g, b] = parse(h);
  return `rgba(${r},${g},${b},${a})`;
};

import { Vec3 } from "../engine/math";

/** World x-origin of every installation along the travelling axis. */
export const X = {
  base: 0,
  A: 1250, B: 1850, C: 2450, // comparan · cotizan · contratan
  ghost: 3100,
  q1: 3800, q2: 4500, q3: 5200, // the three open questions
  gate: 6500, // el precio
  crit: 7800, // el criterio
  data: 8800, // el dato
  trust: 9800, // la confianza · primer paso · clímax (same place: the line of four becomes the field)
};

/** Actor positions relative to a system origin. */
export const REL = {
  client: [-440, 0, -40] as Vec3,
  mediator: [20, 0, 170] as Vec3,
  insurer: [500, 0, -20] as Vec3,
  agent: [40, 450, 190] as Vec3,
};
export const HEIGHT = { client: 78, mediator: 140, insurer: 100 };

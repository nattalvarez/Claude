import { Ripple } from "./world/Floor";

/** Moments where the floor itself reacts (the space answers the story). */
export const RIPPLES: Ripple[] = [
  { x: -300, z: 40, f0: 124, speed: 7.5, width: 190, amp: 18, life: 120, pink: 0.6 },
  // el primer paso: the first slab moves and the floor answers
  { x: 9800 + 210, z: -120, f0: 1668, speed: 9, width: 210, amp: 16, life: 110, pink: 0.6 },
];

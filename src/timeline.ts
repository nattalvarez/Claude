import { SCENE_BEATS, TRANSITION_FRAMES } from "./styles/theme";

export type TimelineItem = {
  id: string;
  from: number;
  duration: number; // padded — includes the outgoing wipe's extra tail
  nominalDuration: number; // authored storyboard length, for content pacing
  hasIncoming: boolean;
  hasOutgoing: boolean;
};

/** Lays out the seven scenes as overlapping Sequences so every cut is a
 * masked wipe instead of a hard edit, while the total composition length
 * still lands on the exact storyboard second-marks. See design notes: each
 * non-final scene's duration is padded by TRANSITION_FRAMES at the tail;
 * the overlap subtracted from the running cursor exactly cancels the pad,
 * so `from[i]` always equals the nominal (un-padded) cumulative sum. */
export function buildTimeline(): { items: TimelineItem[]; totalDuration: number } {
  const items: TimelineItem[] = [];
  let cursor = 0;
  for (let i = 0; i < SCENE_BEATS.length; i++) {
    const beat = SCENE_BEATS[i];
    const hasIncoming = i > 0;
    const hasOutgoing = i < SCENE_BEATS.length - 1;
    const duration = beat.duration + (hasOutgoing ? TRANSITION_FRAMES : 0);
    const from = cursor;
    items.push({ id: beat.id, from, duration, nominalDuration: beat.duration, hasIncoming, hasOutgoing });
    cursor = from + duration - (hasOutgoing ? TRANSITION_FRAMES : 0);
  }
  const last = items[items.length - 1];
  return { items, totalDuration: last.from + last.duration };
}

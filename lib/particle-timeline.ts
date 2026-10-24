export const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));

export function normalizeMorphEnd(value: number) {
  return Number.isFinite(value) ? clamp(value, 0.01) : 0.6;
}

export interface ShapeTimeline {
  position: number;
  from: number;
  to: number;
  morph: number;
  firstMorph: number;
}

/** Each appended shape adds one range; the original chaos/wave range stays intact. */
export function getShapeTimeline(progress: number, shapeCount: number, morphEnd: number): ShapeTimeline {
  const position = clamp(progress) * (shapeCount - 1);
  const from = Math.min(shapeCount - 2, Math.floor(position));
  const end = normalizeMorphEnd(morphEnd);
  return {
    position,
    from,
    to: from + 1,
    morph: clamp((position - from) / end),
    firstMorph: clamp(position / end),
  };
}

/** An optional About panel holds the starfield for one range before the original shape sequence. */
export function getStoryTimelines(progress: number, shapeCount: number, morphEnd: number, hasIntro: boolean) {
  const section = getShapeTimeline(progress, shapeCount + Number(hasIntro), morphEnd);
  const shape = hasIntro
    ? getShapeTimeline(clamp((section.position - 1) / (shapeCount - 1)), shapeCount, morphEnd)
    : section;
  return { section, shape };
}

export function getPanelOpacity(index: number, timeline: ShapeTimeline, morphEnd: number, reduced: boolean, panelCount = Infinity) {
  const { position } = timeline;
  const end = normalizeMorphEnd(morphEnd);
  // Share each transition between adjacent panels so the story never turns blank.
  const transition = (local: number) => reduced
    ? Number(local >= end * 0.5)
    : clamp((local - end * 0.12) / (end * 0.76));
  const enter = index === 0 ? 1 : transition(position - (index - 1));
  // Hold the final panel while the sticky story leaves the viewport.
  const exit = index === panelCount - 1 ? 1 : 1 - transition(position - index);
  return enter * exit;
}

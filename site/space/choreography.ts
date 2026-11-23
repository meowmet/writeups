// One clock drives camera, cable geometry, facial cues, and the transport bar.
export const duration = 18
export const snap = 9.15
export const cues = [
  [0, 'sleeping', 'Quiet orbit'],
  [1.5, 'waking', 'First light'],
  [3.5, 'curious', 'Something glowing'],
  [5.5, 'nibbling', 'A little nibble'],
  [7.05, 'listening', 'All quiet?'],
  [7.7, 'biting', 'One more bite'],
  [snap, 'startled', 'Contact lost'],
  [10.1, 'drifting', 'Adrift'],
  [13, 'looking-back', 'Far from Earth'],
  [15.6, 'reward', 'Signal received'],
  [duration, 'idle', 'Free orbit'],
] as const

export type Phase = (typeof cues)[number][1]
export function cueAt(t: number) {
  for (let i = cues.length - 1; i >= 0; i--) if (t >= cues[i][0]) return cues[i]
  return cues[0]
}
export const clamp = (n: number, min = 0, max = 1) => Math.min(max, Math.max(min, n))
export function ease(t: number, start: number, end: number) {
  const p = clamp((t - start) / (end - start))
  return p * p * (3 - 2 * p)
}
export function pulse(t: number, start: number, end: number) {
  return Math.sin(Math.PI * clamp((t - start) / (end - start)))
}
export function recoil(seconds: number, rate: number) {
  return seconds > 0 ? Math.sin(seconds * rate) * Math.exp(-seconds * 2.5) : 0
}
export function poseAt(t: number, idle: number, portrait: boolean) {
  const travel = ease(t, snap + 0.16, 16.8)
  const release = recoil(t - snap, 8)
  const buoyancy = Math.sin(idle * 0.59) * 2 + Math.sin(idle * 0.29) * 1.6
  const startScale = portrait ? 0.78 : 0.6
  return {
    x: 389 + (portrait ? 27 : 53) * travel + 3 * release + buoyancy,
    y: 226 - 9 * startScale + (portrait ? 82 : 88) * travel - 7 * release + Math.sin(idle * 0.45) * 3.8,
    angle: -15 * travel + 7 * release + Math.sin(idle * 0.32) * 3.3,
    scale: startScale + travel * (portrait ? 0.66 : 0.65),
  }
}

// Contact and idle behaviours temporarily take precedence over the cinematic pose.
// Each weight is continuous so that an ear, paw or jaw can settle between states.
export function characterAt(
  t: number,
  idle: number,
  lastTouch: number,
  yarnStart: number,
  pet: number,
  waving: boolean,
  reduced: boolean,
) {
  const phase = cueAt(t)[1]
  const shocked = pulse(t, snap, snap + 1.05)
  const nibble = pulse(t, 5.5, 7.05) * 0.65 + pulse(t, 7.7, snap) * 1.1
  const chew = nibble * (0.5 + 0.5 * Math.sin(t * 19))
  const sleep = t >= duration ? ease(idle - lastTouch, 52, 59) : 0
  const yarnAge = t + idle - yarnStart
  const reach = pulse(yarnAge, 0, 2.3)
  const fishAge = (idle + 11) % 38
  const fish = reduced || t < duration || sleep > 0.2 ? 0 : pulse(fishAge, 17, 24)
  const petting = Math.sin(Math.PI * clamp(pet / 1.7))
  let state: Phase | 'waving' | 'petted' | 'sleepy' | 'playful' = phase
  if (fish + reach > 0.3) state = 'playful'
  if (sleep > 0.8) state = 'sleepy'
  if (pet > 0) state = 'petted'
  if (waving) state = 'waving'
  return { state, shocked, nibble, chew, sleep, yarnAge, reach, fishAge, fish, petting }
}

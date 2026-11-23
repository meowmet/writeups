import { base } from '../model'
import { characterAt, clamp, cueAt, duration, ease, poseAt, pulse, recoil, snap } from './choreography'

export function launch(root: HTMLElement) {
  const get = <T extends Element = HTMLElement>(selector: string) => root.querySelector<T>(selector)!
  const svg = get<SVGSVGElement>('#universe')
  const bits = new Map(Array.from(svg.querySelectorAll<SVGElement>('[id]'), (el) => [el.id, el]))
  const node = (id: string) => bits.get(id)!
  const attr = (id: string, key: string, value: string | number) => node(id).setAttribute(key, String(value))
  const turn = (id: string, angle: number, x: number, y: number) =>
    attr(id, 'transform', `rotate(${angle} ${x} ${y})`)
  const move = (id: string, x: number, y: number) => attr(id, 'transform', `translate(${x} ${y})`)
  const opacity = (id: string, n: number) => attr(id, 'opacity', clamp(n).toFixed(3))
  const pupils = svg.querySelectorAll('.pupil')
  const fibers = svg.querySelectorAll('.fiber-pulse')
  const sparks = Array.from(node('sparks').children)
  const fishStars = Array.from(node('fish').querySelectorAll('circle'))
  const farStars = get('#far-stars'),
    nearStars = get('#near-stars')
  const suit = node('traveler'),
    junction = node('junction'),
    rig = node('rig')
  const petControl = get<HTMLButtonElement>('#pet-cat'),
    radioControl = get<HTMLButtonElement>('#call-radio')
  const caption = get<HTMLOutputElement>('#comms')
  const toast = get('#achievement'),
    status = get('#story-status')
  const phaseLabel = get('#phase'),
    timecode = get('#timecode'),
    bar = get('#playhead')
  const skip = get<HTMLButtonElement>('#skip-film'),
    replay = get<HTMLButtonElement>('#replay'),
    rest = get<HTMLButtonElement>('#rest')
  const deck = get('#flight-deck')
  let earthTaps = 0
  const motion = matchMedia('(prefers-reduced-motion: reduce)')
  const narrow = matchMedia('(max-width: 42rem)')
  const controller = new AbortController()
  const { signal } = controller
  let t = motion.matches ? duration : 0,
    idle = 0,
    previous = 0,
    frame = 0
  let paused = false,
    visible = true,
    away = false,
    awardGiven = false,
    lastCue = ''
  let pet = 0,
    petCount = 0,
    contactX = 0,
    contactY = 0,
    lastTouch = 0
  let gazeX = 0,
    gazeY = 0,
    eyeX = 0,
    eyeY = 0,
    departing = false
  let toastTimer = 0,
    fadeTimer = 0,
    messageTimer = 0
  let feedback = '',
    radioTimer = 0,
    returnTimer = 0,
    petTimer = 0,
    yarnStart = -10,
    lastSecond = -1
  const reactions = ['Prrrr…', 'Meow?', 'I didn’t break anything.', '…probably.', 'More pets, please.']

  function say(message: string, ms = 3000) {
    clearTimeout(messageTimer)
    caption.textContent = message
    caption.hidden = false
    messageTimer = window.setTimeout(() => {
      caption.hidden = true
    }, ms)
  }
  function unlock() {
    if (awardGiven) return
    awardGiven = true
    toast.hidden = false
    toast.dataset.show = 'true'
    status.textContent = 'Achievement Unlocked! You found the cat, but not the page.'
    toastTimer = window.setTimeout(() => {
      toast.dataset.show = 'false'
      fadeTimer = window.setTimeout(
        () => {
          toast.hidden = true
        },
        motion.matches ? 0 : 400,
      )
    }, 5400)
  }
  function controls() {
    skip.hidden = t >= duration
    petControl.hidden = radioControl.hidden = t < duration
    rest.hidden = motion.matches
    rest.setAttribute('aria-label', paused ? 'Resume animation' : 'Pause animation')
    rest.children[0].toggleAttribute('hidden', paused)
    rest.children[1].toggleAttribute('hidden', !paused)
  }
  function render() {
    const reduced = motion.matches
    const [, phase, label] = cueAt(t)
    const clock = reduced ? 0 : t + idle
    const calm = t >= duration && !reduced ? idle : 0
    const close = ease(t, 2.2, 6.5),
      release = Math.max(0, t - snap),
      drift = ease(t, snap, 15.8)
    const { state, shocked, nibble, chew, sleep, yarnAge, reach, fishAge, fish, petting } = characterAt(
      t,
      idle,
      lastTouch,
      yarnStart,
      pet,
      departing,
      reduced,
    )
    if (root.dataset.story !== state) root.dataset.story = state
    const idleNod = Math.sin(calm * 0.43)
    const rigZoom = 0.95 + 0.095 * close - 0.11 * drift
    const sway = reduced ? 0 : Math.sin(clock * 0.51) * 0.7
    attr(
      'rig',
      'transform',
      `translate(${380 + sway} ${230 + sway * 0.4}) scale(${rigZoom}) rotate(${sway * 0.35}) translate(-380 -230)`,
    )
    opacity('rig', 0.15 + 0.85 * ease(t, 0.35, 2.9))
    opacity('digit-a', 0.3 + 0.7 * ease(t, 1.25, 2.2))
    opacity('digit-o', 0.3 + 0.7 * ease(t, 1.75, 2.7))
    opacity('right-frame', (0.32 + 0.68 * ease(t, 2.2, 3.25)) * (1 - 0.19 * chew))
    const sunrise = ease(t, 0, 1.5)
    opacity('earth', 0.2 + 0.8 * sunrise)
    opacity('ship', 0.18 + 0.82 * sunrise)
    farStars.setAttribute('opacity', String(0.4 + 0.6 * sunrise))
    nearStars.setAttribute('opacity', String(0.16 + 0.84 * sunrise))
    const earthScale = 1.05 - 0.43 * ease(t, 10.2, 17)
    attr('earth', 'transform', `translate(${-12 * drift} ${12 * drift}) scale(${earthScale})`)
    turn('continents', -7 + Math.sin(clock * 0.055) * 7, 0, 0)
    attr(
      'ship',
      'transform',
      `translate(${22 * drift + 3 * Math.sin(clock * 0.3)} ${-17 * drift}) scale(${0.95 - 0.41 * drift})`,
    )
    attr('ship-lamp', 'fill', t > 7.7 && t < 9.8 ? '#ffac75' : '#eac495')
    move('stones', -8 * drift + Math.sin(clock * 0.23) * 2, 3 * drift)
    farStars.setAttribute('transform', `translate(${drift * 2} ${-1.5 * drift})`)
    nearStars.setAttribute('transform', `translate(${drift * 10 + 3 * Math.sin(clock * 0.15)} ${-5 * drift})`)
    for (const fiber of fibers) fiber.setAttribute('stroke-dashoffset', String(-clock * 38))

    if (release > 0.7 && rig.lastElementChild !== suit) rig.append(suit)
    else if (release <= 0.7 && suit.nextElementSibling !== junction) rig.insertBefore(suit, junction)
    const portDistance = narrow.matches ? 43.7 : 33.6
    // The branch endpoints start at the same tooth. Each retracts through its own seal.
    const pull = ease(t, snap, snap + 0.84)
    const spring = recoil(release, 12)
    const shake = Math.sin(t * 31) * nibble
    const tipL = { x: 389 - 40 * pull - 9 * spring, y: 226 - 14 * pull + 8 * spring + shake }
    const tipR = { x: 389 + 60 * pull + 11 * spring, y: 226 + 12 * pull - 7 * spring + shake }
    const bend = Math.sin(clock * 0.65) * drift
    attr(
      'lead-l',
      'd',
      `M430 245C430 ${280 + 4 * bend} ${344 - 6 * pull} ${279 + spring * 5} ${344 - 3 * pull} 244Q${344 - 6 * pull} ${226 - 12 * pull} ${389 - portDistance - 9 * pull} ${226 - 7 * pull}Q${370 - 21 * pull} ${226 + shake * 2 + spring * 4} ${tipL.x} ${tipL.y}`,
    )
    attr(
      'lead-r',
      'd',
      `M${tipR.x} ${tipR.y}Q${406 + 48 * pull} ${226 + 3 * shake + 4 * spring} ${389 + portDistance + 34 * pull} ${226 + 4 * bend}C${451 + 6 * pull} ${222 - 6 * pull} 472 261 500 261`,
    )
    attr('ends-l', 'transform', `translate(${tipL.x} ${tipL.y}) rotate(${-15 * pull + spring * 16})`)
    attr('ends-r', 'transform', `translate(${tipR.x} ${tipR.y}) scale(-1 1)`)
    attr('tooth', 'transform', `translate(389 ${225.4 + chew * 0.65}) scale(${narrow.matches ? 0.78 : 0.6})`)
    opacity('tooth', (1 - pull) * ease(t, 2.5, 4.4))
    opacity('thought', pulse(t, 4, 5.6) * 0.94)
    const fray = 0.22 * ease(t, 8.25, snap) + 0.78 * pull
    opacity('ends-l', fray)
    opacity('ends-r', fray)
    const separate = ease(t, snap, 15.2)
    const lf = `translate(${-35 * separate - 4 * spring} ${4 * separate + bend}) rotate(${-4.2 * separate - 0.6 * spring} 275 239)`
    const rf = `translate(${52 * separate + 6 * spring} ${-12 * separate - bend}) rotate(${6 * separate + spring} 571 230) rotate(${shake * 0.6} 389 226)`
    attr('left-frame', 'transform', lf)
    attr('left-lead', 'transform', lf)
    attr('right-frame', 'transform', rf)
    attr('right-lead', 'transform', rf)
    const sparkTime = t >= snap ? release : t - 6.65
    opacity('sparks', pulse(sparkTime, 0, 0.78) * 0.9)
    if (sparkTime >= 0 && sparkTime < 0.8)
      sparks.forEach((el, i) => {
        const angle = i * 2.4,
          reach = (6 + i * 2.2) * sparkTime * 1.9
        el.setAttribute(
          'transform',
          `translate(${389 + Math.cos(angle) * reach} ${226 + Math.sin(angle) * reach}) rotate(${i * 29})`,
        )
      })

    const cat = poseAt(t, calm, narrow.matches)
    const stretch = pulse(calm % 31, 26, 28) * 0.035 - sleep * 0.045
    attr(
      'traveler',
      'transform',
      `translate(${cat.x + contactX * petting * 0.04} ${cat.y}) rotate(${cat.angle + sleep * 8}) scale(${cat.scale * (1 - stretch)} ${cat.scale * (1 + stretch)})`,
    )
    const eyeOpen = 0.09 + 0.91 * ease(t, 2.4, 4.2)
    const blinkCycle = (clock + 0.55 * Math.sin(clock * 0.37)) % 4.65
    const blink = pulse(blinkCycle, 4.29, 4.57)
    const glance = pulse(t, 3.8, 5.8) * 2 - pulse(t, 12.8, 15.5) * 2.3
    eyeX += (gazeX - eyeX) * 0.18
    eyeY += (gazeY - eyeY) * 0.18
    for (const pupil of pupils)
      pupil.setAttribute(
        'transform',
        `translate(${clamp(eyeX + glance + fish * 2 - reach * 2, -3, 3)} ${clamp(eyeY - fish, -2, 2)})`,
      )
    const lids = clamp(
      eyeOpen - blink * 0.94 - petting * 0.91 - chew * 0.45 - sleep * 0.93 + shocked * 0.15,
      0.07,
      1.1,
    )
    attr('eye-l', 'transform', `scale(1 ${lids})`)
    attr('eye-r', 'transform', `scale(1 ${clamp(lids - pulse(t, 2.6, 3.7) * 0.6, 0.07, 1.1)})`)
    attr(
      'face',
      'transform',
      `translate(${contactX * 0.1 * petting} ${chew * 0.7 + contactY * 0.08 * petting}) rotate(${pulse(t, 3.5, 5.5) * 5 + eyeX * 0.7 * drift + petting * 3} 0 8)`,
    )
    move('brows', 0, -2.5 * shocked - 1.5 * fish)
    const yawn = pulse(calm % 31, 26, 28) * drift
    attr(
      'jaw',
      'transform',
      `translate(0 10) scale(1 ${0.45 + chew * 1.1 + shocked + yawn}) translate(0 -10)`,
    )
    turn('whiskers', shake * 2 + petting, -1, 6)
    turn('ear-l', pulse(clock % 8.7, 4.7, 5.1) * 9 - 6 * shocked, -26, -28)
    turn('ear-r', pulse(clock % 10.1, 2.8, 3.1) * 7 - 8 * shocked, -26, -28)
    turn(
      'tail',
      (reduced ? 0 : 4 * Math.sin(clock * 0.9)) -
        18 * shocked -
        19 * petting -
        30 * sleep +
        (departing ? 20 : 0),
      26,
      87,
    )
    turn(
      'paw-l',
      (departing ? -45 : 0) -
        42 * close * (1 - drift) -
        15 * chew -
        16 * shocked -
        19 * (fish + reach) -
        10 * petting +
        7 * idleNod +
        18 * sleep,
      0,
      0,
    )
    turn(
      'paw-r',
      -39 * close * (1 - drift) -
        26 * shocked -
        29 * (fish + reach) -
        48 * petting -
        7 * idleNod +
        15 * sleep,
      0,
      0,
    )
    turn('visor', recoil(1.7 - pet, 12) * (pet > 0 ? 2 : 0), 0, 28)
    opacity('oxygen-light', 0.78 + (reduced ? 0 : 0.2 * Math.sin(clock * 1.3)))
    move('glint', 0.8 * idleNod, 0.5 * idleNod)
    opacity('contact', petting * 0.8)
    move('contact', contactX, contactY)
    attr('ripple', 'r', 5 + clamp(1 - pet / 1.7) * 18)
    opacity('pet-sparks', petting)
    move('pet-sparks', cat.x + 42, cat.y - 48 - (1 - pet / 1.7) * 15)
    const scatter = ease(fishAge, 21, 23)
    fishStars.forEach((el, i) =>
      el.setAttribute(
        'transform',
        `translate(${Math.cos(i * 2.4) * scatter * 13} ${Math.sin(i * 2.4) * scatter * 11})`,
      ),
    )
    node('fish').firstElementChild!.setAttribute('opacity', String(1 - scatter))
    const yarnRoll = reduced ? 0 : ease(yarnAge, 0, 1.9) * (1 - ease(yarnAge, 2.4, 6))
    attr(
      'yarn-orbit',
      'transform',
      `translate(${214 + 32 * yarnRoll + 2 * Math.sin(clock * 0.22)} ${83 - 8 * yarnRoll}) rotate(${yarnRoll * 56})`,
    )
    opacity('fish', fish * 0.7)
    move('fish', cat.x + 70 - (fishAge - 17) * 12, cat.y - 89 - 7 * fish)
    if (lastCue !== phase) {
      lastCue = phase
      phaseLabel.textContent = label
      if (phase === 'idle' && !reduced && !feedback) say('…meow?', 2600)
    }
    if (lastSecond !== Math.floor(t)) {
      lastSecond = Math.floor(t)
      timecode.textContent = '00:' + String(lastSecond).padStart(2, '0') + ' / 00:18'
    }
    if (t < duration || bar.style.transform !== 'scaleX(1)')
      bar.style.transform = 'scaleX(' + t / duration + ')'
    if (t >= 15.6 && visible && !document.hidden) unlock()
  }
  function tick(now: number) {
    frame = 0
    const dt = previous ? Math.min((now - previous) / 1000, 0.1) : 0
    const limit = t >= duration ? 1 / 30 : 0
    if (!previous || dt >= limit) {
      previous = now
      if (t < duration) {
        t = Math.min(duration, t + dt)
        if (t === duration) controls()
      } else idle += dt
      pet = Math.max(0, pet - dt)
      render()
    }
    schedule()
  }
  function schedule() {
    if (frame || paused || away || document.hidden || !visible || motion.matches) return
    frame = requestAnimationFrame(tick)
  }
  function stop() {
    cancelAnimationFrame(frame)
    frame = 0
    previous = 0
  }
  function restart(end: boolean) {
    stop()
    for (const timer of [toastTimer, fadeTimer, messageTimer, radioTimer, petTimer]) clearTimeout(timer)
    t = end || motion.matches ? duration : 0
    idle = 0
    yarnStart = -10
    pet = 0
    petCount = 0
    feedback = ''
    lastTouch = 0
    gazeX = 0
    gazeY = 0
    eyeX = 0
    eyeY = 0
    paused = false
    departing = false
    awardGiven = false
    lastCue = ''
    toast.hidden = true
    caption.hidden = true
    status.textContent = ''
    controls()
    render()
    schedule()
  }
  function interact(kind: 'earth' | 'pet' | 'radio' | 'garden' | 'yarn' | 'stars', event: MouseEvent | KeyboardEvent) {
    lastTouch = idle
    if (kind === 'earth') {
      if (deck.hidden && ++earthTaps === 5) {
        deck.hidden = false
        node('earth').setAttribute('aria-expanded', 'true')
        say('Signal received. Playback controls unlocked.')
      }
      return
    }
    clearTimeout(radioTimer)
    if (kind === 'pet') {
      contactX = 13
      contactY = -6
      if (event.currentTarget === node('cat-hit') && 'clientX' in event && event.detail) {
        const matrix = get<SVGGElement>('#visor').getScreenCTM()
        if (matrix) {
          const p = new DOMPoint(event.clientX, event.clientY).matrixTransform(matrix.inverse())
          contactX = clamp(p.x, -34, 34)
          contactY = clamp(p.y, -36, 17)
        }
      }
      petCount++
      feedback = petCount % 4 === 0 ? 'bonk' : reactions[(petCount - 1) % reactions.length]
      pet = paused || motion.matches ? 0.85 : 1.65
      clearTimeout(petTimer)
      if (paused || motion.matches)
        petTimer = window.setTimeout(() => {
          pet = 0
          render()
        }, 1700)
      gazeX = contactX / 12
      gazeY = contactY / 18
      say(feedback)
    } else if (kind === 'radio') {
      feedback = 'Mission Control: Meow-01, please stop eating the wires.'
      say(feedback, 3200)
      radioTimer = window.setTimeout(() => say('…meow.'), 3200)
    } else if (kind === 'stars') {
      say('Somewhere in the universe, every lost page has a cat.', 4600)
    } else if (kind === 'yarn') {
      yarnStart = t + idle
      gazeX = -2.6
      gazeY = -1.4
      say('That one got away.')
    } else {
      feedback = 'A light left on for the long way home.'
      gazeX = 2.6
      gazeY = 1
      say(feedback)
    }
    render()
  }
  for (const [id, kind] of [
    ['earth', 'earth'],
    ['cat-hit', 'pet'],
    ['radio', 'radio'],
    ['garden', 'garden'],
    ['paw-stars', 'stars'],
    ['yarn', 'yarn'],
  ] as const) {
    const el = node(id)
    el.setAttribute('role', 'button')
    el.setAttribute('tabindex', '0')
    el.addEventListener('click', (e) => interact(kind, e as MouseEvent), { signal })
    el.addEventListener(
      'keydown',
      (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          if (!e.repeat) interact(kind, e)
        }
      },
      { signal },
    )
  }
  petControl.addEventListener('click', (e) => interact('pet', e), { signal })
  radioControl.addEventListener('click', (e) => interact('radio', e), { signal })
  node('paw-stars').addEventListener(
    'pointerenter',
    (e) => {
      if (e.pointerType === 'mouse') say('Somewhere in the universe, every lost page has a cat.', 4600)
    },
    { signal },
  )
  root.addEventListener(
    'pointerdown',
    () => {
      lastTouch = idle
    },
    { signal },
  )
  root.addEventListener(
    'keydown',
    () => {
      lastTouch = idle
    },
    { signal },
  )
  svg.addEventListener(
    'pointermove',
    (e) => {
      if (e.pointerType === 'touch') return
      const rect = node('visor').getBoundingClientRect()
      gazeX = clamp(((e.clientX - rect.x - rect.width / 2) / Math.max(1, rect.width)) * 4, -2.7, 2.7)
      gazeY = clamp(((e.clientY - rect.y - rect.height / 2) / Math.max(1, rect.height)) * 3, -1.7, 1.7)
      lastTouch = idle
    },
    { signal },
  )
  svg.addEventListener(
    'pointerleave',
    () => {
      gazeX = gazeY = 0
    },
    { signal },
  )
  rest.addEventListener(
    'click',
    () => {
      paused = !paused
      stop()
      controls()
      schedule()
    },
    { signal },
  )
  skip.addEventListener(
    'click',
    () => {
      restart(true)
      if (deck.hidden) node('earth').focus({ preventScroll: true })
      else replay.focus()
    },
    { signal },
  )
  replay.addEventListener(
    'click',
    () => {
      restart(false)
      if (!motion.matches) skip.focus()
    },
    { signal },
  )
  // A missing URL can itself be the referrer. Only re-enter known portfolio pages.
  const back = get<HTMLAnchorElement>('#back-link')
  let canGoBack = false
  if (document.referrer && history.length > 1) {
    const prior = new URL(document.referrer)
    const priorPath = prior.pathname.replace(/\/index\.html$/, '/').replace(/\/?$/, '/')
    const remember = () => {
      canGoBack = true
      back.href = prior.href
    }
    if (
      prior.origin === location.origin &&
      prior.pathname !== location.pathname &&
      priorPath.startsWith(base)
    ) {
      if (priorPath === base) remember()
      else
        void fetch(base + 'manifest.json', { signal })
          .then((response) => (response.ok ? response.json() : []))
          .then((entries: { url: string }[]) => {
            if (entries.some((entry) => entry.url === priorPath)) remember()
          })
          .catch(() => {
            /* The native home link remains available offline. */
          })
    }
  }
  back.addEventListener(
    'click',
    (e) => {
      if (canGoBack && !e.ctrlKey && !e.metaKey && !e.shiftKey && !e.altKey) {
        e.preventDefault()
        history.back()
      }
    },
    { signal },
  )
  get('#earth-link').addEventListener(
    'click',
    (e) => {
      if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey || motion.matches || t < duration) return
      e.preventDefault()
      if (departing) return
      departing = true
      gazeX = -3
      gazeY = 2
      root.classList.add('departing')
      render()
      returnTimer = window.setTimeout(() => location.assign(base), 180)
    },
    { signal },
  )
  document.addEventListener(
    'visibilitychange',
    () => {
      stop()
      if (!document.hidden) {
        render()
        schedule()
      }
    },
    { signal },
  )
  motion.addEventListener('change', () => restart(motion.matches), { signal })
  function frameWorld() {
    svg.setAttribute('viewBox', narrow.matches ? '27 36 706 430' : '0 0 760 480')
    render()
  }
  narrow.addEventListener('change', frameWorld, { signal })
  const observer =
    'IntersectionObserver' in window
      ? new IntersectionObserver(([entry]) => {
          visible = entry.isIntersecting
          stop()
          if (visible) {
            render()
            schedule()
          }
        })
      : undefined
  observer?.observe(root)
  window.addEventListener(
    'pagehide',
    (e) => {
      away = true
      stop()
      if (!e.persisted) {
        controller.abort()
        observer?.disconnect()
        for (const timer of [toastTimer, fadeTimer, messageTimer, radioTimer, returnTimer, petTimer])
          clearTimeout(timer)
      }
    },
    { signal },
  )
  window.addEventListener(
    'pageshow',
    () => {
      away = false
      departing = false
      root.classList.remove('departing')
      schedule()
    },
    { signal },
  )
  node('earth').setAttribute('aria-controls', deck.id)
  node('earth').setAttribute('aria-expanded', 'false')
  restart(motion.matches)
  frameWorld()
}

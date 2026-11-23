import { CornerUpLeft, Earth, FastForward, Pause, PawPrint, Play, Radio, RotateCcw } from 'lucide-react'
import { base } from './model'
import { Shell } from './Shell'
import { Sky, World } from './space/World'

function Achievement() {
  return <aside id="achievement" className="achievement" hidden>
    <svg viewBox="0 0 20 20" width="42" height="42" aria-hidden="true" shapeRendering="crispEdges">
      <path fill="#91bfc1" d="M5 1h10v2h3v3h1v8h-2v3H3v-3H1V6h1V3h3Z"/>
      <path fill="#294354" d="M5 3h10v2h2v9h-2v2H5v-2H3V6h2Z"/>
      <path fill="#dfad7e" d="M5 5h2v2h6V5h2v8h-2v2H7v-1H5Z"/>
      <path fill="#f7d5a2" d="M7 11h6v3H7Z"/><path fill="#273444" d="M6 9h2v2H6zm6 0h2v2h-2zm-3 3h2v1H9Z"/>
      <path fill="#e7eece" d="M4 4h4v1H4zm-1 2h1v3H3Z"/><path fill="#758d8a" d="M4 16h12v2H4Z"/><path fill="#f1c779" d="M7 17h5v1H7Z"/>
    </svg>
    <div><strong>Achievement Unlocked!</strong><span>You found the cat, but not the page.</span></div><i aria-hidden="true">✦</i>
  </aside>
}

export function NotFound() {
  return <Shell><main id="main" className="meowverse" data-story="still">
    <Sky/>
    <div className="space-wrap">
      <div className="story-layout">
        <div className="story-copy">
          <div className="lost-label"><span aria-hidden="true"/>404 / Page not found</div>
          <h1><span className="sr">404 — </span>Lost in the<br/><em>Meowverse.</em></h1>
          <p>Our little astronaut chewed through the wrong cable. The page drifted away. The cat did too.</p>
          <div className="flight-links"><a id="earth-link" href={base}><Earth size={17}/>Return to Earth</a><a id="back-link" href={base}><CornerUpLeft size={16}/>Go Back</a><button id="skip-film" type="button" hidden><FastForward size={15}/>Skip animation</button></div>
        </div>
        <div className="observatory"><World/><output className="comms" id="comms" hidden aria-live="polite"/></div>
      </div>
      <div className="flight-deck" id="flight-deck" hidden>
        <div className="film-name"><span className="film-light" aria-hidden="true"/><span id="phase">Quiet orbit</span></div>
        <div className="film-track" aria-hidden="true"><span id="playhead"/></div>
        <span id="timecode" aria-hidden="true">00:00 / 00:18</span>
        <div className="film-controls">
          <button id="pet-cat" type="button" hidden><PawPrint size={15}/>Pet Meow-01</button>
          <button id="call-radio" type="button" hidden aria-label="Call the suit radio" title="Call the suit radio"><Radio size={16}/></button>
          <button id="rest" type="button" aria-label="Pause animation"><Pause size={15}/><Play size={15}/></button>
          <button id="replay" type="button"><RotateCcw size={15}/>Replay the accident</button>
        </div>
      </div>
      <Achievement/><p id="story-status" className="sr" role="status"/>
    </div>
  </main></Shell>
}

import { Astronaut, SuitMaterials } from './Astronaut'

function Starfield({ count, seed, width, height }: {count: number; seed: number; width: number; height: number}) {
  let state = seed
  const random = () => { state = (1664525 * state + 1013904223) >>> 0; return state / 4294967296 }
  return <>{Array.from({length: count}, (_, i) => {
    const x = random()*width, y = random()*height, r = .45+random()*1.3
    return <g key={i} opacity={.28+random()*.66} fill={['#fff2d5','#bdd9ed','#dec69c'][i%3]}>
      <circle cx={x} cy={y} r={r}/>{i%19===0 && <path d={`M${x-4.8} ${y}q4.4-.5 4.8-5 .4 4.5 4.8 5-4.4.5-4.8 5-.4-4.5-4.8-5Z`}/>}
    </g>
  })}</>
}

export function Sky() {
  return <svg className="deep-sky" viewBox="0 0 1500 850" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <g id="far-stars"><Starfield count={190} seed={1719} width={1500} height={850}/></g>
    <g id="near-stars"><Starfield count={49} seed={491} width={1500} height={850}/></g>
  </svg>
}

function Earth() {
  return <g transform="translate(133 365)"><g id="earth" aria-label="Earth" transform="scale(.76)">
    <circle r="83" fill="url(#air)"/><circle r="51" fill="url(#ocean)" stroke="#98d9e1" strokeWidth="1.5"/>
    <g clipPath="url(#horizon)"><g id="continents">
      <path d="m-47-24 12-16 16-3 9 5-3 8 8 3-6 7-13 1-6 9-9-2-6 5-10-11Zm13 30 10-6 13 6 8 12-5 6-4 12-9 6-3-17-7-6ZM9-37l17 1 10 9-3 8 12 7-6 4-12-3-6 6 4 8-6 11-9 15-7-8-3-15-6-7 2-9 13-3-4-6 7-4Z" fill="#80a9ac"/>
      <path d="M-61-14c22 2 29 13 50 4 14-6 29-3 41 1-16-1-25 2-37 6-18 5-40 4-56-2Zm7 29q19-8 32-3t28-1q-18 9-33 6t-28 4ZM-31-35q22 6 32 0t31 2q-18-1-26 5t-37-3Zm46 59q19-12 38-7l-9 5q-11-2-24 6Z" fill="#dcebea" opacity=".84"/>
      <path d="M-39-19q14 7 29 4m-29 33q9-5 18-3m0-44q10 3 23-2m20 39 16-3" fill="none" stroke="#f6f8eb" strokeWidth="2" strokeLinecap="round"/>
    </g><circle r="52" fill="url(#nightfall)"/></g>
    <path d="M-49 7a50 50 0 0 1 68-54" fill="none" stroke="#d4f4ef" strokeWidth="2.4"/>
  </g></g>
}

function Ship() {
  return <g transform="translate(606 82)"><g id="ship" transform="scale(.75)"><g transform="rotate(-18)">
    <path d="M-31-3q-19 0-29 8l29-2" fill="#8bcbcf" opacity=".35"/><path d="m-29-2-18 5 18-1" fill="#c5efdc"/>
    <path d="M-25-8-36-19l12 1 16 12 16 1-6 9-27 8 5-9-9-2Z" fill="#78959f" stroke="#455767"/>
    <path d="M-30-5Q-12-17 8-12 27-9 32-1 17 8-5 9q-18 0-25-6Z" fill="url(#suit)" stroke="#76949e" strokeWidth="1.5"/>
    <path d="M-13-12q4-12 17-8l9 8Z" fill="#8cc2ca" stroke="#a3cbd0"/><path d="m-7 1 4 6 14-1 5-6" fill="#829ba0"/>
    {[-15,-7,1,9].map(x=><circle key={x} cx={x} cy="-5" r="1.8" fill="#ffe5a5"/>)}
    <path d="m11-12 5-10" stroke="#b8c9c6"/><circle id="ship-lamp" cx="16" cy="-22" r="2.4" fill="#efbd85"/>
  </g></g></g>
}

function GardenMoon() {
  return <g id="garden" transform="translate(688 376) rotate(13)" aria-label="Visit the lantern moon">
    <circle className="moon-target" r="43" fill="transparent"/>
    <ellipse cx="1" cy="3" rx="36" ry="11" fill="none" stroke="#d3af7f" opacity=".34" transform="rotate(-24)"/>
    <path d="M-22 0q-1-14 14-20Q8-27 20-13q10 12-1 26Q7 26-9 19-24 14-22 0Z" fill="url(#moon-stone)" stroke="#a89178"/>
    <path d="M-17-11q14-11 28-5M-21 6q6 3 12 2m13 6 10-5" stroke="#a98c75" fill="none"/>
    <ellipse cx="-8" cy="-3" rx="5" ry="2.6" fill="#7a6963"/><ellipse cx="9" cy="5" rx="3" ry="1.8" fill="#78625d"/>
    <path d="M-3-18v-20m-6 19 3-5 6-1 5 3" fill="none" stroke="#bdac86" strokeWidth="1.6"/>
    <circle cx="-3" cy="-43" r="13" fill="url(#lamplight)"/><path d="m-6-45 6 0-1 7h-4Z" fill="#ffdfa0"/><path d="m-8-46 5-4 5 4Z" fill="#907461"/>
    <path d="M-33 15Q-2 18 33-14" stroke="#d4b68c" fill="none" opacity=".75"/>
  </g>
}

function Asteroids() {
  return <g id="stones" fill="#465165" stroke="#647080" strokeWidth="1.1">
    {[[60,117,.85,21],[635,307,.48,-24],[295,415,.58,17]].map(([x,y,s,r])=><g key={x} transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
      <path d="m-13-3 6-8 12 1 9 7-4 8-13 4-10-5Z"/><path d="m-10-4 7-5 7 2-5 4Zm8 7 4-4 6 1-2 4Z" fill="#303a4c" stroke="none"/>
    </g>)}
  </g>
}

function Tube({ id, fine = false }: {id: string; fine?: boolean}) {
  return <g fill="none" strokeLinecap="round" strokeLinejoin="round">
    <use href={'#'+id} stroke="#080f1e" strokeWidth={fine?5.9:24} transform="translate(0 3)"/>
    <use href={'#'+id} stroke="#86b2bb" strokeWidth={fine?5.4:21}/>
    <use href={'#'+id} stroke="url(#sheath)" strokeWidth={fine?4.3:18}/>
    {!fine && <use href={'#'+id} stroke="#233e52" strokeOpacity=".31" strokeWidth="15.8" strokeDasharray="1 8" strokeLinecap="butt"/>}
    <use href={'#'+id} stroke="#c4ede6" strokeWidth={fine?1.5:6} transform={fine?undefined:'translate(-1 -2)'}/>
    {!fine && <><use href={'#'+id} stroke="#f5ffed" strokeWidth="1.8" transform="translate(-2 -3)"/>
      <use className="fiber-pulse" href={'#'+id} stroke="#effffb" strokeWidth="3" strokeDasharray="22 740" opacity=".68"/></>}
  </g>
}

function Clamp({x,y,angle=0}: {x:number;y:number;angle?:number}) {
  return <g transform={`translate(${x} ${y}) rotate(${angle})`}>
    <rect x="-7" y="-12" width="14" height="24" rx="3" fill="url(#brass)" stroke="#334b53" strokeWidth="1.5"/>
    <path d="M-4-10v20m8-20v20" stroke="#c8b79b" strokeWidth="1.4"/><path d="M-3-7h6v4h-6Z" fill="#e2ce9e"/>
  </g>
}

function Fibers({right}: {right?: boolean}) {
  const id=right?'ends-r':'ends-l'
  return <g id={id} opacity=".95" transform={right?'translate(447 227) scale(-1 1)':'translate(351 219)'} strokeLinecap="round" fill="none">
    <path d="m-5-2q6 0 10-5m-6 7 9-2m-10 3q7-1 10 4" stroke="#f3b77b" strokeWidth="1.8"/><path d="m-3 0 9-3" stroke="#c2f5f0" strokeWidth="1.3"/>
  </g>
}

export function World() {
  return <svg id="universe" className="world" viewBox="0 0 760 480" aria-labelledby="world-title world-desc">
    <title id="world-title">The cat who bit the universe</title>
    <desc id="world-desc">Meow-01 nibbles the cable inside a pressure-sealed helmet. The left four and zero drift together. The other four floats free.</desc>
    <defs><SuitMaterials/>
      <radialGradient id="air"><stop offset=".48" stopColor="#84d8e7" stopOpacity=".6"/><stop offset=".65" stopColor="#5ca9d0" stopOpacity=".24"/><stop offset="1" stopColor="#3c699f" stopOpacity="0"/></radialGradient>
      <radialGradient id="ocean" cx=".24" cy=".18" r=".91"><stop stopColor="#bbebea"/><stop offset=".37" stopColor="#68acc4"/><stop offset=".72" stopColor="#4078a5"/><stop offset="1" stopColor="#223450"/></radialGradient>
      <linearGradient id="nightfall" x1="0" y1=".35" x2="1" y2=".7"><stop offset=".2" stopColor="#111e3c" stopOpacity="0"/><stop offset=".7" stopColor="#182744" stopOpacity=".42"/><stop offset="1" stopColor="#111b37" stopOpacity=".95"/></linearGradient>
      <clipPath id="horizon"><circle r="50.8"/></clipPath>
      <radialGradient id="moon-stone" cx=".25" cy=".16" r=".9"><stop stopColor="#e2c29c"/><stop offset=".53" stopColor="#a38872"/><stop offset="1" stopColor="#4a4750"/></radialGradient>
      <radialGradient id="lamplight"><stop stopColor="#ffcd81" stopOpacity=".65"/><stop offset="1" stopColor="#e9ac68" stopOpacity="0"/></radialGradient>
      <linearGradient id="sheath" x1="0" y1="0" x2=".85" y2="1"><stop stopColor="#536c7e"/><stop offset=".3" stopColor="#8eafb3"/><stop offset=".53" stopColor="#4d7384"/><stop offset=".85" stopColor="#375769"/><stop offset="1" stopColor="#7597a4"/></linearGradient>
      <linearGradient id="brass" x2="0" y2="1"><stop stopColor="#cbb395"/><stop offset=".28" stopColor="#9c8268"/><stop offset=".6" stopColor="#615b56"/><stop offset="1" stopColor="#a69980"/></linearGradient>
      <path id="four-a" d="M181 135Q184 124 177 131L81 247Q72 260 88 261H209M169 172Q166 236 164 322"/>
      <path id="zero" d="M430 245C442 174 432 124 377 121C318 118 285 165 268 239C250 312 270 343 316 345C375 350 417 313 430 245Z"/>
      <path id="join-40" d="M209 261C235 261 241 243 268 239"/>
      <path id="four-b" d="M605 134Q608 125 602 131L504 247Q494 260 500 261Q547 262 634 261M594 170Q592 233 588 323"/>
      <path id="lead-l" d="M430 245C430 280 344 279 344 244Q344 226 351 219"/>
      <path id="lead-r" d="M447 227C469 208 472 261 500 261"/>
    </defs>
    <g aria-hidden="true">
      <g fill="none" stroke="#95b5c4" opacity=".16" strokeWidth=".8">
        <ellipse cx="377" cy="233" rx="340" ry="130" transform="rotate(-19 377 233)" strokeDasharray="2 6"/>
        <path d="M43 402Q409 400 680 54M170 71C396 11 656 192 720 308" opacity=".66"/>
      </g>
    </g><Earth/><g aria-hidden="true"><Ship/><Asteroids/></g><GardenMoon/>
    <g id="yarn-orbit" transform="translate(214 83)"><g id="yarn" aria-label="Nudge the ball of yarn">
      <circle r="26" fill="transparent"/><path d="M7 4c17-5 13 13 28 7" fill="none" stroke="#b39789" strokeWidth="1.6"/>
      <circle r="10" fill="#927e82" stroke="#c4a391"/>
      <path d="M-8 4q10-5 13-12m-15 9q7-2 11-10M-6 8q11-6 14-14m-9 15 10-9m-17-7 4 2m-2-5 5 2" fill="none" stroke="#e3bc9e" strokeWidth="1"/>
    </g></g>
    <g id="paw-stars" transform="translate(514 59) rotate(14)" aria-label="Read the paw constellation">
      <circle r="28" fill="transparent"/><path d="m-13-2 5-8 9-3 9 6 3 9M-7 4l7-5 8 8-8 2Z" fill="none" stroke="#9aadc1" opacity=".3" strokeWidth=".8"/>
      {[[-13,-2],[-8,-10],[1,-13],[10,-7],[13,2],[-7,4],[0,-1],[8,7],[0,9]].map(([x,y])=><circle key={x+','+y} cx={x} cy={y} r="1.45" fill="#e3d8c9"/>)}
    </g>
    <g id="rig">
      <g id="left-frame" transform="translate(-32 1) rotate(-4 275 239)">
        <g id="digit-a"><Tube id="four-a"/><Clamp x={129} y={190} angle={-51}/><Clamp x={165} y={295} angle={92}/></g>
        <Tube id="join-40" fine/>
        <g id="digit-o"><Tube id="zero"/><Clamp x={362} y={122} angle={-12}/><Clamp x={276} y={308} angle={74}/><Clamp x={429} y={245} angle={101}/></g>
      </g>
      <g id="right-frame" transform="translate(54 -7) rotate(6 571 230)"><Tube id="four-b"/><Clamp x={550} y={194} angle={-49}/><Clamp x={590} y={295} angle={92}/></g>
      <Astronaut/>
      <g id="junction" pointerEvents="none"><g id="left-lead" transform="translate(-32 1) rotate(-4 275 239)"><Tube id="lead-l" fine/><Fibers/></g>
        <g id="right-lead" transform="translate(54 -7) rotate(6 571 230)"><Tube id="lead-r" fine/><Fibers right/></g>
        <g id="tooth" opacity="0"><path d="M-7-2.5q3 1 6-1 2 1.6 7 .2" fill="none" stroke="#744b3e" strokeWidth="1.4"/><path d="m3-3 3 .1-2 4Z" fill="#fff4d6"/></g>
        <g id="thought" opacity="0" transform="translate(418 165)"><circle r="1.8" cy="14" fill="#f8dec0"/><circle cx="4" cy="9" r="2.4" fill="#f8dec0"/><ellipse cx="17" cy="-2" rx="17" ry="11" fill="#e4dcc5"/><path d="M7-2q6-8 13 0-7 7-13 0m12 0 6-4v8Z" fill="#698a8b"/><circle cx="11" cy="-3" r="1" fill="#e9e2cc"/></g>
        <g id="sparks" opacity="0" fill="#ffe3a5">{Array.from({length:9},(_,i)=><path key={i} d="m0-2 1.3 2L0 2l-1.3-2Z"/>)}</g>
      </g>
    </g>
    <g id="fish" opacity="0" aria-hidden="true" fill="#ead2a3"><path d="m-18 0 9-6L3 0l-12 7-9-7m21 0 7-5v10Z" fill="none" stroke="#b0b5b9" strokeWidth=".9"/>{[[-18,0],[-9,-6],[3,0],[-9,7],[10,-5],[10,5]].map(([x,y])=><circle key={x+','+y} cx={x} cy={y} r="1.6"/>)}</g>
    <g id="pet-sparks" opacity="0" fill="#ffe4a0" aria-hidden="true"><path d="m0-5 1 4 4 1-4 1-1 4-1-4-4-1 4-1Z"/><circle cx="12" cy="-4" r="1.4"/><circle cx="-9" cy="9" r="1"/></g>
  </svg>
}

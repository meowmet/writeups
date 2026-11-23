// Local coordinates put the mouth at (0, 9). Both pressure seals share that axis.
export function SuitMaterials() {
  return <>
    <linearGradient id="suit" x2=".7" y2="1" gradientUnits="objectBoundingBox">
      <stop stopColor="#fff2d3"/><stop offset=".48" stopColor="#e0d5b7"/><stop offset="1" stopColor="#7f9b9e"/>
    </linearGradient>
    <linearGradient id="trim" x2=".85" y2="1"><stop stopColor="#91c7bf"/><stop offset=".48" stopColor="#568a90"/><stop offset="1" stopColor="#294557"/></linearGradient>
    <radialGradient id="fur" cx=".35" cy=".25" r=".89"><stop stopColor="#ffd39d"/><stop offset=".58" stopColor="#cd926b"/><stop offset="1" stopColor="#9d644f"/></radialGradient>
    <linearGradient id="glass" x2="1" y2="1"><stop stopColor="#cdffff" stopOpacity=".35"/><stop offset=".36" stopColor="#8bc4d0" stopOpacity=".035"/><stop offset=".75" stopColor="#8fc2ca" stopOpacity=".04"/><stop offset="1" stopColor="#ffc18c" stopOpacity=".36"/></linearGradient>
  </>
}

function Ear({right}: {right?: boolean}) {
  return <g transform={right ? 'translate(2 -1) scale(-1 1)' : undefined}><g id={right ? 'ear-r' : 'ear-l'}>
    <path d="M-37-22Q-45-44-39-52Q-35-56-15-35L-11-25Z" fill="url(#fur)" stroke="#714e43" strokeWidth="1.7"/>
    <path d="M-35-31Q-39-42-36-46Q-29-42-24-35Z" fill="#c58078"/>
    <path d="m-36-50 4 1m-7 5 3-2" fill="none" stroke="#ffe1b6" strokeLinecap="round"/>
  </g></g>
}

function Eye({right}: {right?: boolean}) {
  return <g transform={'translate(' + (right ? 17 : -17) + ' -10)'}><g id={right ? 'eye-r' : 'eye-l'}>
    <path d="M-10-1C-9-15 7-15 10-2Q11 9 0 10Q-11 9-10-1Z" fill="#392d2e"/>
    <ellipse cy="1" rx="7.5" ry="8" fill="#d3ab6c"/>
    <g className="pupil"><ellipse cy="-1" rx="5.2" ry="7.7" fill="#202c34"/><circle cx="-2.5" cy="-5" r="2.5" fill="#ffffeb"/><circle cx="2.5" cy="2" r=".95" fill="#f5f1d2"/></g>
  </g></g>
}

function Boot({right}: {right?: boolean}) {
  return <g transform={right ? 'translate(14 100) rotate(-15)' : 'translate(-20 100) rotate(18)'}>
    <path d="M-12-8Q0-13 13-7L12 12Q21 22 12 26Q-4 30-15 20Z" fill="url(#suit)" stroke="#546970" strokeWidth="2"/>
    <path d="M-14 15Q-2 20 12 12L16 21Q2 31-14 23Z" fill="url(#trim)"/><path d="m-9 5 17 1m-18 3 17 1" stroke="#9d9e8c" fill="none"/>
  </g>
}

function Glove({right}: {right?: boolean}) {
  return <g transform={right ? 'translate(25 50) scale(-1 1)' : 'translate(-25 50)'}><g id={right ? 'paw-r' : 'paw-l'}>
    <path d="M0-3Q-11-7-16 1L-26 13Q-30 19-22 26Q-15 31-9 24L5 11" fill="url(#suit)" stroke="#627778" strokeWidth="2"/>
    <path d="m-23 11 10 9-4 6-12-9Z" fill="url(#trim)"/>
    <path d="M-28 14c-4-5-8-3-7 1-6-2-7 2-5 5-5 2-2 8 4 10 8 4 14-1 14-8Z" fill="#e3cfad" stroke="#807f72" strokeWidth="1.4"/>
    <path d="m-35 18 2 3m-6 1 3 3" stroke="#b19c82" strokeLinecap="round"/>
  </g></g>
}

export function Astronaut() {
  return <g id="traveler" transform="translate(453 277) rotate(-13) scale(1.18)">
    <g id="cat-hit" aria-label="Pet Meow-01 and tap the helmet">
      <path className="cat-target" d="M-68-82h136V132H-68Z" fill="transparent"/>
      <ellipse className="cat-focus" cx="0" cy="23" rx="77" ry="112"/>
      <g id="tail"><path d="M22 86Q53 108 65 82C72 65 64 60 71 54Q81 46 83 61C87 99 58 125 23 102" fill="url(#fur)" stroke="#765348" strokeWidth="2"/>
        <path d="m56 95 9 7m-2-19 11 7m-7-18 12 4" stroke="#966348" strokeWidth="5" fill="none"/></g>
      <path d="M-26 36Q-46 29-47 46L-47 81Q-44 92-27 89L25 84 29 42Z" fill="url(#trim)" stroke="#273d47" strokeWidth="2"/>
      <path d="M-43 50v23m4-24v26" stroke="#b6d0c1" strokeWidth="2" strokeLinecap="round"/>
      <Boot/><Boot right/>
      <path d="M-17 32Q-34 37-36 56L-35 83Q-34 99-17 104Q1 110 22 102Q34 98 34 81L31 53Q28 37 16 32Z" fill="url(#suit)" stroke="#4f666a" strokeWidth="2.5"/>
      <path d="M-30 79q29 11 60-1l1 8q-30 11-62 0Z" fill="#729698"/><path d="M-21 90q8 4 17 4m12 0 11-3m-40-47q18 13 41 1" fill="none" stroke="#acaa95" strokeWidth="2"/>
      <rect x="-16" y="52" width="31" height="19" rx="4" fill="#3d5a63" stroke="#a8b8ab" strokeWidth="2"/>
      <rect x="-12" y="56" width="13" height="7" rx="1" fill="#9ad0be"/><path d="m4 57 6 0m-6 4 5 0" stroke="#dfb06b" strokeWidth="2"/>
      <circle id="oxygen-light" cx="8" cy="66" r="2" fill="#bef6c3"/>
      <path d="m22 48 1.4 3 3.2.4-2.4 2.2.6 3.3-2.8-1.6-2.8 1.6.6-3.3-2.5-2.2 3.5-.4Z" fill="#e0a554"/>
      <rect x="-23" y="72" width="24" height="7" rx="1.5" fill="#cdbd9e" stroke="#937f6d" strokeWidth=".7" strokeDasharray="1.5 1"/>
      <text x="-20" y="77" fontSize="4.7" fontFamily="monospace" fill="#51483c">MEOW-01</text>
      <path d="m19 87 2 3 4-1 2-3 1 6-4 3-5-2Z" fill="#5f7c7a"/>
      <path d="m-25 54-3 17m55-17 2 13" stroke="#9b9987" strokeWidth="1" strokeDasharray="2 1.5"/>
      <Glove/><Glove right/>
      <path d="M-32 24q33 16 63 0l-2 12q-31 14-60-1Z" fill="url(#trim)" stroke="#bdd3c7" strokeWidth="2"/>
      <g id="visor">
        <ellipse cy="-12" rx="60" ry="59" fill="#6da8b5" fillOpacity=".27" stroke="#42616d" strokeWidth="5"/>
        <g id="face"><Ear/><Ear right/>
          <path d="M-40-19Q-38-38-21-37Q0-47 22-36Q41-32 42-15L46-5 41-3 45 1 39 5Q33 25 4 26Q-27 30-39 10L-45 8l4-5-6-2Z" fill="url(#fur)" stroke="#8c6350" strokeWidth="1.3"/>
          <path d="m-14-36 6 11 2-13 5 13 6-15 1 13 8-12" fill="#9e6950"/>
          <path d="m-39-9 12 5-13-1m1 5 13 2-11 2m66-7 12-4-2 5m-11 5 12-3-2 5" fill="#a46c54"/>
          <path d="M-32 5q4-11 15-8Q-4 1 0 2Q13-5 23-2Q35 0 33 8Q30 23 5 26Q-21 27-32 5Z" fill="#f8dab2"/>
          <Eye/><Eye right/>
          <g id="brows" fill="none" stroke="#795446" strokeWidth="2.4" strokeLinecap="round"><path d="M-26-23q5-5 10-4m27-1q6-2 12 3"/></g>
          <g id="muzzle"><ellipse cx="-6" cy="7" rx="9" ry="6" fill="#ffe6c4"/><ellipse cx="6" cy="7" rx="9" ry="6" fill="#ffe6c4"/>
            <path d="M-5 2Q0-1 5 2Q3 6 0 7Q-4 5-5 2Z" fill="#a56c68"/>
            <g id="jaw"><path d="M-6 10q3 3 6-1 3 4 7 0Q4 17 0 17q-4 0-6-7Z" fill="#80594e"/><path d="m2 12 2 3 2-4" fill="#fff0ca"/></g>
          </g>
          <g id="whiskers" stroke="#ffedcb" strokeWidth="1.25" strokeLinecap="round" fill="none"><path d="M-19 6q-12-4-27-3m26 7q-16 1-24 5m64-9q14-5 27-4m-26 8q14 0 25 5"/></g>
        </g>
        <ellipse cy="-12" rx="59" ry="58" fill="url(#glass)" stroke="#c1e6de" strokeWidth="2.5"/>
        <path id="glint" d="M-51-26Q-46-50-23-59M-17-61l7-2" stroke="#f8ffec" strokeOpacity=".8" strokeWidth="4.5" fill="none" strokeLinecap="round"/>
        <path d="M31 33q17-9 22-23" stroke="#eac29d" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
        {[-1,1].map(sign=><g key={sign} transform={'translate('+sign*56+' 9) rotate('+sign*-16+')'}><ellipse rx="5" ry="9" fill="#335361" stroke="#a5c9c4" strokeWidth="2"/><ellipse rx="2" ry="5" fill="#172d37"/></g>)}
        <g id="contact" opacity="0" fill="#e9fff9"><circle id="ripple" r="8" fill="none" stroke="#dafcff"/><path d="M-4 3Q0-4 4 3Q5 7 0 6Q-5 7-4 3Z"/><circle cx="-5" cy="-1" r="1.7"/><circle cx="-2" cy="-4" r="1.8"/><circle cx="2" cy="-4" r="1.8"/><circle cx="5" cy="-1" r="1.7"/></g>
      </g>
    </g>
    <g id="radio" aria-label="Call mission control on the suit radio">
      <rect x="-17" y="51" width="34" height="22" rx="4" fill="transparent"/><rect className="radio-focus" x="-18" y="50" width="36" height="24" rx="4"/>
    </g>
  </g>
}

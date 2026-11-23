import type { ReactNode } from 'react'
import { Github, Sun, Moon } from 'lucide-react'
import { avatarUrl, base, repository } from './model'

export function Shell({ children }: { children: ReactNode }) {
  return <>
    <a className="skip" href="#main">Skip to content</a>
    <header id="top"><div className="frame mast">
      <a className="brand" href={base}><img src={avatarUrl} width="32" height="32" alt="" />meowmet<span>/ writeups</span></a>
      <nav aria-label="Primary"><a href={base + '#archive'}>Archive</a><a className="github" href={repository} aria-label="GitHub repository"><Github size={18}/><span>GitHub</span></a>
        <button id="theme" hidden type="button" aria-label="Toggle dark mode" aria-pressed="false"><Sun size={18}/><Moon size={18}/></button>
      </nav>
    </div></header>
    {children}
    <footer><div className="frame foot"><span>meowmet / CTF write-ups</span><a href="#top">Back to top</a></div></footer>
  </>
}

import { BookOpen, Braces, Cpu, Fingerprint, Globe2, LockKeyhole, Search, Trophy } from 'lucide-react'
import { achievements } from './achievements'
import { avatarUrl, featuredSlugs, type Entry } from './model'
import { Shell } from './Shell'

const categories = new Map([
  ['Web', { icon: Globe2, tone: 'teal' }],
  ['Reverse', { icon: Cpu, tone: 'purple' }],
  ['Crypto', { icon: LockKeyhole, tone: 'gold' }],
  ['Pwn', { icon: Braces, tone: 'blue' }],
  ['Linux Privilege Escalation', { icon: Fingerprint, tone: 'coral' }],
])

export function Portfolio({ entries }: { entries: Entry[] }) {
  const labels = Array.from(new Set(entries.map(entry => entry.category))).sort()
  const feature = featuredSlugs.map(slug => entries.find(entry => entry.slug === slug)).find(Boolean) ?? entries[0]
  return <Shell><main id="main" className="frame">
    <section className="hero" aria-labelledby="intro">
      <div><div className="byline"><img src={avatarUrl} width="44" height="44" alt="meowmet’s GitHub avatar" /><span>meowmet / field notes</span></div>
        <h1 id="intro">CTF <em>write-ups.</em></h1>
        <p className="intro">My notebook of CTF challenges, from reversing binaries to untangling ciphers. Each entry opens the original write-up with its evidence.</p>
        <a className="browse" href="#archive"><BookOpen size={18}/>Browse the archive</a>
      </div>
      {feature && <a className="feature" href={feature.url}>
        <span className="feature-grid" aria-hidden="true">{Array.from({length: 64}, (_, i) => <i key={i} style={{opacity: .15 + ((i * 13 + (i % 8) ** 2) % 17) / 20}} />)}</span>
        <span className="scorehead">Featured write-up</span>
        <span className="feature-bottom"><span className="feature-meta">{feature.eventShort} / {feature.category}</span>
        <strong>{feature.title}</strong><span>{feature.subtitle || feature.excerpt}</span></span>
      </a>}
    </section>
    <section id="archive" aria-labelledby="archive-heading">
      <div className="section-head"><div><div className="eyebrow">{entries.length} write-ups · {labels.length} categories</div><h2 id="archive-heading">Challenge archive</h2></div>
        <label className="search" hidden><Search size={17}/><span className="sr">Search write-ups</span><input id="query" type="search" placeholder="Search write-ups" /></label></div>
      <div className="filters" role="group" aria-label="Filter by category" hidden>
        {['All', ...labels].map(label => <button type="button" key={label} data-filter={label} aria-pressed={label === 'All'}>{label}<span>{label === 'All' ? entries.length : entries.filter(entry => entry.category === label).length}</span></button>)}
      </div>
      <p id="filter-status" className="sr" role="status"></p>
      <ul className="entries">{entries.map(entry => {
        const { icon: Icon, tone } = categories.get(entry.category) ?? { icon: BookOpen, tone: 'teal' }
        return <li key={entry.url} data-category={entry.category} data-search={[entry.event, entry.excerpt, ...entry.tags].join(' ')}>
          <a className={'entry ' + tone} href={entry.url}>
            <span className="entry-icon"><Icon size={22} strokeWidth={1.6}/></span>
            <span className="entry-copy"><strong>{entry.title}</strong><span>{entry.subtitle || entry.excerpt}</span></span>
            <span className="category">{entry.category}</span>
          </a>
        </li>
      })}</ul>
      <p id="empty" hidden>No write-ups match. <button type="button" id="reset">Clear filters</button></p>
    </section>
    <section className="achievements" aria-labelledby="placements"><h2 id="placements">Achievements</h2>
      {achievements.map(a => <div className="placement" key={a.event + a.date}>
        <div><span className="eyebrow"><Trophy size={15}/>{a.date}</span><h3>{a.event}</h3></div>
        <dl>{[['Place', a.place], ['Solved', a.solved], ['Points', a.points]].map(([key, value]) => <div key={key}><dt>{key}</dt><dd>{value}</dd></div>)}</dl>
      </div>)}
    </section>
  </main></Shell>
}

import fs from 'node:fs'
import path from 'node:path'
import MarkdownIt from 'markdown-it'
import type Token from 'markdown-it/lib/token.mjs'
import GithubSlugger from 'github-slugger'
import hljs from 'highlight.js'
import { base, repository, type Article, type Entry } from '../site/model'

const md = new MarkdownIt({ html: false })
const esc = md.utils.escapeHtml
const read = (name: string) => fs.readFileSync(name, 'utf8')
const plain = (token?: Token): string => (token?.children ?? []).map(t =>
  t.type === 'softbreak' || t.type === 'hardbreak' ? ' ' : t.type.endsWith('_open') || t.type.endsWith('_close') ? '' : t.content
).join('')
const dirs = (root: string) => fs.readdirSync(root, { withFileTypes: true }).filter(e => e.isDirectory() && !e.name.startsWith('.')).map(e => e.name)
const encoded = (file: string) => file.split('/').map(encodeURIComponent).join('/')

function eventEntries(root: string) {
  const indexFile = path.join(root, 'README.md')
  const tokens = fs.existsSync(indexFile) ? md.parse(read(indexFile), {}) : []
  const event = plain(tokens[tokens.findIndex(t => t.type === 'heading_open') + 1]).replace(/\s+[—–-]\s+Write-ups.*$/i, '') || root || 'CTF write-ups'
  const rows = new Map<string, { title: string; technique: string; category: string }>()
  for (let i = 0; i < tokens.length; i++) {
    if (tokens[i].type !== 'tr_open') continue
    const cells: Token[] = []
    while (++i < tokens.length && tokens[i].type !== 'tr_close') {
      if (tokens[i].type === 'inline') cells.push(tokens[i])
    }
    const href = cells[1]?.children?.find(t => t.type === 'link_open')?.attrGet('href')
    if (href) rows.set(path.posix.normalize(path.posix.join(root, decodeURI(href))), { title: plain(cells[1]), technique: plain(cells[2]), category: plain(cells[0]) })
  }
  return { event, rows }
}

const terms = ['Rust', 'GF(257)', 'Unicode NFKC', 'prototype pollution', 'stored XSS', 'CBC', 'IV recovery', 'nginx', 'Spring', 'Base64', 'GNU tar', 'cron', 'MD5', 'repeating-key XOR', 'symbolic execution', 'angr', 'jmp_buf', 'longjmp', 'byte constraints']
type RenderEnv = { resolve: (url: string, image: boolean) => string }
for (const [rule, attr] of [['link_open', 'href'], ['image', 'src']] as const) {
  const original = md.renderer.rules[rule]
  md.renderer.rules[rule] = (tokens, i, options, env: RenderEnv, renderer) => {
    const t = tokens[i]
    t.attrSet(attr, env.resolve(t.attrGet(attr) || '', rule === 'image'))
    if (rule === 'image') {
      t.attrSet('loading', 'lazy')
      t.attrSet('decoding', 'async')
    }
    return original ? original(tokens, i, options, env, renderer) : renderer.renderToken(tokens, i, options)
  }
}

md.renderer.rules.fence = (tokens, i) => {
  const { info, content } = tokens[i]
  const language = info.trim().split(/\s/)[0] || 'text'
  const code = hljs.getLanguage(language) ? hljs.highlight(content, {language, ignoreIllegals: true}).value : esc(content)
  return '<div class="codeblock"><div class="codebar"><span>' + esc(language) + '</span><button type="button" data-copy hidden aria-label="Copy code to clipboard">Copy code</button></div><pre tabindex="0"><code>' + code + '</code></pre></div>\n'
}

export function discover() {
  const entries: Entry[] = []
  const articles: Article[] = []
  const images = new Map<string, string>()
  const sources = new Map<string, string>()
  const pending = new Map<Entry, Token[]>()
  const roots = dirs('.').filter(d => d !== 'node_modules' && d !== 'dist' && fs.existsSync(path.join(d, 'writeups')))
  if (fs.existsSync('writeups')) roots.push('')
  for (const root of roots) {
    const { event, rows } = eventEntries(root)
    const year = event.match(/\b\d{4}\b/)?.[0]
    const eventShort = event.includes('/') ? [event.split('/')[0].trim(), year].filter(Boolean).join(' ') : event
    const area = path.posix.join(root, 'writeups')
    for (const categoryDir of dirs(area)) {
      for (const slug of dirs(path.posix.join(area, categoryDir))) {
        const file = path.posix.join(area, categoryDir, slug, 'README.md')
        if (!fs.existsSync(file)) continue
        const raw = read(file)
        const tokens = md.parse(raw, {})
        const h1 = tokens.findIndex(t => t.type === 'heading_open' && t.tag === 'h1')
        const heading = h1 < 0 ? '' : plain(tokens[h1 + 1])
        const [name, ...rest] = heading.split(/\s+[—–]\s+/)
        const row = rows.get(file)
        const metadata = (label: string) => raw.match(new RegExp('\\*\\*' + label + ':\\*\\*\\s*([^·\\n]+)', 'i'))?.[1]?.trim()
        const technique = rest.join(' — ') || row?.technique || ''
        const intro = tokens.find((t, i) => t.type === 'inline' && tokens[i - 1]?.type === 'paragraph_open'
          && t.level === 1 && !/^(?:Category|Event|Difficulty|Flag|Author|Tags|Files):/i.test(plain(t))
          && t.children?.some(child => child.type === 'text' && child.content.trim()))
        const paragraph = plain(intro).trim()
        const excerpt = paragraph.length > 165 ? paragraph.slice(0, 162).replace(/\s+\S*$/, '') + '…' : paragraph
        const url = base + encoded(path.posix.join(root, categoryDir, slug)) + '/'
        const entry: Entry = {
          title: name || row?.title || slug, subtitle: technique, excerpt: excerpt || technique,
          category: metadata('Category') || row?.category || categoryDir,
          event, eventShort, difficulty: metadata('Difficulty'),
          tags: terms.filter(t => (technique + ' ' + (row?.technique || '')).toLowerCase().includes(t.toLowerCase())),
          url, source: file, slug,
        }
        entries.push(entry)
        pending.set(entry, tokens)
        sources.set(file, url)
      }
    }
  }
  for (const [entry, tokens] of pending) {
    let headingId = ''
    let heading = entry.title
    const slugger = new GithubSlugger()
    const toc: Article['toc'] = []
    for (let i = 0; i < tokens.length; i++) {
      const t = tokens[i]
      if (t.type !== 'heading_open') continue
      const title = plain(tokens[i + 1])
      const id = slugger.slug(title)
      t.attrSet('id', id)
      const level = Number(t.tag.slice(1))
      if (level === 1 && !headingId) {
        heading = title
        headingId = id
        // The page header renders the complete source heading.
        tokens.splice(i, 3)
        i--
        continue
      }
      if (level === 2 || level === 3) toc.push({ id, title, level })
    }
    const resolve = (url: string, image: boolean) => {
      if (/^(?:[a-z][\w+.-]*:|\/\/|#)/i.test(url) || !url) return url
      const [, pathname, suffix] = /^([^?#]*)(.*)$/.exec(url)!
      if (!pathname) return entry.url + suffix
      const file = path.posix.normalize(path.posix.join(pathname.startsWith('/') ? '' : path.posix.dirname(entry.source), decodeURIComponent(pathname))).replace(/^\/+/, '')
      if (file.startsWith('../') || !fs.existsSync(file)) throw new Error(entry.source + ' has a missing or invalid target: ' + url)
      if (image || /\.(?:png|jpe?g|gif|webp|avif|svg)$/i.test(file)) {
        if (!fs.realpathSync(file).startsWith(fs.realpathSync('.') + path.sep)) throw new Error('Image outside repository: ' + file)
        const dest = 'media/' + file
        images.set(dest, file)
        return base + encoded(dest) + suffix
      }
      if (sources.has(file)) return sources.get(file)! + suffix
      const directory = fs.statSync(file).isDirectory()
      if (directory && sources.has(path.posix.join(file, 'README.md'))) return sources.get(path.posix.join(file, 'README.md'))! + suffix
      return repository + (directory ? '/tree/main/' : '/blob/main/') + encoded(file) + suffix
    }
    const html = md.renderer.render(tokens, md.options, { resolve })
    articles.push({ ...entry, html, toc, heading, headingId: headingId || slugger.slug(heading) })
  }
  return { entries: entries.sort((a, b) => a.title.localeCompare(b.title, 'en')), articles, images }
}

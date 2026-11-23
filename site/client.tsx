import { fold } from './model'

const preference = matchMedia('(prefers-color-scheme: dark)')
const theme = document.querySelector<HTMLButtonElement>('#theme')!
function syncButton() {
  theme.setAttribute('aria-pressed', String(document.documentElement.dataset.theme === 'dark'))
}
syncButton()
theme.hidden = false
theme.addEventListener('click', () => {
  const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'
  document.documentElement.dataset.theme = next
  try { localStorage.setItem('writeups-theme', next) } catch {}
  syncButton()
})
preference.addEventListener('change', () => {
  try { if (localStorage.getItem('writeups-theme')) return } catch {}
  document.documentElement.dataset.theme = preference.matches ? 'dark' : 'light'
  syncButton()
})

const filters = document.querySelector<HTMLElement>('.filters')
if (filters) {
  const buttons = filters.querySelectorAll<HTMLButtonElement>('[data-filter]')
  const entries = [...document.querySelectorAll<HTMLElement>('[data-category]')].map(el => ({
    el, text: fold([el.textContent, el.dataset.category, el.dataset.search].join(' ')),
  }))
  const input = document.querySelector<HTMLInputElement>('#query')!
  const status = document.querySelector<HTMLElement>('#filter-status')!
  const empty = document.querySelector<HTMLElement>('#empty')!
  let selected = 'All'
  function update() {
    const words = fold(input.value.trim()).split(/\s+/)
    let count = 0
    for (const { el, text } of entries) {
      el.hidden = (selected !== 'All' && el.dataset.category !== selected) || !words.every(word => text.includes(word))
      if (!el.hidden) count++
    }
    for (const choice of buttons) choice.setAttribute('aria-pressed', String(choice.dataset.filter === selected))
    status.textContent = `Showing ${count} write-up${count === 1 ? '' : 's'}.`
    empty.hidden = count !== 0
  }
  for (const button of buttons) button.addEventListener('click', () => { selected = button.dataset.filter!; update() })
  input.addEventListener('input', update)
  document.querySelector('#reset')!.addEventListener('click', () => { selected = 'All'; input.value = ''; update(); input.focus() })
  input.closest('label')!.hidden = false
  filters.hidden = false
  update()
}

for (const button of document.querySelectorAll<HTMLButtonElement>('[data-copy]')) {
  const code = button.closest('.codeblock')?.querySelector('pre code')
  if (!code || !navigator.clipboard) continue
  button.hidden = false
  button.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(code.textContent ?? '')
      button.textContent = 'Copied'
    } catch { button.textContent = 'Select code to copy' }
    window.setTimeout(() => { button.textContent = 'Copy code' }, 1800)
  })
}

const space = document.querySelector<HTMLElement>('.meowverse')
if (space) void import('./space/flight').then(({ launch }) => launch(space))

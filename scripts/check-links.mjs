import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { load } from 'cheerio'

const base = '/writeups/'
const manifest = JSON.parse(fs.readFileSync('dist/manifest.json', 'utf8'))
const documents = new Map()
function document(file) {
  if (!documents.has(file)) documents.set(file, load(fs.readFileSync(file, 'utf8')))
  return documents.get(file)
}
function fileFor(url) {
  assert.ok(url.pathname.startsWith(base), 'Outside Pages base: ' + url)
  const file = path.join('dist', decodeURIComponent(url.pathname.slice(base.length)))
  return url.pathname.endsWith('/') ? path.join(file, 'index.html') : file
}
const origin = 'https://portfolio.invalid'
const home = document('dist/index.html')
const routes = manifest.map(entry => entry.url)
assert.ok(routes.length > 0, 'Empty archive')
assert.deepEqual(home('.entry').map((_, el) => home(el).attr('href')).get().sort(), [...routes].sort())
for (const entry of manifest) {
  assert.ok(fs.existsSync(entry.source), 'Missing README: ' + entry.source)
  const $ = document(fileFor(new URL(entry.url, origin)))
  assert.ok($('article.prose').length && $('.reader h1').text(), 'Missing reader: ' + entry.url)
}

for (const route of [base, ...routes, base + '404.html']) {
  const $ = document(fileFor(new URL(route, origin)))
  for (const el of $('[href], [src]')) {
    const url = new URL($(el).attr('href') ?? $(el).attr('src'), origin + route)
    if (url.origin !== origin) continue
    const file = fileFor(url)
    assert.ok(fs.existsSync(file), route + ' links to missing file ' + file)
    if (url.hash && file.endsWith('.html')) {
      const target = decodeURIComponent(url.hash.slice(1))
      assert.ok(document(file)('[id]').toArray().some(el => el.attribs.id === target), route + ' links to missing anchor ' + url.hash)
    }
  }
}
console.log(`Verified archive, ${routes.length} static readers, 404, local assets, and anchors under ${base}`)

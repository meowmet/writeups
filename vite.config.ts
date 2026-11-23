import fs from 'node:fs'
import path from 'node:path'
import { defineConfig, type Plugin } from 'vite'
import { createElement, type ReactElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { discover } from './scripts/content'
import { Portfolio } from './site/Portfolio'
import { Reader } from './site/Reader'
import { NotFound } from './site/NotFound'
import { base } from './site/model'

function pages() {
  const { entries, articles, images } = discover()
  const routes = new Map<string, { title: string; body: ReactElement }>([[base, { title: 'CTF write-ups', body: createElement(Portfolio, { entries }) }]])
  const missing = { title: '404 · Lost in the Meowverse', body: createElement(NotFound) }
  for (const article of articles) {
    if (routes.has(article.url)) throw new Error('Duplicate page: ' + article.url)
    routes.set(article.url, { title: article.title, body: createElement(Reader, { article }) })
  }
  routes.set(base + '404.html', missing)
  function render(template: string, url: string) {
    const page = routes.get(url) ?? missing
    const title = renderToStaticMarkup(createElement('title', null, page.title + ' · meowmet'))
    return template.replace(/<title>.*?<\/title>/, () => title)
      .replace('<!--page-body-->', () => renderToStaticMarkup(page.body))
  }
  return { entries, routes, images, render }
}

function staticPortfolio(): Plugin {
  return {
    name: 'static-writeups',
    generateBundle: {
      order: 'post',
      handler(_, bundle) {
        const index = bundle['index.html']
        if (index?.type !== 'asset') throw new Error('Missing Vite HTML template')
        const template = String(index.source)
        const site = pages()
        for (const url of site.routes.keys()) {
          const source = site.render(template, url)
          if (url === base) index.source = source
          else this.emitFile({ type: 'asset', fileName: decodeURIComponent(url.slice(base.length)) + (url.endsWith('/') ? 'index.html' : ''), source })
        }
        this.emitFile({ type: 'asset', fileName: 'manifest.json', source: JSON.stringify(site.entries, null, 2) })
        for (const [fileName, file] of site.images) this.emitFile({ type: 'asset', fileName, source: fs.readFileSync(file) })
      },
    },
    configureServer(server) {
      let cache: ReturnType<typeof pages> | undefined
      server.watcher.on('all', (_, file) => {
        if (/\.md$/i.test(file)) {
          cache = undefined
          server.ws.send({ type: 'full-reload' })
        }
      })
      server.middlewares.use(async (req, res, next) => {
        try {
          const pathname = (req.url ?? '').split('?')[0]
          if (!pathname.startsWith(base)) return next()
          const site = cache ??= pages()
          if (pathname === base + 'manifest.json') {
            res.setHeader('Content-Type', 'application/json')
            return res.end(JSON.stringify(site.entries))
          }
          const asset = site.images.get(decodeURIComponent(pathname.slice(base.length)))
          if (asset) { req.url = base + asset.split('/').map(encodeURIComponent).join('/'); return next() }
          const url = pathname.replace(/\/index\.html$/, '/')
          const route = site.routes.has(url) ? url : url + '/'
          if (!site.routes.has(route)) return next()
          const template = await server.transformIndexHtml('/index.html', fs.readFileSync('index.html', 'utf8'))
          res.setHeader('Content-Type', 'text/html; charset=utf-8')
          res.end(site.render(template, route))
        } catch (error) { next(error) }
      })
      return () => server.middlewares.use(async (req, res, next) => {
        if (!req.headers.accept?.includes('text/html')) return next()
        try {
          const template = await server.transformIndexHtml('/index.html', fs.readFileSync('index.html', 'utf8'))
          res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' })
          res.end((cache ??= pages()).render(template, base + '404.html'))
        } catch (error) { next(error) }
      })
    },
    configurePreviewServer(server) {
      const dist = path.resolve(server.config.root, server.config.build.outDir)
      return () => server.middlewares.use((req, res, next) => {
        // Vite rewrites directory requests to index.html before this hook.
        const name = decodeURIComponent((req.url ?? '/').split('?')[0])
        const file = path.resolve(dist, '.' + name)
        if (file.startsWith(dist + path.sep) && file.endsWith('.html') && fs.existsSync(file)) return next()
        if (file.startsWith(dist + path.sep) && fs.existsSync(path.join(file, 'index.html'))) {
          res.writeHead(308, { Location: base + name.slice(1) + '/' + (req.url?.match(/\?.*$/)?.[0] ?? '') })
          return res.end()
        }
        res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' })
        res.end(fs.readFileSync(path.join(dist, '404.html')))
      })
    },
  }
}

export default defineConfig({ base, appType: 'mpa', plugins: [staticPortfolio()] })

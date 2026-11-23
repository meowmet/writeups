import { base, type Article } from './model'
import { Shell } from './Shell'

export function Reader({ article }: { article: Article }) {
  return <Shell><main id="main" className="frame reader">
    <nav className="crumb" aria-label="Breadcrumb"><a href={base + '#archive'}>Archive</a><span aria-hidden="true">/</span><span>{article.category}</span></nav>
    <div className="reader-head"><p className="eyebrow">{article.event}</p><h1 id={article.headingId}>{article.heading}</h1></div>
    <div className="reader-layout">
      {article.toc.length > 0 && <aside className="contents"><details open><summary>On this page</summary><ol>{article.toc.map(h =>
        <li key={h.id} className={'level-' + h.level}><a href={'#' + h.id}>{h.title}</a></li>
      )}</ol></details></aside>}
      <article className="prose" aria-label={article.title} dangerouslySetInnerHTML={{__html: article.html}}/>
    </div>
    <a className="back-link" href={base + '#archive'}>Back to the archive</a>
  </main></Shell>
}

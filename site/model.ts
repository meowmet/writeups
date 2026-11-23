export const base = '/writeups/'
export const avatarUrl = 'https://avatars.githubusercontent.com/u/74294784'
export const repository = 'https://github.com/meowmet/writeups'

export interface Entry {
  title: string
  excerpt: string
  subtitle: string
  category: string
  event: string
  eventShort: string
  difficulty?: string
  tags: string[]
  url: string
  source: string
  slug: string
}
export interface Article extends Entry {
  headingId: string
  heading: string
  html: string
  toc: { id: string; title: string; level: number }[]
}
export const featuredSlugs = ['machine-matrix', 'signaldesk', 'backwards-block-party']
export function fold(value: string) {
  return value.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase()
}

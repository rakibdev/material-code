import { $ } from 'bun'
import { colors } from './config'
import { createRelease } from './github'

const tags = (await $`git tag -l --sort=-v:refname`.text()).split('\n').flatMap(tag => (tag ? tag.trim() : []))
const lastTag = tags[0]
const lastCommit = lastTag ? `${(await $`git rev-list -1 ${lastTag}`.text()).trim()}..HEAD` : 'HEAD'
const newCommits = (await $`git log --format=%s__%h ${lastCommit}`.text()).split('\n').flatMap(commit => {
  if (!commit) return []
  const [message, short_hash] = commit.split('__')
  return { message, short_hash }
})
if (!newCommits.length) {
  console.log(colors.red + `No new commits since tag ${lastTag}` + colors.reset)
  process.exit(1)
}

const getCommitsBulletedMarkdown = (prefixes: string[], prefix_emojis: string[]) => {
  const relevent = newCommits.filter(commit => prefixes.some(prefix => commit.message.startsWith(prefix)))
  relevent.sort((commit, commit2) => {
    const index = prefixes.findIndex(prefix => commit.message.startsWith(prefix))
    const index2 = prefixes.findIndex(prefix => commit2.message.startsWith(prefix))
    return index - index2
  })
  return relevent
    .map(commit => {
      const index = prefixes.findIndex(prefix => commit.message.startsWith(prefix))
      return `${commit.message.replace(`${prefixes[index]}:`, prefix_emojis[index])} ${commit.short_hash}`
    })
    .join('\n')
}

const features = getCommitsBulletedMarkdown(['feat'], ['✨'])
const improvements = getCommitsBulletedMarkdown(
  ['refactor!', 'refactor', 'perf', 'chore', 'docs', 'style'],
  ['♻️!', '♻️', '⚡', '🔧', '📄', '🌈']
)
const fixes = getCommitsBulletedMarkdown(['fix'], ['🐞'])

let releaseNotes: string[] | string = []
if (features.length) releaseNotes.push(`## New features\n${features}`)
if (improvements.length) releaseNotes.push(`## Improvements\n${improvements}`)
if (fixes.length) releaseNotes.push(`## Fixes\n${fixes}`)

const { name: extension_name, version, publisher } = await Bun.file('package.json').json()
releaseNotes.push(
  `[Install extension from marketplace](https://marketplace.visualstudio.com/items?itemName=${publisher}.${extension_name})`
)
releaseNotes = releaseNotes.join('\n\n')

await createRelease(version, releaseNotes)

import { spawnSync } from 'child_process'

const green = '\x1b[32m'
const red = '\x1b[31m'
const reset = '\x1b[0m'

const execute = command => {
  command = command.split(/\s+/)
  return spawnSync(command[0], command.slice(1), { encoding: 'utf8' }).stdout
}

const tags = execute('git tag -l --sort=-v:refname')
  .split('\n')
  .flatMap(tag => (tag ? tag.trim() : []))
const last_tag = tags[0]
const last_commit = last_tag ? `${execute(`git rev-list -1 ${last_tag}`).trim()}..HEAD` : 'HEAD'
const new_commits = execute(`git log --format=%s__%h ${last_commit}`)
  .split('\n')
  .flatMap(commit => {
    if (!commit) return []
    const [message, short_hash] = commit.split('__')
    return { message, short_hash }
  })
if (!new_commits.length) {
  console.log(red + `No new commits since tag ${last_tag}` + reset)
  process.exit(1)
}

const getCommitsBulletedMarkdown = (prefixes, prefix_emojis) => {
  const relevent = new_commits.filter(commit => prefixes.some(prefix => commit.message.startsWith(prefix)))
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

let release_notes = []
if (features.length) release_notes.push(`## New features\n${features}`)
if (improvements.length) release_notes.push(`## Improvements\n${improvements}`)
if (fixes.length) release_notes.push(`## Fixes\n${fixes}`)

const { name: extension_name, version, publisher } = await Bun.file('package.json').json()
release_notes.push(
  `[Install extension from marketplace](https://marketplace.visualstudio.com/items?itemName=${publisher}.${extension_name})`
)
release_notes = release_notes.join('\n\n')

execute(`git tag ${version}`)
execute(`git push origin ${version}`)

const origin = execute('git remote get-url origin').trim().split('/')
const repo = origin.pop().replace('.git', '')
const owner = origin.pop()
const auth_token = execute('git config --get user.password').trim()
const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/releases`, {
  method: 'POST',
  headers: {
    Authorization: `token ${auth_token}`,
    Accept: 'application/vnd.github.v3+json'
  },
  body: JSON.stringify({
    name: version,
    tag_name: version,
    body: release_notes
  })
})
if (response.ok) console.log(green + `Released v${version}.` + `\n\n${release_notes}` + reset)
else console.log(red + `Failed to create release v${version}.` + reset)

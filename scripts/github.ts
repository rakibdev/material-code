import { $ } from 'bun'
import { colors } from './config'

export const createRelease = async (tag: string, body: string) => {
  await $`git tag ${tag}`
  await $`git push origin ${tag}`

  const origin = (await $`git remote get-url origin`.text()).trim().split('/')
  const repo = origin.pop()!.replace('.git', '')
  const owner = origin.pop()
  const authToken = (await $`git config --get user.password`.text()).trim()
  const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/releases`, {
    method: 'POST',
    headers: {
      Authorization: `token ${authToken}`,
      Accept: 'application/vnd.github.v3+json'
    },
    body: JSON.stringify({
      name: tag,
      tag_name: tag,
      body: body
    })
  })
  if (response.ok) console.log(colors.green + `Released v${tag}.` + `\n\n${body}` + colors.reset)
  else {
    const { message } = await response.json()
    console.log(colors.red + `Unable to create release: ${message}` + colors.reset)
  }
}

import { mock } from 'bun:test'
import { join } from 'path'

const vscode = {
  Uri: {
    joinPath: (base: any, ...paths: string[]) => ({
      path: join(base.path, ...paths)
    }),
    file: (path: string) => ({ path })
  },
  extensions: {
    all: [],
    getExtension: (id: string) => ({
      extensionUri: { path: '/fake/extension' },
      packageJSON: {}
    })
  },
  workspace: {
    getConfiguration: (section: string) => ({
      get: (key: string) => undefined
    })
  }
}

mock.module('vscode', () => ({ ...vscode, default: vscode }))

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { solidPlugin } from 'esbuild-plugin-solid'
import { defineConfig } from 'tsup'
import type { Options } from 'tsup'

function generateConfig(format: 'esm' | 'cjs', jsx: boolean): Options {
  return {
    target: 'esnext',
    platform: 'browser',
    format,
    clean: true,
    dts: format === 'esm' && !jsx,
    entry: ['src/index.tsx', 'src/primitives/*/index.tsx'],
    outDir: 'dist/',
    treeshake: { preset: 'smallest' },
    replaceNodeEnv: true,
    esbuildOptions(options) {
      if (jsx) {
        options.jsx = 'preserve'
      }
      options.chunkNames = '[name]/[hash]'
      options.drop = ['console', 'debugger']
    },
    outExtension() {
      if (jsx) {
        return { js: '.jsx' }
      } else {
        return {}
      }
    },
    esbuildPlugins: !jsx ? [solidPlugin({ solid: { generate: 'dom' } })] : [],
  }
}

export default defineConfig([
  generateConfig('esm', false),
  generateConfig('esm', true),
])

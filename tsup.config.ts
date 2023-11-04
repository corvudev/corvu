// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { solidPlugin } from 'esbuild-plugin-solid'
import { defineConfig } from 'tsup'
import type { Options } from 'tsup'

function generateConfig(format: 'esm' | 'cjs', jsx: boolean): Options {
  return {
    target: 'esnext',
    platform: 'browser',
    format: format,
    clean: true,
    dts: format === 'esm' && !jsx,
    entry: { index: 'src/index.tsx' },
    outDir: 'dist/',
    treeshake: { preset: 'safest' },
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
  generateConfig('cjs', false),
  generateConfig('esm', true),
])

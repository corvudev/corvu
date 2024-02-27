import { defineConfig } from 'tsup'
import type { Options } from 'tsup'
// @ts-expect-error: esbuild-plugin-solid doesn't support NodeNext moduleResolution
// See: https://github.com/amoutonbrady/esbuild-plugin-solid/pull/7
import { solidPlugin } from 'esbuild-plugin-solid'

function generateConfig(format: 'esm' | 'cjs', jsx: boolean): Options {
  return {
    target: 'esnext',
    platform: 'browser',
    format,
    clean: true,
    dts: format === 'esm' && !jsx,
    entry: ['src/index.ts'],
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

export default defineConfig([generateConfig('esm', false)])

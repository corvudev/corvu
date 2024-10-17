import { defineConfig } from 'tsup'
import type { Options } from 'tsup'

function generateConfig(format: 'esm' | 'cjs'): Options {
  return {
    target: 'esnext',
    platform: 'browser',
    format,
    clean: true,
    dts: format === 'esm',
    entry: { index: 'src/index.ts' },
    outDir: 'dist/',
    treeshake: { preset: 'smallest' },
    replaceNodeEnv: true,
    esbuildOptions(options) {
      options.chunkNames = '[name]/[hash]'
      options.drop = ['console', 'debugger']
    },
  }
}

export default defineConfig([generateConfig('esm'), generateConfig('cjs')])

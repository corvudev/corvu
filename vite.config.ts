import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'
import tsConfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  root: './dev',
  plugins: [solid(), tsConfigPaths()],
})

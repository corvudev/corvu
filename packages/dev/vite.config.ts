import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'
import tsConfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [solid(), tsConfigPaths()],
})

import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { benchServer } from './server/reports.ts'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), benchServer('reports')],
  server: { watch: { ignored: ['**/reports/**'] } },
})

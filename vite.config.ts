import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    // The kanji.js chunk carries the whole KANJIDIC2 dictionary (~1.9 MB) and
    // is only loaded by the playground.
    chunkSizeWarningLimit: 2000
  }
})

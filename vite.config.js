

import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import React from '@vitejs/plugin-react'
export default defineConfig({
  plugins: [
    React(), tailwindcss(),
  ],
   server:{
    port:9280
  },
  
  optimizeDeps: {
    include: ['pdfjs-dist/build/pdf.worker.min.js'],
  },
})

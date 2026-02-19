import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ['react', 'react-dom', 'framer-motion'],
                    three: ['three', '@react-three/fiber', '@react-three/drei'],
                },
            },
        },
        chunkSizeWarningLimit: 1000,
    },
})

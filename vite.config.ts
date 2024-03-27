import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'


const baseURL = process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:7001';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue']
    },

    server: {
        port: 3000,
        proxy: {
            '/api': {
                target: 'http://127.0.0.1:7001', // setting host
                changeOrigin: true,
                rewrite: path => path.replace(/^\/api/, '')
            }
        }
    }
})

/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { join } from 'path';
import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import ViteFonts from 'vite-plugin-fonts';

/**
 * @see https://vitejs.dev/config/
 */
export default defineConfig({
    mode: process.env.NODE_ENV,
    root: __dirname,
    plugins: [
        react(),
        ViteFonts({
            google: {
              families: ['Source Sans Pro', {
                /**
                 * Family name (required)
                 */
                name: 'Roboto',
    
                /**
                 * Family styles
                 */
                styles: 'ital,wght@0,400;1,200',
            }],
            },
          }),
    ],
    base: './',
    build: {
        outDir: './dist',
        emptyOutDir: true,
        sourcemap: true,
    },
    resolve: {
        alias: {
            '@': join(__dirname, 'src'),
            '@src': join(__dirname, 'src'),
            '@components': join(__dirname, 'src/components'),
            '@pages': join(__dirname, 'src/pages'),
            '@services': join(__dirname, 'src/services'),
            '@config': join(__dirname, 'src/config'),
            '@utils': join(__dirname, 'src/utils'),
            '@store': join(__dirname, 'src/store'),
        },
    },
});

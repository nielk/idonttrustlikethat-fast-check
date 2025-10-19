// vite.config.ts
import { defineConfig } from 'vite';

import typescript from '@rollup/plugin-typescript';
import path from 'path';
import { typescriptPaths } from 'rollup-plugin-typescript-paths';
import { codecovVitePlugin } from '@codecov/vite-plugin';

import packageJson from './package.json';

export default defineConfig({
  plugins: [],
  resolve: {
    alias: [
      {
        find: '~',
        replacement: path.resolve(__dirname, './src'),
      },
    ],
  },
  server: {
    port: 3000,
  },
  build: {
    minify: true,
    reportCompressedSize: true,
    lib: {
      entry: path.resolve(__dirname, 'src/main.ts'),
      fileName: 'main',
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: ['fast-check', 'idonttrustlikethat'],
      plugins: [
        typescriptPaths({
          preserveExtensions: true,
        }),
        typescript({
          sourceMap: false,
          declaration: true,
          outDir: 'dist',
        }),
        codecovVitePlugin({
          enableBundleAnalysis: process.env.CODECOV_TOKEN !== undefined,
          bundleName: packageJson.name,
          uploadToken: process.env.CODECOV_TOKEN,
        }),
      ],
    },
  },
});

import { defineConfig, loadEnv } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import copy from "rollup-plugin-copy";
import * as path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    svelte(),
    copy({
      targets: [
        {
          src: "node_modules/@esri/calcite-components/dist/calcite/assets/",
          dest: "public/",
        },
      ],
    }),
  ],
  resolve: {
    alias: {
      $models: path.resolve('./src/models'),
      $store: path.resolve('./src/store'),
      $components: path.resolve('./src/components'),
      $lib: path.resolve('./src/lib')
    }
  }
});

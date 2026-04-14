const resolve = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const typescript = require('@rollup/plugin-typescript');
const peerDepsExternal = require('rollup-plugin-peer-deps-external');
const postcss = require('rollup-plugin-postcss');
const dts = require('rollup-plugin-dts');

const packageJson = require('./package.json');

module.exports = [
  // Build principal (CJS + ESM)
  {
    input: 'src/index.ts',
    output: [
      {
        file: packageJson.main,
        format: 'cjs',
        sourcemap: true,
        exports: 'named',
      },
      {
        file: packageJson.module,
        format: 'esm',
        sourcemap: true,
      },
    ],
    plugins: [
      peerDepsExternal(),
      resolve(),
      commonjs(),
      typescript({ 
        tsconfig: './tsconfig.json',
        exclude: ['**/*.test.ts'],
      }),
      postcss({
        extract: true,
        minimize: true,
      }),
    ],
    external: ['react', 'react-dom', 'html2canvas', 'uuid'],
  },
  // Type definitions (já gerados pelo TypeScript, só copiamos o principal)
  // Os arquivos .d.ts são gerados pelo @rollup/plugin-typescript em dist/
];

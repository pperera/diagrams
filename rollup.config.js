import typescript from "rollup-plugin-typescript2";
import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import globals from "rollup-plugin-node-globals";
import json from "rollup-plugin-json";
import { terser } from "rollup-plugin-terser";
import replace from "rollup-plugin-replace";
import { string } from "rollup-plugin-string";
import scss from "rollup-plugin-scss";

const PROD = process.env.BUILD === "production";

console.log(`production: ${PROD}`);

const plugins = [
  typescript({
    verbosity: 2,
    clean: true,
  }),
  replace({
    "process.env.NODE_ENV": JSON.stringify(PROD ? "production" : "development"),
  }),
  resolve({
    browser: true,
    preferBuiltins: false,
  }),
  string({
    include: "public/bin/ww-shell.js",
  }),
  commonjs({
    ignoreGlobal: true,
    include: [/node_modules/],
    namedExports: {
      react: [
        "Children",
        "Component",
        "PropTypes",
        "createElement",
        "useEffect",
        "useState",
        "useRef",
        "useContext",
        "useMemo",
        "useDebugValue",
        "useCallback",
        "useLayoutEffect",
        "PureComponent",
        "createContext",
      ],
      "prop-types": [
        "object",
        "func",
        "oneOfType",
        "node",
        "bool",
        "any",
        "arrayOf",
        "string",
      ],
      "react-dom": ["render", "createPortal"],
      "react-is": ["isValidElementType", "isElement", "typeOf"],
      "@monaco-editor/react": ["monaco"],
    },
  }),

  PROD && terser({}),
  globals({}),
  json(),
  scss(),
];

const banner = `/*! Menduz diagrams */
const buildInformation = ${JSON.stringify(
  {
    date: new Date().toISOString(),
    commit: process.env.GITHUB_SHA || "HEAD",
    ref: process.env.GITHUB_REF || "?",
  },
  null,
  2
)};`;

export default {
  input: "./src/index.ts",
  context: "document",
  plugins,
  output: [
    {
      file: "./docs/index.js",
      format: "iife",
      name: "Arduz",
      sourcemap: !PROD,
      banner,
    },
  ],
  external: ["buildInformation"],
};

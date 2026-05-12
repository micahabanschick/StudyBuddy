import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'
import prettier from 'eslint-config-prettier/flat'

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  prettier,
  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'coverage/**',
    'next-env.d.ts',
    'node_modules/**',
    'prisma/migrations/**',
  ]),
  // Editor extensions and the note editor use unavoidable `any` types when
  // interfacing with Tiptap's internal ProseMirror APIs and tiptap-markdown.
  {
    files: ['components/editor/**/*.tsx', 'components/editor/**/*.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
  {
    files: ['components/editor/note-editor.tsx'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
])

export default eslintConfig

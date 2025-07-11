import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['test/**/*.test.ts'],
    setupFiles: ['vitest.setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'cobertura'],
      all: true,
      exclude: [
        'esbuild.config.mjs',
        'dist/**',
        'src/main.ts',
        'version-bump.mjs',
        'vitest.config.ts',
        'src/SettingTab.ts',
        'styles.css',
      ],
    },
    reporters: ['default', 'junit'],
    outputFile: {
      junit: 'coverage/junit.xml',
    },
  },
});

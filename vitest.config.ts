import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html', 'lcov'],
            exclude: [
                'node_modules/',
                'dist/',
                '**/*.spec.ts',
                '**/*.test.ts',
                '**/*.config.ts',
                '**/index.ts', // 仅导出文件
            ],
            include: ['src/**/*.ts'],
            thresholds: {
                lines: 70,
                functions: 70,
                branches: 50,
                statements: 70,
            },
        },
    },
});

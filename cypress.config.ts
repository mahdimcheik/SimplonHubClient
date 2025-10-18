import { defineConfig } from 'cypress';

export default defineConfig({
    e2e: {
        baseUrl: 'https://localhost:4201',
        setupNodeEvents(on, config) {}
    }
});

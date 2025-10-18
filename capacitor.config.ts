import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
    appId: 'com.skillhive.app',
    appName: 'Skill Hive',
    webDir: 'dist/skill-hive/browser',
    server: {
        androidScheme: 'https'
    },
    android: {
        allowMixedContent: true
    }
};

export default config;

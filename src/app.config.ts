import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, LOCALE_ID } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter, withEnabledBlockingInitialNavigation, withInMemoryScrolling } from '@angular/router';
import Aura from '@primeng/themes/aura';
import { providePrimeNG } from 'primeng/config';
import { definePreset } from '@primeng/themes';
import { appRoutes } from './app.routes';
import { TokenInterceptor } from './app/shared/interceptors/token.interceptor';
import { errorHandlerInterceptor } from './app/shared/interceptors/error-handler.interceptor';
import { MessageService } from 'primeng/api';
import { cookiesInterceptor } from './app/shared/interceptors/cookies.interceptor';
import { loaderInterceptor } from './app/shared/interceptors/loader.interceptor';
import { exceptionLoaderInterceptor } from './app/shared/interceptors/exception-loader.interceptor';
import { provideDefaultClient } from './api/providers';
import { environment } from './environments/environment';

// Custom theme preset - Change the primary color here
const CustomPreset = definePreset(Aura, {
    semantic: {
        primary: {
            50: '{orange.50}',
            100: '{orange.100}',
            200: '{orange.200}',
            300: '{orange.300}',
            400: '{orange.400}',
            500: '{orange.500}',
            // 500: '#CE0033',
            600: '{orange.600}',
            700: '{orange.700}',
            800: '{orange.800}',
            900: '{orange.900}',
            950: '{orange.950}'
        }
    }
});

export const appConfig: ApplicationConfig = {
    providers: [
        provideDefaultClient({ basePath: environment.API_URL }),
        provideRouter(appRoutes, withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' }), withEnabledBlockingInitialNavigation()),
        provideHttpClient(withInterceptors([TokenInterceptor, cookiesInterceptor, errorHandlerInterceptor, exceptionLoaderInterceptor, loaderInterceptor])),
        MessageService,
        { provide: LOCALE_ID, useValue: 'fr-FR' },
        provideAnimationsAsync(),
        providePrimeNG({
            theme: {
                preset: CustomPreset,
                options: {
                    darkModeSelector: '.app-dark'
                }
            }
        })
    ]
};

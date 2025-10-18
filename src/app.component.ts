import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { LocalstorageService } from './app/shared/services/localstorage.service';
import { UserMainService } from './app/shared/services/userMain.service';
import { LayoutService } from './app/layout/service/layout.service';
import { ProgressBarModule } from 'primeng/progressbar';

import { OverlaySpinnerComponent } from './app/pages/landing/components/overlay-spinner/overlay-spinner.component';
import { CookieConsentBannerComponent } from './app/shared/components/cookie-consent-banner/cookie-consent-banner.component';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterModule, ToastModule, ProgressBarModule, OverlaySpinnerComponent, CookieConsentBannerComponent],
    template: `
        <app-overlay-spinner></app-overlay-spinner>
        <p-toast></p-toast>
        <router-outlet></router-outlet>
        <app-cookie-consent-banner></app-cookie-consent-banner>
    `
})
export class AppComponent {
    localStorageService = inject(LocalstorageService);
    authService = inject(UserMainService);
    layoutService = inject(LayoutService);
    router = inject(Router);
}

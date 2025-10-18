import { Component, inject, signal } from '@angular/core';

import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CookieConsentService, CookieConsentSettings } from '../../services/cookie-consent.service';

@Component({
    selector: 'app-cookie-consent-banner',
    standalone: true,
    imports: [ButtonModule, DialogModule, CheckboxModule, FormsModule, RouterModule],
    templateUrl: './cookie-consent-banner.component.html',
    styleUrl: './cookie-consent-banner.component.scss'
})
export class CookieConsentBannerComponent {
    private cookieConsentService = inject(CookieConsentService);

    // Signals from the service
    showBanner = this.cookieConsentService.showConsentBanner;

    // Local state for the detailed settings dialog
    showDetailsDialog = signal<boolean>(false);

    // Local state for custom consent settings
    customSettings = signal<CookieConsentSettings>({
        essential: true
    });

    //default value for the checkbox
    checked = true;

    constructor() {
        // Initialize custom settings with current consent settings
        this.customSettings.set({ ...this.cookieConsentService.consentSettings() });
    }

    /**
     * Accept all cookies
     */
    acceptAll(): void {
        this.cookieConsentService.acceptAll();
    }

    /**
     * Show the detailed settings dialog
     */
    showSettings(): void {
        this.customSettings.set({ ...this.cookieConsentService.consentSettings() });
        this.showDetailsDialog.set(true);
    }

    /**
     * Save custom consent settings
     */
    saveCustomSettings(): void {
        this.acceptAll();
        this.showDetailsDialog.set(false);
    }

    /**
     * Cancel custom settings dialog
     */
    cancelSettings(): void {
        this.showDetailsDialog.set(false);
        this.customSettings.set({ ...this.cookieConsentService.consentSettings() });
    }

    /**
     * Update functional cookies setting
     */
    updateFunctional(enabled: boolean): void {
        this.customSettings.update((current) => ({
            ...current,
            functional: enabled
        }));
    }

    /**
     * Update analytics cookies setting
     */
    updateAnalytics(enabled: boolean): void {
        this.customSettings.update((current) => ({
            ...current,
            analytics: enabled
        }));
    }

    /**
     * Update marketing cookies setting
     */
    updateMarketing(enabled: boolean): void {
        this.customSettings.update((current) => ({
            ...current,
            marketing: enabled
        }));
    }
}

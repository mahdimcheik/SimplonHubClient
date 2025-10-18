import { Injectable, signal, effect } from '@angular/core';

export interface CookieConsentSettings {
    essential: boolean;
}
/**
 * Service pour gérer le consentement aux cookies conformément au RGPD.
 * Utilise des signaux pour suivre l'état du consentement et les paramètres.
 * Stocke les décisions de consentement dans le localStorage avec une date d'expiration.
 */
export interface ConsentDecision {
    timestamp: Date;
    version: string;
    settings: CookieConsentSettings;
    userAgent: string;
    ipHash?: string;
}

@Injectable({
    providedIn: 'root'
})
export class CookieConsentService {
    private readonly CONSENT_KEY = 'gdpr-cookie-consent';
    private readonly CONSENT_VERSION = '1.0';
    private readonly CONSENT_EXPIRY_DAYS = 365;

    // Signal to track if user has made a consent decision
    hasConsented = signal<boolean>(false);

    // Signal to track current consent settings
    consentSettings = signal<CookieConsentSettings>({
        essential: true
    });

    // Signal to control banner visibility
    showConsentBanner = signal<boolean>(false);

    constructor() {
        this.loadStoredConsent();

        // Effect to save consent whenever settings change
        effect(() => {
            if (this.hasConsented()) {
                this.saveConsent();
            }
        });
    }

    /**
     * Check if user has given valid consent
     */
    private loadStoredConsent(): void {
        try {
            const stored = localStorage.getItem(this.CONSENT_KEY);
            if (stored) {
                const consent: ConsentDecision = JSON.parse(stored);

                // Check if consent is still valid (not expired and same version)
                const consentDate = new Date(consent.timestamp);
                const expiryDate = new Date();
                expiryDate.setDate(expiryDate.getDate() - this.CONSENT_EXPIRY_DAYS);

                if (consentDate > expiryDate && consent.version === this.CONSENT_VERSION) {
                    this.hasConsented.set(true);
                    this.consentSettings.set(consent.settings);
                    this.showConsentBanner.set(false);
                    return;
                }
            }
        } catch (error) {
            console.warn('Error loading cookie consent:', error);
        }

        // No valid consent found, show banner
        this.showConsentBanner.set(true);
    }

    /**
     * Save user consent decision
     */
    private saveConsent(): void {
        const decision: ConsentDecision = {
            timestamp: new Date(),
            version: this.CONSENT_VERSION,
            settings: this.consentSettings(),
            userAgent: navigator.userAgent
        };

        try {
            localStorage.setItem(this.CONSENT_KEY, JSON.stringify(decision));
        } catch (error) {
            console.error('Error saving cookie consent:', error);
        }
    }

    /**
     * Accept all cookies
     */
    acceptAll(): void {
        this.consentSettings.set({
            essential: true
        });
        this.hasConsented.set(true);
        this.showConsentBanner.set(false);
    }

    /**
     * Withdraw consent (reset to default state)
     */
    withdrawConsent(): void {
        localStorage.removeItem(this.CONSENT_KEY);
        this.hasConsented.set(false);
        this.consentSettings.set({
            essential: true
        });
        this.showConsentBanner.set(true);
    }

    /**
     * Check if specific cookie category is allowed
     */
    isAllowed(category: keyof CookieConsentSettings): boolean {
        return this.consentSettings()[category];
    }

    /**
     * Get consent history for audit purposes
     */
    getConsentHistory(): ConsentDecision | null {
        try {
            const stored = localStorage.getItem(this.CONSENT_KEY);
            return stored ? JSON.parse(stored) : null;
        } catch {
            return null;
        }
    }

    /**
     * Show consent banner again (for testing or settings page)
     */
    showBanner(): void {
        this.showConsentBanner.set(true);
    }

    /**
     * Check if consent needs renewal (approaching expiry)
     */
    needsRenewal(): boolean {
        const consent = this.getConsentHistory();
        if (!consent) return true;

        const consentDate = new Date(consent.timestamp);
        const renewalDate = new Date();
        renewalDate.setDate(renewalDate.getDate() - (this.CONSENT_EXPIRY_DAYS - 30)); // 30 days before expiry

        return consentDate < renewalDate;
    }
}

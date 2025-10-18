import { Injectable, signal, computed } from '@angular/core';
import { LocalstorageService } from '../../shared/services/localstorage.service';

export interface layoutConfig {
    darkTheme?: boolean;
    menuMode?: string;
}

@Injectable({
    providedIn: 'root'
})
export class LayoutService {
    private localStorageService = new LocalstorageService();

    // Core configuration
    layoutConfig = signal<layoutConfig>({
        darkTheme: false,
        menuMode: 'static'
    });

    // Menu state
    isSidebarActive = signal(false);
    isMenuMobileActive = signal(false);
    isMenuDesktopInactive = signal(false);
    isDesktop = signal(window.innerWidth > 991);

    // Computed properties
    isDarkTheme = computed(() => this.layoutConfig().darkTheme ?? false);
    isOverlay = computed(() => this.layoutConfig().menuMode === 'overlay');

    constructor() {
        window.addEventListener('resize', () => {
            this.isDesktop.set(window.innerWidth > 991);
        });
        // Load saved configuration from localStorage
        const savedConfig = this.localStorageService.getLayoutConfig();
        if (savedConfig && Object.keys(savedConfig).length > 0) {
            this.layoutConfig.set(savedConfig);
        }

        // Apply dark mode on initialization
        this.applyDarkMode();
    }

    // Dark mode methods
    toggleDarkMode(): void {
        const currentConfig = this.layoutConfig();
        const newDarkTheme = !currentConfig.darkTheme;

        this.layoutConfig.update((config) => ({ ...config, darkTheme: newDarkTheme }));
        this.applyDarkMode();
        this.saveConfig();
    }

    applyDarkMode(): void {
        if (this.isDarkTheme()) {
            document.documentElement.classList.add('app-dark');
        } else {
            document.documentElement.classList.remove('app-dark');
        }
    }

    // Menu mode methods
    setMenuMode(mode: 'static' | 'overlay'): void {
        this.layoutConfig.update((config) => ({ ...config, menuMode: mode }));
        this.saveConfig();
    }

    // Menu toggle methods
    toggleSidebar(): void {
        if (this.isOverlay()) {
            this.isSidebarActive.update((active) => !active);
        } else {
            if (this.isDesktop()) {
                this.isMenuDesktopInactive.update((inactive) => !inactive);
            } else {
                this.isMenuMobileActive.update((active) => !active);
            }
        }
    }

    closeSidebar(): void {
        this.isSidebarActive.set(false);
        this.isMenuMobileActive.set(false);
    }

    // // Utility methods
    // isDesktop(): boolean {
    //     return window.innerWidth > 991;
    // }

    isMobile(): boolean {
        return !this.isDesktop();
    }

    // Configuration persistence
    saveConfig(): void {
        this.localStorageService.setLayoutConfig(this.layoutConfig());
    }
}

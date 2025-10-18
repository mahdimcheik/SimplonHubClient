import { isPlatformBrowser } from '@angular/common';
import { Component, computed, inject, PLATFORM_ID, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SelectButtonModule } from 'primeng/selectbutton';
import { LayoutService } from '../service/layout.service';

@Component({
    selector: 'app-configurator',
    standalone: true,
    imports: [FormsModule, SelectButtonModule],
    template: `
        <div class="flex flex-col gap-4">
            <!-- Dark Mode Toggle -->
            <div class="flex flex-col gap-2 border-2 border-indigo-200 rounded-lg p-4">
                <span class="text-lg text-muted-color font-bold">Mode sombre</span>
                <p-selectbutton [ngModel]="isDarkTheme()" (ngModelChange)="onDarkModeChange($event)" [options]="darkModeOptions" [allowEmpty]="false" size="small" />
            </div>
        </div>
    `
})
export class AppConfigurator {
    router = inject(Router);
    layoutService: LayoutService = inject(LayoutService);
    platformId = inject(PLATFORM_ID);

    showMenuModeButton = signal(!this.router.url.includes('auth'));

    darkModeOptions = [
        { label: 'Clair', value: false },
        { label: 'Sombre', value: true }
    ];

    menuModeOptions = [
        { label: 'Static', value: 'static' },
        { label: 'Overlay', value: 'overlay' }
    ];

    isDarkTheme = computed(() => this.layoutService.isDarkTheme());
    menuMode = computed(() => this.layoutService.layoutConfig().menuMode);

    onDarkModeChange(isDark: boolean) {
        this.layoutService.toggleDarkMode();
    }

    onMenuModeChange(menuMode: string) {
        this.layoutService.setMenuMode(menuMode as 'static' | 'overlay');
    }
}

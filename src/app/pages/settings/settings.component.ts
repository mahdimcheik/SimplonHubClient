import { Component, computed, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { StyleClassModule } from 'primeng/styleclass';
import { LayoutService } from '../../layout/service/layout.service';
import { AppConfigurator } from '../../layout/component/app.configurator';

import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-settings',
    imports: [AppConfigurator, StyleClassModule, ButtonModule, FormsModule],
    templateUrl: './settings.component.html',
    styleUrl: './settings.component.scss'
})
export class SettingsComponent {
    layoutService = inject(LayoutService);
    isDarkTheme = computed(() => this.layoutService.layoutConfig().darkTheme);

    toggleDarkMode() {
        this.layoutService.layoutConfig.update((state) => ({ ...state, darkTheme: !state.darkTheme }));
    }
}

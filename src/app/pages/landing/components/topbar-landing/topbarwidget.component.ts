import { Component, inject, signal, ViewChild } from '@angular/core';
import { StyleClassModule } from 'primeng/styleclass';
import { Router, RouterModule } from '@angular/router';
import { RippleModule } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';
import { LayoutService } from '../../../../layout/service/layout.service';
import { UserMainService } from '../../../../shared/services/userMain.service';

import { LocalstorageService } from '../../../../shared/services/localstorage.service';
import { AvatarModule } from 'primeng/avatar';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { Menu } from 'primeng/menu';
import { TooltipModule } from 'primeng/tooltip';

@Component({
    selector: 'topbar-widget',
    imports: [RouterModule, StyleClassModule, ButtonModule, RippleModule, AvatarModule, MenuModule, TooltipModule],
    templateUrl: './app.topbar-landing.html'
})
export class TopbarWidget {
    @ViewChild('menu') menu!: Menu;

    layoutService = inject(LayoutService);
    authService = inject(UserMainService);
    localStorageService = inject(LocalstorageService);
    router = inject(Router);

    menuItems: MenuItem[] = [
        {
            label: 'Profil',
            icon: 'pi pi-user',
            command: () => {
                this.goToProfile();
            }
        },
        {
            separator: true
        },
        {
            label: 'Déconnexion',
            icon: 'pi pi-sign-out',
            command: () => {
                this.logout();
            }
        }
    ];

    toggleDarkMode() {
        this.layoutService.toggleDarkMode();
    }

    toggleMenu(event: Event) {
        this.menu.toggle(event);
    }

    goToProfile() {
        this.router.navigate(['/profile/me']);
    }

    logout() {
        // this.authService.logout();
        this.router.navigate(['/auth/login']);
    }
}

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
import { CommonModule } from '@angular/common';
import { DrawerModule } from 'primeng/drawer';
import { BaseSideModalComponent } from '../../../../generic-components/base-side-modal/base-side-modal.component';
import { MenubarModule } from 'primeng/menubar';
import { Divider } from 'primeng/divider';

@Component({
    selector: 'topbar-widget',
    imports: [RouterModule, StyleClassModule, ButtonModule, RippleModule, CommonModule, AvatarModule, MenuModule, TooltipModule, DrawerModule, StyleClassModule, AvatarModule, MenuModule, MenubarModule, Divider],
    templateUrl: './app.topbar-landing.html'
})
export class TopbarWidget {
    @ViewChild('menu') menu!: Menu;

    layoutService = inject(LayoutService);
    authService = inject(UserMainService);
    localStorageService = inject(LocalstorageService);
    router = inject(Router);

    mobileMenuVisible = signal(false);

    menuItems = this.authService.landingNavItems;

    authItems = this.authService.authNavItems;

    toggleDarkMode() {
        this.layoutService.toggleDarkMode();
    }

    toggleMobileMenu() {
        this.mobileMenuVisible.update((v) => !v);
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

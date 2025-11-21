import { Component, inject, signal, ViewChild } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { StyleClassModule } from 'primeng/styleclass';
import { LayoutService } from '../../../../layout/service/layout.service';
import { UserMainService } from '../../../../shared/services/userMain.service';

import { CommonModule } from '@angular/common';
import { MenuItem } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { Divider } from 'primeng/divider';
import { DrawerModule } from 'primeng/drawer';
import { Menu, MenuModule } from 'primeng/menu';
import { MenubarModule } from 'primeng/menubar';
import { TooltipModule } from 'primeng/tooltip';
import { LocalstorageService } from '../../../../shared/services/localstorage.service';

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

    excuteCommand(item: MenuItem) {
        if (item.command) {
            item.command({});
        }
    }
}

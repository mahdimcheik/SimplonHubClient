import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { UserMainService } from '../../../shared/services/userMain.service';
import { LayoutService } from '../../service/layout.service';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, RouterModule, ButtonModule],
    templateUrl: './app.menu.html'
})
export class AppMenu {
    router = inject(Router);
    authService = inject(UserMainService);
    sideNavItems = this.authService.sideNavItems;
    layoutService = inject(LayoutService);

    isAdmin = this.authService.isAdmin();
    isSuperAdmin = this.authService.isSuperAdmin();
    isTeacher = this.authService.isTeacher();
    isStudent = this.authService.isStudent();

    deconnecionItem = {
        label: 'Déconnexion',
        icon: 'pi pi-fw pi-sign-out'
    };
    settingsItem = {
        label: 'Paramètres',
        icon: 'pi pi-cog'
    };

    deconnect() {
        this.authService.logout();
    }
}

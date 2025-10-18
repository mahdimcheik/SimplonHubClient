import { Component, computed, inject } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StyleClassModule } from 'primeng/styleclass';
import { LayoutService } from '../../service/layout.service';
import { UserMainService } from '../../../shared/services/userMain.service';
import { AvatarModule } from 'primeng/avatar';
import { MenuModule } from 'primeng/menu';
import { MenubarModule } from 'primeng/menubar';
import { TagModule } from 'primeng/tag';
import { BadgeModule } from 'primeng/badge';
import { LocalstorageService } from '../../../shared/services/localstorage.service';

@Component({
    selector: 'app-topbar',
    standalone: true,
    imports: [RouterModule, CommonModule, StyleClassModule, AvatarModule, MenuModule, MenubarModule, TagModule, BadgeModule],
    templateUrl: './app.topbar.html'
})
export class AppTopbar {
    items!: MenuItem[];
    authService = inject(UserMainService);
    layoutService = inject(LayoutService);
    localStorageService = inject(LocalstorageService);
    router = inject(Router);

    user = this.authService.userConnected;
    isAdmin = this.authService.isAdmin();
    isSuperAdmin = this.authService.isSuperAdmin();
    isTeacher = this.authService.isTeacher();
    isStudent = this.authService.isStudent();

    userItems = computed(() => {
        if (this.user().email) {
            return [
                {
                    label: `${this.user().firstName} ${this.user().lastName}`,
                    icon: 'pi pi-user',
                    command: () => this.router.navigate(['profile'])
                },
                {
                    label: 'Déconnexion',
                    icon: 'pi pi-star',
                    command: () => (this.authService as any).logout()
                }
            ];
        } else {
            return [
                {
                    label: 'Connexion',
                    icon: 'pi pi-home',
                    command: () => this.router.navigate(['auth/login'])
                },
                {
                    label: 'Inscription',
                    icon: 'pi pi-star',
                    command: () => this.router.navigate(['auth/inscription'])
                }
            ];
        }
    });

    calendarLink = computed(() => {
        if (this.user().email) {
            if (this.user()?.roles) {
                if (this.isAdmin) {
                    return '/dashboard/reservation/calendar-for-teacher';
                } else {
                    return '/dashboard/reservation/calendar-for-student';
                }
            }
            return '/dashboard/reservation/calendar-for-student';
        }
        return '';
    });

    toggleDarkMode() {
        this.layoutService.toggleDarkMode();
    }
}

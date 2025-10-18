import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { UserMainService } from '../services/userMain.service';
import { firstValueFrom } from 'rxjs';
/***
 * Guard qui empêche l'accès à une route si l'utilisateur est connecté.
 * Si l'utilisateur n'est pas connecté, il peut accéder à la route.
 * Utilisation : { path: 'login', canActivate: [canNotLoginGuard], component: LoginComponent }
 */
export const canNotLoginGuard: CanActivateFn = async (route, state) => {
    const authService = inject(UserMainService);
    if (authService.userConnected().email) {
        return false;
    } else {
        try {
            await firstValueFrom(authService.refreshToken());
            if (authService.userConnected().email) {
                return false;
            } else {
                return true;
            }
        } catch {
            return true;
        }
    }
};

export const canNotRegisterGuard: CanActivateFn = async (route, state) => {
    const authService = inject(UserMainService);
    if (authService.userConnected().email) return false;
    else {
        try {
            await firstValueFrom(authService.refreshToken());
            if (authService.userConnected().email) {
                return false;
            } else {
                return true;
            }
        } catch {
            return true;
        }
    }
};

export const isConnectedGuard: CanActivateFn = async (route, state) => {
    const authService = inject(UserMainService);
    // Check if the user is connected , dans la mémoire
    if (authService.userConnected().email) {
        return true;
    }

    try {
        await firstValueFrom(authService.refreshToken());
        if (authService.userConnected().email) {
            return true;
        }
        return false;
    } catch {
        return false;
    }
};

export const isNotConnectedGuard: CanActivateFn = async (route, state) => {
    const authService = inject(UserMainService);
    // Check if the user is connected , dans la mémoire
    if (authService.userConnected().email) {
        return false;
    }
    try {
        await firstValueFrom(authService.refreshToken());
        if (authService.userConnected().email) {
            return false;
        }
        return true;
    } catch {
        return true;
    }
};

import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { UserMainService } from '../services/userMain.service';
import { firstValueFrom } from 'rxjs';

export const isAdminOnlyGuard: CanActivateFn = async (route, state) => {
    var auth = inject(UserMainService);
    if (auth.userConnected().email) {
        if (auth.userConnected().roles?.includes('Admin')) {
            return true;
        } else {
            return false;
        }
    }
    return false;
};

export const isTeacherOnlyGuard: CanActivateFn = async (route, state) => {
    var auth = inject(UserMainService);
    if (auth.userConnected().email) {
        if (auth.userConnected().roles?.includes('Teacher')) {
            return true;
        } else {
            return false;
        }
    }
    return false;
};

export const isStudentOnlyGuard: CanActivateFn = async (route, state) => {
    var auth = inject(UserMainService);
    if ((auth as any).userConnected().email) {
        if ((auth as any).userConnected().roles.includes('Student')) {
            return true;
        } else {
            return false;
        }
    }

    return false;
};

import { inject, Pipe, PipeTransform } from '@angular/core';
import { EnumNotificationType } from '../../api';
import { UserMainService } from '../services/userMain.service';
/**
 * Pipe qui transforme un type de notification en URL de redirection.
 * Utilisation : {{ notificationType | notificationUrl }}
 */
@Pipe({
    name: 'notificationUrl'
})
export class NotificationUrlPipe implements PipeTransform {
    transform(value: EnumNotificationType, ...args: unknown[]): string {
        switch (true) {
            case value >= 0 && value <= 9:
                return '/dashboard/profile/me';
            case value >= 10 && value <= 19:
                return '/dashboard/reservation/list';
            case value >= 20 && value <= 29:
                return `/dashboard/reservation/orders-student`;
            default:
                return '/dashboard';
        }
    }
}

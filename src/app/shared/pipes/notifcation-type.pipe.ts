import { Pipe, PipeTransform } from '@angular/core';
/**
 * Pipe qui transforme un numéro de type de notification en icône.
 * Utilisation : {{ notificationTypeNumber | notifcationType }}
 */
@Pipe({
    name: 'notifcationType'
})
export class NotifcationTypePipe implements PipeTransform {
    transform(type: number): string {
        switch (true) {
            case type < 10 && type >= 0:
                return 'pi-undo';
            case type < 20 && type >= 10:
                return 'pi-euro';
            case type < 30 && type >= 20:
                return 'pi-dollar';
            default:
                return 'Non défini';
        }
    }
}

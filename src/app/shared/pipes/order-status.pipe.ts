import { Pipe, PipeTransform } from '@angular/core';
import { EnumBookingStatus } from '../../api/models/EnumBookingStatus';
/**
 * Pipe qui transforme un statut de commande en chaîne de caractères.
 * Utilisation : {{ orderStatus | orderStatus }}
 */
@Pipe({
    name: 'orderStatus'
})
export class OrderStatusPipe implements PipeTransform {
    transform(status: EnumBookingStatus): string {
        switch (status) {
            case EnumBookingStatus._0:
                return 'En attente';
            case EnumBookingStatus._1:
                return 'Payé';
            case EnumBookingStatus._2:
                return 'Annulé';
            default:
                return 'Non défini';
        }
    }
}

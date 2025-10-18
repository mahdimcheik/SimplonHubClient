import { Pipe, PipeTransform } from '@angular/core';
import { AddressTypeEnum } from '../../api/models/AddressTypeEnum';
// import { AddressTypeEnum } from '../models/adresse';

/**
 * Pipe qui transforme un code de type d'adresse en une chaîne lisible.
 * Elle s'appuie sur l'énumération AddressTypeEnum pour effectuer la conversion.
 */
@Pipe({
    name: 'adresseType'
})
export class AdresseTypePipe implements PipeTransform {
    transform(adresseTypeNumber: number): string {
        switch (adresseTypeNumber) {
            case AddressTypeEnum._1:
                return 'Domicile';
            case AddressTypeEnum._2:
                return 'Travail';
            case AddressTypeEnum._3:
                return 'Facturation';
            case AddressTypeEnum._4:
                return 'Livraison';
            default:
                return 'Non défini';
        }
    }
}

@Pipe({
    name: 'adresseImage'
})
export class AdresseImagePipe implements PipeTransform {
    transform(adresseTypeNumber: number): string {
        switch (adresseTypeNumber) {
            case AddressTypeEnum._1:
                return 'pi-home';
            case AddressTypeEnum._2:
                return 'pi-briefcase';
            case AddressTypeEnum._3:
                return 'pi-file';
            case AddressTypeEnum._4:
                return 'pi-send';
            default:
                return 'Non défini';
        }
    }
}

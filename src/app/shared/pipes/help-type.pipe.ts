import { Pipe, PipeTransform } from '@angular/core';
import { EnumTypeHelp } from '../../api/models/EnumTypeHelp';
/**
 * Pipe qui transforme un numéro de type d'aide en chaîne de caractères.
 * Utilisation : {{ typeHelpNumber | helpType }}
 */
@Pipe({
    name: 'helpType'
})
export class HelpTypePipe implements PipeTransform {
    transform(typeHelp: number | EnumTypeHelp): string {
        switch (typeHelp) {
            case EnumTypeHelp._0:
            case 0:
                return 'Autre';
            case EnumTypeHelp._1:
            case 1:
                return 'Aides aux devoirs';
            case EnumTypeHelp._2:
            case 2:
                return 'Péparation aux examens';
            default:
                return 'Non défini';
        }
    }
}

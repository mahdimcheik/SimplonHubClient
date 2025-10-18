import { inject, Pipe, PipeTransform } from '@angular/core';
import { Level } from '../../api/models/Level';
import { CursusMainService } from '../services/cursus.service';

@Pipe({
    name: 'cursusLevel'
})
export class CursusLevelPipe implements PipeTransform {
    transform(level: string): string {
        switch (level) {
            case 'Débutant':
                return 'Débutant';
            case 'Intermédiaire':
                return 'Intermédiaire';
            case 'Avancé':
                return 'Avancé';
            default:
                return 'Non défini';
        }
    }
}

@Pipe({
    name: 'cursusLevelBadge'
})
export class CursusLevelBadgePipe implements PipeTransform {
    transform(level: string): string {
        switch (level) {
            case 'Débutant':
                return 'p-badge-success';
            case 'Intermédiaire':
                return 'p-badge-warning';
            case 'Avancé':
                return 'p-badge-danger';
            default:
                return 'p-badge-secondary';
        }
    }
}

@Pipe({
    name: 'cursusLevelIcon'
})
export class CursusLevelIconPipe implements PipeTransform {
    transform(level: string): string {
        switch (level) {
            case 'Débutant':
                return 'pi pi-star';
            case 'Intermédiaire':
                return 'pi pi-star-fill';
            case 'Avancé':
                return 'pi pi-crown';
            default:
                return 'pi pi-crown-fill';
        }
    }
}

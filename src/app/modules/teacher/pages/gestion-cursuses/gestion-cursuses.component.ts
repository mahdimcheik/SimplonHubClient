import { Component, effect, inject, signal, Type } from '@angular/core';
import { ActionButtonRendererComponent, CustomTableState, DynamicColDef, ICellRendererAngularComp, INITIAL_STATE, SmartGridComponent } from '../../../../generic-components/smart-grid';
import { CursusesMainService } from '../../../../shared/services/cursuses-main.service';
import { LevelCursusResponseDTO } from '../../../../../api';

@Component({
    selector: 'app-gestion-cursuses',
    templateUrl: './gestion-cursuses.component.html',
    styleUrl: './gestion-cursuses.component.scss'
})
export class GestionCursusesComponent {
    cursusService = inject(CursusesMainService);
    // cursuses = this.cursusService.cursuses;
    // totalRecords = this.cursusService.totalRecords;
    loading = signal(false);
    filterParams = signal<CustomTableState>(INITIAL_STATE);
    customComponents = signal<{ [key: string]: Type<ICellRendererAngularComp> }>({
        default: ActionButtonRendererComponent
    });
    columns = signal<DynamicColDef[]>([
        {
            field: 'name',
            header: 'Name',
            type: 'text',
            sortable: true,
            filterable: true
        },
        {
            field: 'level',
            header: 'Level',
            type: 'array',
            options: this.cursusService.allLevels(),
            optionLabel: 'name',
            optionValue: 'id',
            filterable: true,
            valueFormatter: (level) => (level as LevelCursusResponseDTO)?.name,
            filterField: 'levelId'
        },
        {
            field: 'description',
            header: 'Description',
            type: 'text',
            sortable: true,
            filterable: true
        }
    ]);
    constructor() {
        // this.cursusService.getAllCursusesByUserPaginated(this.filterParams());
        effect(() => {
            const filters = this.filterParams();
            this.cursusService.getAllCursusesByUserPaginated(filters);
        });
    }
}

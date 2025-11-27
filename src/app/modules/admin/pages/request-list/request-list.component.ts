import { Component, computed, effect, inject, signal } from '@angular/core';
import { TeacherResponseDTO } from '../../../../../api';
import { CustomTableState, DynamicColDef, INITIAL_STATE, SmartGridComponent } from '../../../../generic-components/smart-grid';
import { DobToAgePipe } from '../../../../shared/pipes/dob-to-age.pipe';
import { AdminMainService } from '../../../../shared/services/admin-main.service';
import { UserMainService } from '../../../../shared/services/userMain.service';

@Component({
    selector: 'app-request-list',
    imports: [SmartGridComponent],
    templateUrl: './request-list.component.html',
    providers: [DobToAgePipe],
    styleUrl: './request-list.component.scss'
})
export class RequestListComponent {
    adminService = inject(AdminMainService);
    userService = inject(UserMainService);
    dobToAgePipe = inject(DobToAgePipe);
    // Table state
    filterParams = signal<CustomTableState>(INITIAL_STATE);
    loading = signal(false);
    totalRecords = signal(0);
    candidats = signal<TeacherResponseDTO[]>([]);

    // Column definitions
    columns = computed<DynamicColDef[]>(() => {
        return [
            {
                field: 'lastName',
                header: 'Nom complet',
                type: 'text',
                sortable: true,
                sortField: 'lastName',
                filterable: true,
                valueFormatter: (data: any) => {
                    const teacher = data as TeacherResponseDTO;
                    return teacher ? `${teacher.firstName} ${teacher.lastName}` : '';
                },
                width: '200px'
            },
            {
                field: 'email',
                header: 'Email',
                type: 'text',
                sortable: true,
                sortField: 'email',
                filterable: true
            },
            {
                field: 'age',
                header: 'Age',
                type: 'text',
                filterable: true,
                valueFormatter: (data: any) => {
                    const teacher = data as TeacherResponseDTO;
                    return teacher ? this.dobToAgePipe.transform(teacher.dateOfBirth) + ' ans' : 'Pas défini';
                },
                width: '200px'
            }
        ];
    });

    constructor() {
        effect(() => {
            const params = this.filterParams();
            this.loadData(params);
        });
    }

    async loadData(params: CustomTableState) {
        const candidats = await this.adminService.getCandidats(params);
        this.candidats.set(candidats.data ?? []);
    }
}

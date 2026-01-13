import { DatePipe } from '@angular/common';
import { Component, computed, effect, inject, signal, Type } from '@angular/core';
import { Router } from '@angular/router';
import { TeacherResponseDTO } from '../../../../../api';
import { ActionButtonRendererComponent, CustomTableState, DynamicColDef, ICellRendererAngularComp, INITIAL_STATE, SmartGridComponent } from '../../../../generic-components/smart-grid';
import { ColorGridComponent } from '../../../../generic-components/smart-grid/color-grid.component';
import { DobToAgePipe } from '../../../../shared/pipes/dob-to-age.pipe';
import { AdminMainService } from '../../../../shared/services/admin-main.service';
import { UserMainService } from '../../../../shared/services/userMain.service';

@Component({
    selector: 'app-request-list',
    imports: [SmartGridComponent],
    templateUrl: './request-list.component.html',
    providers: [DobToAgePipe, DatePipe],
    styleUrl: './request-list.component.scss'
})
export class RequestListComponent {
    adminService = inject(AdminMainService);
    userService = inject(UserMainService);
    dobToAgePipe = inject(DobToAgePipe);
    datePipe = inject(DatePipe);
    router = inject(Router);
    // Table state
    filterParams = signal<CustomTableState>(INITIAL_STATE);
    loading = signal(false);
    totalRecords = signal(0);
    candidats = signal<TeacherResponseDTO[]>([]);

    //
    customComponents = signal<{ [key: string]: Type<ICellRendererAngularComp> }>({
        color: ColorGridComponent,
        action: ActionButtonRendererComponent
    });

    // Column definitions
    columns = computed<DynamicColDef[]>(() => {
        return [
            {
                field: 'lastName',
                header: 'Nom complet',
                type: 'text',
                sortable: false,
                sortField: 'lastName',
                filterable: false,
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
                sortable: false,
                sortField: 'email',
                filterable: false
            },
            {
                field: 'age',
                header: 'Age',
                type: 'text',
                filterable: false,
                valueFormatter: (data: any) => {
                    const teacher = data as TeacherResponseDTO;
                    return teacher ? this.dobToAgePipe.transform(teacher.dateOfBirth) + ' ans' : 'Pas défini';
                },
                width: '200px'
            },
            {
                field: 'createdAt',
                header: 'Créé le',
                type: 'date',
                valueFormatter: (data: any) => (data ? new Date(data.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' }) : 'Pas de date'),
                filterable: false,
                width: '200px'
            },
            { field: 'id', header: 'Actions', type: 'text', cellRenderer: 'Default', cellRendererParams: { showEdit: true, showDelete: false, onEdit: this.onEditClickLanguage.bind(this) } }
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

    onEditClickLanguage(data: any) {
        this.router.navigate(['/admin/request-list', data.id]);
    }
}

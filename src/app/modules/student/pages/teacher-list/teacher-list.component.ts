import { Component, computed, effect, inject, signal, Type } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RadioButtonModule } from 'primeng/radiobutton';
import { SmartGridModernizedComponent } from '../../../../generic-components/smart-grid-modernized/smart-grid-modernized.component';
import { CardUserComponent } from '../../../admin/pages/users-list/card-user/card-user.component';
import { ActionButtonRendererComponent, CustomTableState, DynamicColDef, ICellRendererAngularComp, INITIAL_STATE } from '../../../../generic-components/smart-grid';
import { LanguageResponseDTO, RoleAppResponseDTO, StatusAccountDTO, TeacherResponseDTO, UserResponseDTO } from '../../../../../api';
import { OptionsRendererComponent } from '../../../../generic-components/smart-grid/options-component';
import { UserMainService } from '../../../../shared/services/userMain.service';
import { AdminMainService } from '../../../../shared/services/admin-main.service';
import { firstValueFrom } from 'rxjs';

@Component({
    selector: 'app-teacher-list',
    imports: [RadioButtonModule, FormsModule, SmartGridModernizedComponent],
    templateUrl: './teacher-list.component.html',
    styleUrl: './teacher-list.component.scss'
})
export class TeacherListComponent {
    adminService = inject(AdminMainService);
    userService = inject(UserMainService);
    // Table state
    filterParams = signal<CustomTableState>(INITIAL_STATE);
    loading = signal(false);
    totalRecords = signal(0);
    viewMode = signal<'grid' | 'list'>('grid');

    // Custom components
    customComponents = signal<{ [key: string]: Type<ICellRendererAngularComp> }>({
        default: ActionButtonRendererComponent,
        options: OptionsRendererComponent
    });

    // Data
    users = signal<TeacherResponseDTO[]>([]);

    // Options for filters
    statuses = signal<StatusAccountDTO[]>([]);
    roles = signal<RoleAppResponseDTO[]>([]);
    languages = signal<LanguageResponseDTO[]>([]);

    // Item renderer component
    cardUserComponent = CardUserComponent;

    // Column definitions
    columns = computed<DynamicColDef[]>(() => {
        const statuses = this.statuses();
        const roles = this.roles();
        const languages = this.languages();
        return [
            {
                field: 'lastName',
                header: 'Nom de famille',
                type: 'text',
                sortable: true,
                sortField: 'lastName',
                filterable: true,
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
                field: 'userLanguages',
                header: 'Langues',
                type: 'array',
                options: this.languages(),
                optionLabel: 'name',
                optionValue: 'id',
                filterable: true,
                filterField: 'languages/Id',
                cellRenderer: 'options',
                cellRendererParams: {
                    field: 'userLanguages',
                    options: this.languages(),
                    optionLabel: 'name',
                    optionValue: 'id'
                }
            },
            {
                field: 'TeacherCursuses/name',
                header: 'Cursuses',
                type: 'text',
                filterable: true,
                width: '200px'
            }
        ];
    });

    /**
     * Load users from backend using OData
     */
    async loadUsers(state: CustomTableState) {
        try {
            this.loading.set(true);
            const response = await this.adminService.getTeachers(state);
            this.users.set(response.data ?? []);
            this.totalRecords.set(response.count ?? 0);
        } catch (error) {
            console.error('Error loading teachers:', error);
        } finally {
            this.loading.set(false);
        }
    }
    constructor() {
        this.getStatuses();
        this.getLanguages();
        effect(() => {
            const state = this.filterParams();
            this.loadUsers(state);
        });
    }

    async getStatuses() {
        this.statuses.set([]);
        const response = await firstValueFrom(
            this.userService.getStatusAccount({
                first: 0,
                rows: 10,
                sorts: [],
                filters: {}
            } as CustomTableState)
        );
        this.statuses.set(response.data ?? []);
        return response.data ?? [];
    }
    async getLanguages() {
        this.languages.set([]);
        const response = await firstValueFrom(
            this.userService.getLanguages({
                first: 0,
                rows: 10,
                sorts: [],
                filters: {}
            } as CustomTableState)
        );
        this.languages.set(response.data ?? []);
        return response.data ?? [];
    }

    // on row click
    onRowClick(event: any) {
        console.log('onRowClick', event);
    }
}

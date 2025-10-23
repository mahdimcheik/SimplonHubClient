import { Component, computed, effect, inject, signal, Type } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RadioButtonModule } from 'primeng/radiobutton';
import { SmartGridModernizedComponent } from '../../../../generic-components/smart-grid-modernized/smart-grid-modernized.component';
import { CardUserComponent } from '../../../admin/pages/users-list/card-user/card-user.component';
import { ActionButtonRendererComponent, CustomTableState, DynamicColDef, ICellRendererAngularComp, INITIAL_STATE } from '../../../../generic-components/smart-grid';
import { RoleAppResponseDTO, StatusAccountDTO, UserResponseDTO } from '../../../../../api';
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
    users = signal<UserResponseDTO[]>([]);

    // Options for filters
    statuses = signal<StatusAccountDTO[]>([]);
    roles = signal<RoleAppResponseDTO[]>([]);

    // Item renderer component
    cardUserComponent = CardUserComponent;

    // Column definitions
    columns = computed<DynamicColDef[]>(() => {
        const statuses = this.statuses();
        const roles = this.roles();
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

        effect(
            () => {
                const state = this.filterParams();
                this.loadUsers(state);
            },
            { allowSignalWrites: true }
        );
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

    // on row click
    onRowClick(event: any) {
        console.log('onRowClick', event);
    }
}

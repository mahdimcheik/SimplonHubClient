import { Component, computed, effect, inject, signal, Type } from '@angular/core';
import { SmartGridComponent } from '../../../../generic-components/smart-grid/smart-grid.component';
import { RoleAppResponseDTO, StatusAccountDTO, UserResponseDTO } from '../../../../../api';
import { CustomTableState, DynamicColDef, ICellRendererAngularComp, INITIAL_STATE } from '../../../../shared/models/TableColumn ';
import { ActionButtonRendererComponent } from '../../../../generic-components/smart-grid/default-component';
import { OptionsRendererComponent } from '../../../../generic-components/smart-grid/options-component';

import { ODataQueryBuilder, parseODataResponse } from '../../../../generic-components/smart-grid/odata-query-builder';
import { UserMainService } from '../../../../shared/services/userMain.service';
import { AdminMainService } from '../../../../shared/services/admin-main.service';
import { firstValueFrom } from 'rxjs';
import { SmartGridModernizedComponent } from '../../../../generic-components/smart-grid-modernized/smart-grid-modernized.component';

/**
 * Example component showing how to use SmartGrid with OData backend
 */
@Component({
    selector: 'app-users-list',
    imports: [SmartGridComponent, SmartGridModernizedComponent],
    templateUrl: './users-list.component.html',
    styleUrl: './users-list.component.scss'
})
export class UsersListComponent {
    adminService = inject(AdminMainService);
    userService = inject(UserMainService);
    // Table state
    filterParams = signal<CustomTableState>(INITIAL_STATE);
    loading = signal(false);
    totalRecords = signal(0);

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
    // Column definitions
    columns = computed<DynamicColDef[]>(() => {
        const statuses = this.statuses();
        const roles = this.roles();
        return [
            {
                field: 'firstName',
                header: 'Prénom',
                type: 'text',
                sortable: true,
                sortField: 'firstName',
                filterable: true,
                width: '200px'
            },
            {
                field: 'roles',
                header: 'Rôles',
                type: 'array',
                specialFilter: true,
                options: this.roles(),
                optionLabel: 'name',
                optionValue: 'id',
                filterable: true,
                filterField: 'userRoles/roleId',
                cellRenderer: 'options',
                cellRendererParams: {
                    field: 'roles',
                    options: this.roles(),
                    optionLabel: 'name',
                    optionValue: 'id'
                }
            },
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
                field: 'status',
                header: 'Statut',
                type: 'array',
                // valueFormatter: (status) => (status as StatusAccountDTO)?.name,
                options: this.statuses(),
                optionLabel: 'name',
                optionValue: 'id',
                filterable: true,
                filterField: 'statusId',
                cellRenderer: 'options',
                cellRendererParams: {
                    field: 'status',
                    options: this.statuses(),
                    optionLabel: 'name',
                    optionValue: 'id'
                }
            },
            {
                field: 'dateOfBirth',
                header: 'Date de naissance',
                type: 'date',
                filterable: true,
                sortable: true
            }
        ];
    });

    constructor() {
        this.getStatuses();
        this.getRoles();
        effect(
            () => {
                const state = this.filterParams();
                this.loadUsers(state);
            },
            { allowSignalWrites: true }
        );
    }

    /**
     * Load users from backend using OData
     */
    async loadUsers(state: CustomTableState) {
        try {
            this.loading.set(true);
            const response = await this.adminService.getUsers(state);
            this.users.set(response.data ?? []);
            this.totalRecords.set(response.count ?? 0);
        } catch (error) {
            console.error('Error loading users:', error);
        } finally {
            this.loading.set(false);
        }
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

    async getRoles() {
        const response = await firstValueFrom(
            this.userService.getRoles({
                first: 0,
                rows: 10,
                sorts: [],
                filters: {}
            } as CustomTableState)
        );
        this.roles.set(response.data ?? []);
        return response.data ?? [];
    }

    // on row click
    onRowClick(event: any) {
        console.log('onRowClick', event);
    }
}

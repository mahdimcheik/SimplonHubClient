import { Component, computed, effect, inject, signal, Type } from '@angular/core';
import { AdminMainService } from '../../../../shared/services/admin-main.service';
import { UserMainService } from '../../../../shared/services/userMain.service';
import { ActionButtonRendererComponent, CustomTableState, DynamicColDef, ICellRendererAngularComp, INITIAL_STATE, SmartGridComponent } from '../../../../generic-components/smart-grid';
import { OptionsRendererComponent } from '../../../../generic-components/smart-grid/options-component';
import { BookingDetailsDTO, LanguageResponseDTO, RoleAppResponseDTO, StatusAccountDTO, TeacherResponseDTO } from '../../../../../api';
import { CardUserComponent } from '../../../admin/pages/users-list/card-user/card-user.component';
import { firstValueFrom } from 'rxjs';
import { SmartGridModernizedComponent } from '../../../../generic-components/smart-grid-modernized/smart-grid-modernized.component';
import { SlotMainService } from '../../../../shared/services/slot-main.service';

@Component({
    selector: 'app-reservation-list',
    imports: [SmartGridModernizedComponent, SmartGridComponent],
    templateUrl: './reservation-list.component.html',
    styleUrl: './reservation-list.component.scss'
})
export class ReservationListComponent {
    adminService = inject(AdminMainService);
    slotService = inject(SlotMainService);
    userService = inject(UserMainService);
    // Table state
    filterParams = signal<CustomTableState>(INITIAL_STATE);
    loading = signal(false);
    totalRecords = signal(0);
    viewMode = signal<'grid' | 'list'>('grid');
    forceRender = signal(false);

    // Custom components
    customComponents = signal<{ [key: string]: Type<ICellRendererAngularComp> }>({
        default: ActionButtonRendererComponent,
        options: OptionsRendererComponent
    });

    // Data
    bookings = signal<BookingDetailsDTO[]>([]);

    // Options for filters
    statuses = signal<StatusAccountDTO[]>([]);
    roles = signal<RoleAppResponseDTO[]>([]);
    languages = signal<LanguageResponseDTO[]>([]);

    // Item renderer component
    cardUserComponent = CardUserComponent;

    // Column definitions
    columns = computed<DynamicColDef[]>(() => {
        return [
            {
                field: 'teacher',
                header: 'Nom du professeur',
                type: 'text',
                sortField: 'teacher',
                width: '200px',
                valueFormatter: (data: any) => {
                    const teacher = data as TeacherResponseDTO;
                    return teacher ? `${teacher.firstName} ${teacher.lastName}` : '';
                }
            },
            {
                field: 'title',
                header: 'Titre',
                type: 'text',
                sortField: 'title',
                width: '200px'
            },
            {
                field: 'description',
                header: 'Description',
                type: 'text',
                sortField: 'description'
            }
        ];
    });

    /**
     * Load users from backend using OData
     */
    async loadUsers(state: CustomTableState) {
        try {
            this.loading.set(true);
            const response = await this.slotService.getBookingsByStudent(state, this.userService.userConnected().id!, '');
            this.bookings.set(response.data ?? []);
            this.totalRecords.set(response.count ?? 0);
        } catch (error) {
            console.error('Error loading teachers:', error);
        } finally {
            this.loading.set(false);
        }
    }
    constructor() {
        effect(() => {
            const _ = this.forceRender();
            const state = this.filterParams();
            this.loadUsers(state);
        });
    }

    resetFilter() {
        console.log('Reset Filter');
        // this.filterParams.set(INITIAL_STATE);
        this.forceRender.set(!this.forceRender());
    }
    // on row click
    onRowClick(event: any) {
        console.log('onRowClick', event);
    }
}

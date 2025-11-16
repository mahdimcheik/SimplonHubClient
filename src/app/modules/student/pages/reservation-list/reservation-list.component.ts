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
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-reservation-list',
    imports: [SmartGridModernizedComponent, SmartGridComponent],
    providers: [DatePipe],
    templateUrl: './reservation-list.component.html',
    styleUrl: './reservation-list.component.scss'
})
export class ReservationListComponent {
    adminService = inject(AdminMainService);
    slotService = inject(SlotMainService);
    userService = inject(UserMainService);
    private datePipe = inject(DatePipe);
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

    // Item renderer component
    cardUserComponent = CardUserComponent;

    // Column definitions
    columns = computed<DynamicColDef[]>(() => {
        return [
            {
                field: 'slot',
                header: 'Nom du professeur',
                type: 'text',
                sortField: 'teacher',
                width: '200px',
                valueFormatter: (data: any) => {
                    const teacher = data.teacher as TeacherResponseDTO;
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
            },
            {
                field: 'slot',
                header: 'Date de début',
                type: 'date',
                valueFormatter: (data: any) => {
                    const date = new Date(data.dateFrom);
                    return this.datePipe.transform(date, 'dd/MM/yyyy HH:mm') ?? 'pas défini';
                }
            },
            {
                field: 'slot',
                header: 'Date de fin',
                type: 'date',
                valueFormatter: (data: any) => {
                    const date = new Date(data.dateTo);
                    return this.datePipe.transform(date!, 'HH:mm') ?? 'pas défini';
                }
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
        let firstRun = true;
        effect(() => {
            const state = this.filterParams();
            if (firstRun) {
                firstRun = false;
                return;
            }
            this.loadUsers(state);
        });
    }
    // on row click
    onRowClick(event: any) {
        console.log('onRowClick', event);
    }
}

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
import { DateTime } from 'luxon';
import { DurationPipe } from '../../../../shared/pipes/duration.pipe';
import { ModalReservationDetailComponent } from '../../../components/modal-reservation-detail/modal-reservation-detail.component';

@Component({
    selector: 'app-reservation-list-by-teacher',
    imports: [SmartGridModernizedComponent, SmartGridComponent, ModalReservationDetailComponent],
    providers: [DatePipe, DurationPipe],
    templateUrl: './reservation-list-by-teacher.component.html',
    styleUrl: './reservation-list-by-teacher.component.scss'
})
export class ReservationListByTeacherComponent {
    adminService = inject(AdminMainService);
    slotService = inject(SlotMainService);
    userService = inject(UserMainService);
    private datePipe = inject(DatePipe);
    private durationPipe = inject(DurationPipe);
    // Table state
    filterParams = signal<CustomTableState>(INITIAL_STATE);
    loading = signal(false);
    totalRecords = signal(0);
    viewMode = signal<'grid' | 'list'>('grid');
    forceRender = signal(false);
    modalDetailVisible = signal(false);
    selectedReservation = signal<BookingDetailsDTO>({} as BookingDetailsDTO);

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
                field: 'student',
                header: "Nom de l'étudiant",
                type: 'text',
                sortField: 'student',
                valueFormatter: (data: any) => {
                    const student = data as TeacherResponseDTO;
                    return student ? `${student.firstName} ${student.lastName}` : '';
                },
                filterable: true,
                filterField: 'student/lastName',
                sortable: true,
                specialFilter: true
            },
            {
                field: 'title',
                header: 'Titre',
                type: 'text',
                sortField: 'title'
            },
            {
                field: 'description',
                header: 'Description',
                type: 'text',
                sortField: 'description',
                width: '300px'
            },
            {
                field: 'slot',
                header: 'Date de début',
                type: 'date',
                valueFormatter: (data: any) => {
                    const date = new Date(data.dateFrom);
                    return this.datePipe.transform(date, 'dd/MM/yyyy HH:mm') ?? 'pas défini';
                },
                filterable: true,
                filterField: 'slot/dateFrom',
                sortable: true
            },
            {
                field: 'slot',
                header: 'Durée en heures',
                type: 'text',
                valueFormatter: (data: any) => {
                    const date = new Date(data.dateTo);
                    const startTime = new Date(data.dateFrom);
                    return this.durationPipe.transform(date, startTime) ?? 'pas défini';
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
            state.filters = { ...state.filters, teacherId: { value: this.userService.userConnected().id!, matchMode: 'equals' } };
            const response = await this.slotService.getBookings(state);
            this.bookings.set(response.data ?? []);
            this.totalRecords.set(response.count ?? 0);
        } catch (error) {
            console.error('Error loading reservations by teacher:', error);
        } finally {
            this.loading.set(false);
        }
    }
    constructor() {
        effect(() => {
            const state = this.filterParams();
            this.loadUsers(state);
        });
    }
    // on row click
    onRowClick(event: any) {
        this.selectedReservation.set(event);
        this.modalDetailVisible.set(true);
    }
    close() {
        this.selectedReservation.set({} as BookingDetailsDTO);
    }
}

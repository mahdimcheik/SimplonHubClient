import { Component, computed, DestroyRef, effect, ElementRef, inject, input, linkedSignal, model, output, viewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { BookingDetailsDTO } from '../../../../api';
import { Message } from 'primeng/message';
import { Button } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { Fluid } from 'primeng/fluid';
import { DateTime } from 'luxon';
import { DatePipe } from '@angular/common';
import { SlotMainService } from '../../../shared/services/slot-main.service';
import { UserMainService } from '../../../shared/services/userMain.service';
import { LoaderService } from '../../../shared/services/loader.service';
import { firstValueFrom } from 'rxjs';
import { DrawerModule } from 'primeng/drawer';
import { ChipsListComponent } from '../../../generic-components/chips-list/chips-list.component';
import { Chip } from 'primeng/chip';
import { TooltipModule } from 'primeng/tooltip';

@Component({
    selector: 'app-modal-reservation-detail',
    imports: [Button, DrawerModule, DatePipe, Chip, TooltipModule],
    templateUrl: './modal-reservation-detail.component.html',
    styleUrl: './modal-reservation-detail.component.scss'
})
export class ModalReservationDetailComponent {
    authService = inject(UserMainService);
    isLoading = inject(LoaderService).isLoading;
    destroyRef = inject(DestroyRef);

    visibleRight = model<boolean>(false);
    reservation = input.required<BookingDetailsDTO>();
    onClose = output<boolean>();

    durationComputed = computed(() => {
        const start = this.reservation().slot?.dateFrom;
        const end = this.reservation().slot?.dateTo;
        if (!start || !end) return 'N/A';

        const diffMs = new Date(end).getTime() - new Date(start).getTime();
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

        if (diffHours > 0) {
            return diffMinutes > 0 ? `${diffHours}h ${diffMinutes}min` : `${diffHours}h`;
        }
        return `${diffMinutes}min`;
    });

    constructor() {
        effect(() => {
            const reservation = this.reservation();
        });
    }

    close() {
        this.visibleRight.set(false);
        this.onClose.emit(false);
    }
}

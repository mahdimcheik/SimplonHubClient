import { Component, computed, DestroyRef, inject, OnInit, signal, viewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { CalendarApi, CalendarOptions, DateSelectArg, DateSpanApi, DatesSetArg, EventClickArg, EventDropArg, EventInput } from '@fullcalendar/core/index.js';
import { SlotMainService } from '../../../../shared/services/slot-main.service';
import { UserMainService } from '../../../../shared/services/userMain.service';
import { CalendarSetupService } from '../../../../shared/services/calendar-setup.service';
import { FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular';
import { CustomTableState } from '../../../../generic-components/smart-grid';
import { EventResizeDoneArg } from '@fullcalendar/interaction/index.js';
import { EventImpl } from '@fullcalendar/core/internal';
import { DateTime } from 'luxon';
import { SlotResponseDTO } from '../../../../../api';
import dayGridPlugin from '@fullcalendar/daygrid';
import listPlugin from '@fullcalendar/list';
import frLocale from '@fullcalendar/core/locales/fr';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-calendar-student',
    imports: [FullCalendarModule],
    templateUrl: './calendar-student.component.html',
    styleUrl: './calendar-student.component.scss'
})
export class CalendarStudentComponent implements OnInit {
    private fb = inject(FormBuilder);
    slotMainService = inject(SlotMainService);
    activatedRoute = inject(ActivatedRoute);
    destroyRef = inject(DestroyRef);
    selectedEvent = signal<EventInput>({});
    userMainService = inject(UserMainService);
    calendarSetupService = inject(CalendarSetupService);
    user = this.userMainService.userConnected;

    quickInfosVisible = signal(false);
    createEventVisible = signal(false);

    // calendar ref
    calendarRef = viewChild(FullCalendarComponent);
    calendarApi = computed(() => this.calendarRef()?.getApi() as CalendarApi);
    startDate = signal<Date | null>(null);
    endDate = signal<Date | null>(null);
    teacherId = signal<string | null>(null);

    sourceEvents = signal<EventInput[]>([]);

    initialView = computed(() => (window.innerWidth < 768 ? 'timeGridDay' : 'timeGridWeek'));

    onResize = (event: EventResizeDoneArg) => {
        console.log(event);
        this.selectedEvent.set({ extendedProps: { slot: event.oldEvent.extendedProps?.['slot'] as SlotResponseDTO }, start: event.event?.start as Date, end: event.event?.end as Date });
        this.createEventVisible.set(true);
    };

    onDateSelect = (selectInfo: DateSelectArg) => {};

    onEventClick = (clickInfo: EventClickArg) => {
        this.selectedEvent.set(clickInfo.event as EventInput);
        this.quickInfosVisible.set(true);
    };

    onStartDrag = (dragInfo: any) => {
        return false;
    };

    canDrop = (dropInfo: DateSpanApi, draggedEvent: EventImpl | null) => {
        return false;
    };

    onDrop = (dropInfo: EventDropArg) => {};

    onDatesSet = (dateInfo: DatesSetArg) => {
        this.startDate.set(dateInfo.start);
        this.endDate.set(dateInfo.end);
        this.loadData();
    };

    getCalendarApi() {
        return this.calendarRef()?.getApi();
    }

    calendarOptions = computed<CalendarOptions>(() => ({
        initialView: this.initialView(),
        initialDate: new Date().toISOString(),
        plugins: [dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin],
        locale: frLocale,
        headerToolbar: this.calendarSetupService.headerToolbar(),
        views: {
            dayGridMonth: {
                titleFormat: { year: 'numeric', month: '2-digit', day: '2-digit' }
            },
            timeGridFiveDays: {
                type: 'timeGrid',
                duration: { days: 4 }
            }
        },
        weekends: true,
        slotDuration: this.calendarSetupService.slotDuration(),
        slotMinTime: '06:00',
        slotMaxTime: this.calendarSetupService.slotMaxTime(),
        allDaySlot: this.calendarSetupService.allDaySlot(),
        navLinks: this.calendarSetupService.navLinks(),
        eventStartEditable: this.calendarSetupService.eventStartEditable(),
        eventOverlap: this.calendarSetupService.eventOverlap(),
        weekNumbers: this.calendarSetupService.weekNumbers(),
        selectMirror: this.calendarSetupService.selectMirror(),
        unselectAuto: this.calendarSetupService.unselectAuto(),
        selectOverlap: this.calendarSetupService.selectOverlap(),
        editable: false,
        selectable: false,
        eventDurationEditable: false,
        defaultTimedEventDuration: this.calendarSetupService.defaultTimedEventDuration(),
        nowIndicator: this.calendarSetupService.nowIndicator(),
        allDayText: this.calendarSetupService.allDayText(),
        droppable: false,
        eventResizableFromStart: false,
        height: this.calendarSetupService.height(),

        eventResizeStop() {},
        eventResize: this.onResize,
        select: this.onDateSelect,
        eventClick: this.onEventClick,
        selectAllow: this.onStartDrag,
        eventAllow: this.canDrop,
        eventDrop: this.onDrop,
        datesSet: this.onDatesSet,
        events: this.sourceEvents(),
        eventColor: 'transparent',
        eventDisplay: 'block'
    }));

    ngOnInit(): void {
        this.activatedRoute.params.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
            const teacherId = params['teacherId'];
            if (teacherId) {
                this.teacherId.set(teacherId);
            } else {
                this.teacherId.set(null);
            }
        });
    }

    async loadData() {
        const slots = await this.slotMainService.getAllSlotsByStudent(this.startDate() ?? new Date(), this.endDate() ?? new Date(), this.teacherId() ?? undefined);
        this.sourceEvents.set(
            slots.map((slot) => ({
                title: slot?.type?.name ?? '',
                start: slot.dateFrom,
                end: slot.dateTo,
                extendedProps: {
                    slot: slot
                }
            }))
        );
        console.log('sourceEvents', this.sourceEvents());
    }

    editEvent() {
        this.selectedEvent.set(this.selectedEvent() as EventInput);
        this.createEventVisible.set(true);
    }
}

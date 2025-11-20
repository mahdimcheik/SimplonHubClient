import { Component, computed, inject, input, model, OnInit, output, signal, viewChild } from '@angular/core';
import { CalendarApi, CalendarOptions, DateSelectArg, DateSpanApi, EventClickArg, EventDropArg, EventInput, DatesSetArg } from '@fullcalendar/core/index.js';
import { FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import listPlugin from '@fullcalendar/list';
import frLocale from '@fullcalendar/core/locales/fr';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin, { EventResizeDoneArg } from '@fullcalendar/interaction';
import { FormBuilder } from '@angular/forms';
import { DateTime } from 'luxon';
import { ModalQuickInfosComponent } from '../../../../generic-components/modal-quick-infos/modal-quick-infos.component';
import { ModalCreateEditSlotComponent } from '../../../../generic-components/modal-create-edit-slot/modal-create-edit-slot.component';
import { EventImpl } from '@fullcalendar/core/internal';
import { SlotMainService } from '../../../../shared/services/slot-main.service';
import { SlotResponseDTO, TypeSlotResponseDTO } from '../../../../../api/models';
import { CustomTableState } from '../../../../generic-components/smart-grid';
import { UserMainService } from '../../../../shared/services/userMain.service';
import { CalendarSetupService } from '../../../../shared/services/calendar-setup.service';
import { Button } from 'primeng/button';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-calendar-teacher',
    imports: [FullCalendarModule, ModalQuickInfosComponent, ModalCreateEditSlotComponent, Button, DatePipe],
    templateUrl: './calendar-teacher.component.html',
    styleUrl: './calendar-teacher.component.scss'
})
export class CalendarTeacherComponent implements OnInit {
    private fb = inject(FormBuilder);
    slotMainService = inject(SlotMainService);
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

    // filters
    filters = computed<CustomTableState>(() => {
        const startDate = this.startDate()?.toISOString() ?? '';
        const endDate = this.endDate()?.toISOString() ?? '';

        return {
            first: 0,
            rows: 1000,
            sorts: [],
            filters: {
                dateFrom: {
                    value: startDate,
                    matchMode: 'after'
                },
                dateTo: {
                    value: endDate,
                    matchMode: 'before'
                },
                teacherId: {
                    value: this.user()?.id ?? '',
                    matchMode: 'equals'
                }
            },
            search: ''
        };
    });

    sourceEvents = signal<EventInput[]>([]);

    initialView = computed(() => (window.innerWidth < 768 ? 'timeGridDay' : 'timeGridWeek'));

    onResize = (event: EventResizeDoneArg) => {
        this.selectedEvent.set({ extendedProps: { slot: event.oldEvent.extendedProps?.['slot'] as SlotResponseDTO }, start: event.event?.start as Date, end: event.event?.end as Date });
        this.createEventVisible.set(true);
    };
    onDateSelect = (selectInfo: DateSelectArg) => {
        this.selectedEvent.set(selectInfo);
        this.createEventVisible.set(true);
    };
    onEventClick = (clickInfo: EventClickArg) => {
        this.selectedEvent.set(clickInfo.event as EventInput);
        this.quickInfosVisible.set(true);
    };

    onStartDrag = (dragInfo: any) => {
        this.selectedEvent.set(dragInfo);
        return !dragInfo.extendedProps?.['slot']?.studentId && dragInfo.start > DateTime.now().toJSDate();
    };

    canDrop = (dropInfo: DateSpanApi, draggedEvent: EventImpl | null) => {
        return (dropInfo.start > DateTime.now().toJSDate() && draggedEvent?.start && draggedEvent.start > DateTime.now().toJSDate() && !draggedEvent?.extendedProps?.['slot']?.studentId) ?? false;
    };

    onDrop = (dropInfo: EventDropArg) => {
        this.selectedEvent.set({ extendedProps: { slot: dropInfo.oldEvent.extendedProps?.['slot'] as SlotResponseDTO }, start: dropInfo.event?.start as Date, end: dropInfo.event?.end as Date });
        this.createEventVisible.set(true);
    };

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
        slotMinTime: this.calendarSetupService.slotMinTime(),
        slotMaxTime: this.calendarSetupService.slotMaxTime(),
        allDaySlot: this.calendarSetupService.allDaySlot(),
        navLinks: this.calendarSetupService.navLinks(),
        eventStartEditable: this.calendarSetupService.eventStartEditable(),
        eventOverlap: this.calendarSetupService.eventOverlap(),
        weekNumbers: this.calendarSetupService.weekNumbers(),
        selectMirror: this.calendarSetupService.selectMirror(),
        unselectAuto: this.calendarSetupService.unselectAuto(),
        selectOverlap: this.calendarSetupService.selectOverlap(),
        editable: this.calendarSetupService.editable(),
        selectable: this.calendarSetupService.selectable(),
        eventDurationEditable: this.calendarSetupService.eventDurationEditable(),
        defaultTimedEventDuration: this.calendarSetupService.defaultTimedEventDuration(),
        nowIndicator: this.calendarSetupService.nowIndicator(),
        allDayText: this.calendarSetupService.allDayText(),
        droppable: this.calendarSetupService.droppable(),
        eventResizableFromStart: this.calendarSetupService.eventResizableFromStart(),
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
    // });

    ngOnInit(): void {}

    async loadData() {
        const slots = await this.slotMainService.getAllSlots(this.filters());
        const events = slots.map((slot) => {
            return {
                title: slot?.type?.name ?? '',
                start: slot.dateFrom,
                end: slot.dateTo,
                extendedProps: {
                    slot: slot,
                    passed: new Date(slot.dateFrom) < new Date(),
                    upcoming: new Date(slot.dateFrom) > new Date()
                }
            };
        });
        console.log('events ', events);

        this.sourceEvents.set(events);
    }
    editEvent() {
        this.selectedEvent.set(this.selectedEvent() as EventInput);
        this.createEventVisible.set(true);
    }
    // api
    goNext() {
        this.calendarApi()?.next();
    }
    goPrev() {
        this.calendarApi()?.prev();
    }
    goToday() {
        this.calendarApi()?.today();
    }
    viewDay() {
        this.calendarApi()?.changeView('timeGridDay');
    }
    viewWeek() {
        this.calendarApi()?.changeView('timeGridWeek');
    }
    viewMonth() {
        this.calendarApi()?.changeView('dayGridMonth');
    }
}

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
import { ModalQuickInfosComponent } from '../../../generic-components/modal-quick-infos/modal-quick-infos.component';
import { ModalCreateEditSlotComponent } from '../../../generic-components/modal-create-edit-slot/modal-create-edit-slot.component';
import { EventImpl } from '@fullcalendar/core/internal';
import { SlotMainService } from '../../../shared/services/slot-main.service';
import { SlotResponseDTO, TypeSlotResponseDTO } from '../../../../api/models';
import { CustomTableState } from '../../../generic-components/smart-grid';
import { UserMainService } from '../../../shared/services/userMain.service';

@Component({
    selector: 'app-calendar-teacher',
    imports: [FullCalendarModule, ModalQuickInfosComponent, ModalCreateEditSlotComponent],
    templateUrl: './calendar-teacher.component.html',
    styleUrl: './calendar-teacher.component.scss'
})
export class CalendarTeacherComponent implements OnInit {
    private fb = inject(FormBuilder);
    slotMainService = inject(SlotMainService);
    selectedEvent = signal<EventInput>({});
    userMainService = inject(UserMainService);
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
        console.log(event);
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
        console.log(dragInfo);
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
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
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
        slotDuration: '00:15:00',
        slotMinTime: '06:00',
        slotMaxTime: '22:00',
        allDaySlot: true,
        navLinks: true,
        eventStartEditable: true,
        eventOverlap: false,
        weekNumbers: true,
        selectMirror: true,
        unselectAuto: true,
        selectOverlap: false,
        editable: true,
        selectable: true,
        eventDurationEditable: true,
        defaultTimedEventDuration: '01:00:00',
        nowIndicator: true,
        allDayText: 'Heures',
        droppable: false,
        eventResizableFromStart: true,
        height: 1000,

        eventResizeStop() {},
        eventResize: this.onResize,
        select: this.onDateSelect,
        eventClick: this.onEventClick,
        selectAllow: this.onStartDrag,
        eventAllow: this.canDrop,
        eventDrop: this.onDrop,
        datesSet: this.onDatesSet,
        events: this.sourceEvents(),
        eventColor: '#d68181',
        eventDisplay: 'block'
    }));
    // });

    ngOnInit(): void {}

    async loadData() {
        const slots = await this.slotMainService.getAllSlots(this.filters());
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
    }
}

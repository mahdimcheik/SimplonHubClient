import { Component, computed, inject, input, model, output, signal, viewChild } from '@angular/core';
import { CalendarOptions, DateSelectArg, DateSpanApi, EventClickArg, EventDropArg, EventInput } from '@fullcalendar/core/index.js';
import { FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular';
import { TooltipModule } from 'primeng/tooltip';
import dayGridPlugin from '@fullcalendar/daygrid';
import listPlugin from '@fullcalendar/list';
import frLocale from '@fullcalendar/core/locales/fr';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin, { EventResizeDoneArg } from '@fullcalendar/interaction';
import { FormBuilder } from '@angular/forms';
import { DateTime } from 'luxon';
import { ModalQuickInfosComponent } from '../../../generic-components/modal-quick-infos/modal-quick-infos.component';
import { Button } from 'primeng/button';
import { ModalCreateEditSlotComponent } from '../../../generic-components/modal-create-edit-slot/modal-create-edit-slot.component';
import { EventImpl } from '@fullcalendar/core/internal';

@Component({
    selector: 'app-calendar-teacher',
    imports: [FullCalendarModule, ModalQuickInfosComponent, Button, ModalCreateEditSlotComponent],
    templateUrl: './calendar-teacher.component.html',
    styleUrl: './calendar-teacher.component.scss'
})
export class CalendarTeacherComponent {
    private fb = inject(FormBuilder);
    calendarRef = viewChild(FullCalendarComponent);
    selectedEvent = signal<EventInput>({});

    quickInfosVisible = signal(false);
    createEventVisible = signal(false);

    sourceEvents = signal<EventInput[]>([
        {
            title: 'Event 1',
            start: DateTime.local(2025, 10, 12, 10, 30).toISO() ?? '',
            end: DateTime.local(2025, 10, 12, 11, 30).toISO() ?? ''
        },
        {
            title: 'Event 2',
            start: DateTime.local(2025, 10, 12, 8, 30).toISO() ?? '',
            end: DateTime.local(2025, 10, 12, 9, 30).toISO() ?? ''
        }
    ]);

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
        console.log(dragInfo);
        return true;
    };
    canDrop = (dropInfo: DateSpanApi, draggedEvent: EventImpl | null) => {
        return false;
    };

    onDrop = (dropInfo: EventDropArg) => {
        console.log(dropInfo);
    };

    // Method to get calendar API when needed
    getCalendarApi() {
        return this.calendarRef()?.getApi();
    }

    calendarOptions = computed<CalendarOptions>(() => {
        return {
            initialView: this.initialView(),
            initialDate: '2025-10-11',
            plugins: [dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin],
            locale: frLocale,
            headerToolbar: {
                // left: 'prev,next today',
                // center: 'title',
                // right: 'dayGridMonth,timeGridWeek,timeGridDay'
                right: '',
                left: '',
                center: ''
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
            events: this.sourceEvents(),
            eventColor: '#378006',
            eventDisplay: 'block'
        };
    });
}

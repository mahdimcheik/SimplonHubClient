import { Injectable, signal } from '@angular/core';
import { ToolbarInput } from '@fullcalendar/core/index.js';

@Injectable({
    providedIn: 'root'
})
export class CalendarSetupService {
    slotDuration = signal<string>('00:15:00');
    slotMinTime = signal<string>('06:00');
    slotMaxTime = signal<string>('22:00');
    allDaySlot = signal<boolean>(true);
    navLinks = signal<boolean>(true);
    eventStartEditable = signal<boolean>(true);
    eventOverlap = signal<boolean>(false);
    weekNumbers = signal<boolean>(true);
    selectMirror = signal<boolean>(true);
    unselectAuto = signal<boolean>(true);
    selectOverlap = signal<boolean>(false);
    editable = signal<boolean>(true);
    selectable = signal<boolean>(true);
    eventDurationEditable = signal<boolean>(true);
    defaultTimedEventDuration = signal<string>('01:00:00');
    nowIndicator = signal<boolean>(true);
    allDayText = signal<string>('Heures');
    droppable = signal<boolean>(false);
    eventResizableFromStart = signal<boolean>(true);
    height = signal<number>(1000);

    headerToolbar = signal<ToolbarInput>({
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay'
    });
}

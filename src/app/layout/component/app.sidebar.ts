import { Component, ElementRef } from '@angular/core';
import { AppMenu } from './menu/app.menu';

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [AppMenu],
    template: ` <div class="layout-sidebar relative top-12">
        <app-menu></app-menu>
    </div>`
})
export class AppSidebar {
    constructor() {}
}

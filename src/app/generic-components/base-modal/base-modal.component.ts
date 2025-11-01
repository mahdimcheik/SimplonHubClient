import { Component, input, model } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { DrawerModule } from 'primeng/drawer';
import { ConfigurableFormComponent } from '../configurable-form/configurable-form.component';
import { DatePipe } from '@angular/common';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'app-base-modal',
    imports: [DialogModule, DrawerModule, ButtonModule],

    templateUrl: './base-modal.component.html',
    styleUrl: './base-modal.component.scss'
})
export class BaseModalComponent {
    visible = model(false);
    title = input<string>('Titre');
    iconClass = model<string>('pi pi-info-circle');
    onHide = () => {
        this.visible.set(false);
    };
}

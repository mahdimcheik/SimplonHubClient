import { NgTemplateOutlet } from '@angular/common';
import { Component, contentChild, model, output, TemplateRef } from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'app-smart-element',
    imports: [NgTemplateOutlet, ButtonModule],
    templateUrl: './smart-element.component.html',
    styleUrl: './smart-element.component.scss'
})
export class SmartElementComponent {
    title = model.required();
    editMode = model(false);
    innerColor = model('blue');

    editButtonIcon = model('pi pi-pencil');
    onEditClick = output<void>();

    deleteButtonIcon = model('pi pi-trash');
    onDeleteClick = output<void>();

    mainContent = contentChild<TemplateRef<any>>('main');
}

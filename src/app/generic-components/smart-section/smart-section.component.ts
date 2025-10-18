import { Component, contentChild, model, output, TemplateRef, input } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-smart-section',
    imports: [ButtonModule, CommonModule],
    templateUrl: './smart-section.component.html',
    styleUrl: './smart-section.component.scss'
})
export class SmartSectionComponent {
    title = model('');
    editMode = model(false);
    buttonIcon = model('pi pi-pencil');
    onAddClick = output<void>();

    mainContent = contentChild<TemplateRef<any>>('main');
    emptyContent = contentChild<TemplateRef<any>>('empty');
    rightContent = contentChild<TemplateRef<any>>('right');
}

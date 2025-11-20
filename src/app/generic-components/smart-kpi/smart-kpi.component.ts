import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
    selector: 'app-smart-kpi',
    imports: [CommonModule],
    templateUrl: './smart-kpi.component.html',
    styleUrl: './smart-kpi.component.scss'
})
export class SmartKpiComponent {
    title = input<string>();
    result = input<string>();
    icon = input<string>();
    styleClass = input<string>();
}

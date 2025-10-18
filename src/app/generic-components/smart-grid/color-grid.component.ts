import { Component, Input, Output, EventEmitter, input, model, computed } from '@angular/core';
import { ButtonModule } from 'primeng/button'; // Exemple avec PrimeNG
import { ICellRendererAngularComp } from '../../shared/models/TableColumn ';
import { Chip } from 'primeng/chip';
import { TooltipModule } from 'primeng/tooltip';
import { ColorPicker } from 'primeng/colorpicker';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-color-grid',
    standalone: true,
    imports: [Chip, TooltipModule, ColorPicker, FormsModule],
    template: `
        <div class="flex gap-1">
            @if (data()) {
                @if (params().editMode) {
                    <div class="flex items-center gap-1">
                        <p-chip [label]="data().name ?? ''" [style]="{ 'background-color': data().color ?? 'red' }" [pTooltip]="data().description ?? ''"> </p-chip>
                        <p-colorPicker [(ngModel)]="data().color" (input)="onColorChange($event)"> </p-colorPicker>
                    </div>
                } @else {
                    <p-chip [label]="data().name ?? ''" [style]="{ 'background-color': data().color ?? 'red' }" [pTooltip]="data().description ?? ''"> </p-chip>
                }
            }
        </div>
    `
})
export class ColorGridComponent implements ICellRendererAngularComp {
    data = model<any>({});
    params = model<any>({
        editMode: false,
        callback: (data: any) => {}
    });

    onColorChange($event: any) {
        this.data().color = $event.value;
        this.params().callback(this.data());
    }
}

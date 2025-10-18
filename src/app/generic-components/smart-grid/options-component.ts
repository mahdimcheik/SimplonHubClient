import { Component, Input, Output, EventEmitter, input, model, computed } from '@angular/core';
import { ButtonModule } from 'primeng/button'; // Exemple avec PrimeNG
import { ICellRendererAngularComp } from '../../shared/models/TableColumn ';
import { Chip } from 'primeng/chip';
import { TooltipModule } from 'primeng/tooltip';

@Component({
    selector: 'app-options-renderer',
    standalone: true,
    imports: [Chip, TooltipModule],
    template: `
        <div class="flex gap-1">
            @for (value of displayValue(); track value) {
                <p-chip [label]="value.name ?? value" [style]="{ 'background-color': value?.color ?? 'transparent' }" [pTooltip]="value?.description ?? ''"> </p-chip>
            } @empty {
                <p-chip [label]="'Aucun'" [style]="{ 'background-color': '#000' }" [pTooltip]="'Aucun'"> </p-chip>
            }
        </div>
    `
})
export class OptionsRendererComponent implements ICellRendererAngularComp {
    data = model<any>({});
    params = model<any>({});

    // Computed signal to extract and format the display value
    displayValue = computed(() => {
        const rowData = this.data();
        const cellParams = this.params();

        if (!rowData || !cellParams) {
            return [];
        }

        // Get the field name from params (should be passed via column definition)
        const field = cellParams.field;
        const options = cellParams.options || [];
        const optionValue = cellParams.optionValue || 'id';
        const optionLabel = cellParams.optionLabel || 'name';
        // Get the field value from the row
        const fieldValue = rowData[field];

        if (!fieldValue) {
            return [];
        }

        // If fieldValue is already an object with the display properties, return it
        if (typeof fieldValue === 'object' && fieldValue.name !== undefined) {
            return [fieldValue];
        }
        if (typeof fieldValue === 'string') {
            const matchedOption = options.find((opt: any) => opt[optionValue] === fieldValue);
            return [matchedOption];
        }
        if (Array.isArray(fieldValue) && fieldValue.length > 0) {
            return fieldValue.map((item: any) => {
                const matchedOption = options.filter((opt: any) => opt[optionValue] === item[optionValue]).map((opt: any) => opt[optionLabel]);
                return [...matchedOption];
            });
        }
        return [];
        // Otherwise, find the matching option from the options array
    });
}

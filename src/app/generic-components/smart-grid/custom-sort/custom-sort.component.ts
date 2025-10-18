import { Component, input, model, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SortOrder } from '../../../shared/models/TableColumn ';

@Component({
    selector: 'app-custom-sort',
    imports: [CommonModule],
    templateUrl: './custom-sort.component.html',
    styleUrl: './custom-sort.component.scss'
})
export class CustomSortComponent {
    // Input: initial sort value (1 = ascending, 0 = no sort, -1 = descending)
    sortValue = model<number>(0);

    // Output: emits new sort value when clicked
    sortChange = output<SortOrder>();

    /**
     * Handle click event to cycle through sort states
     * 0 (no sort) -> 1 (ascending) -> -1 (descending) -> 0 (no sort)
     */
    onSortClick(): void {
        const currentValue = this.sortValue();
        let newValue: number;

        if (currentValue === 0) {
            newValue = 1; // unsorted -> ascending
        } else if (currentValue === 1) {
            newValue = -1; // ascending -> descending
        } else {
            newValue = 0; // descending -> unsorted
        }

        this.sortChange.emit(newValue as SortOrder);
        this.sortValue.set(newValue);
    }

    /**
     * Get the appropriate icon class based on current sort state
     */
    getIconClass(): string {
        const currentValue = this.sortValue();

        if (currentValue === 1) {
            return 'pi pi-sort-amount-up-alt'; // ascending
        } else if (currentValue === -1) {
            return 'pi pi-sort-amount-down'; // descending
        } else {
            return 'pi pi-sort-alt'; // no sort
        }
    }
}

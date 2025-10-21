import { Component, effect, input, model, OnInit, output, signal, Type } from '@angular/core';
import { CustomTableState, DATE_FILTER_MATCH_MODES, DynamicColDef, ICellRendererAngularComp, INITIAL_STATE } from '../../shared/models/TableColumn ';
import { ActionButtonRendererComponent } from '../smart-grid/default-component';
import { InputTextModule } from 'primeng/inputtext';
import { DatePickerModule } from 'primeng/datepicker';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'app-smart-grid-modernized',
    imports: [InputTextModule, SelectModule, MultiSelectModule, ButtonModule, DatePickerModule, CommonModule, FormsModule],
    templateUrl: './smart-grid-modernized.component.html',
    styleUrl: './smart-grid-modernized.component.scss'
})
export class SmartGridModernizedComponent<T extends Record<string, any>> implements OnInit {
    data = model<T[]>([]);
    columns = model.required<DynamicColDef[]>();
    tableState = model<CustomTableState>(INITIAL_STATE);
    totalRecords = model<number>(0);
    loading = model(false);
    title = input<string>('');
    storageName = input<string>('');
    searchValue = signal<string>('');
    customComponents = model<{ [key: string]: Type<ICellRendererAngularComp> }>({});
    dateFilterMatchModes = DATE_FILTER_MATCH_MODES;

    // output
    onRowClick = output<T | T[] | undefined>();

    // Internal signals
    private componentMap = signal<{ [key: string]: Type<ICellRendererAngularComp> }>({
        default: ActionButtonRendererComponent
    });

    constructor() {
        effect(() => {
            const state = this.tableState();
        });
    }
    ngOnInit(): void {
        this.getStateFromLocalStorage();
        // Initialize component map with custom components
        const customComps = this.customComponents();
        this.componentMap.set({
            ...customComps,
            default: ActionButtonRendererComponent
        });
    }

    // ========== Filtering Methods ==========
    getFilterValue(field: string): any {
        return this.tableState().filters?.[field]?.value ?? null;
    }

    getDateFilterMatchMode(field: string): string {
        return this.tableState().filters?.[field]?.matchMode ?? 'dateIs';
    }

    onTextFilterChange(value: string, column: DynamicColDef): void {
        const filterField = column.filterField ?? column.field;
        this.updateFilter(filterField, value, 'contains', column.field, column.specialFilter);
    }

    onSelectFilterChange(value: any, column: DynamicColDef): void {
        const filterField = column.filterField ?? column.field;
        this.updateFilter(filterField, value, 'equals', column.field, column.specialFilter);
    }

    onArrayFilterChange(value: any[], column: DynamicColDef): void {
        const filterField = column.filterField ?? column.field;
        this.updateFilter(filterField, value, 'in', column.field, column.specialFilter);
    }

    onDateFilterChange(date: Date | null, column: DynamicColDef, matchMode?: string): void {
        const filterField = column.filterField ?? column.field;
        const mode = matchMode ?? this.getDateFilterMatchMode(filterField);
        this.updateFilter(filterField, date, mode, column.field, column.specialFilter);
    }

    onDateFilterMatchModeChange(matchMode: string, column: DynamicColDef): void {
        const filterField = column.filterField ?? column.field;
        const currentFilter = this.tableState().filters?.[filterField];
        if (currentFilter) {
            this.updateFilter(filterField, currentFilter.value, matchMode, column.field, currentFilter.specialFilter);
        }
    }

    clearFilter(column: DynamicColDef): void {
        const filterField = column.filterField ?? column.field;
        const filters = { ...this.tableState().filters };
        delete filters[filterField];

        this.tableState.update((state) => ({
            ...state,
            filters,
            first: 0
        }));
    }

    private updateFilter(filterField: string, value: any, matchMode: string, displayField?: string, specialFilter?: boolean): void {
        const filters = { ...this.tableState().filters };
        const fieldKey = displayField ?? filterField;

        if (value === null || value === undefined || value === '' || (Array.isArray(value) && value.length === 0)) {
            // Remove filter if value is empty
            delete filters[filterField];
        } else {
            filters[filterField] = { value, matchMode, specialFilter };
        }

        this.tableState.update((state) => ({
            ...state,
            filters,
            first: 0 // Reset to first page when filters change
        }));
        this.saveStateToLocalStorage();
    }

    // ========== Pagination Methods ==========
    onPageChange(event: any): void {
        this.tableState.update((state) => ({
            ...state,
            first: event.first,
            rows: event.rows
        }));
    }

    // global search
    onSearchChange($event: Event): void {
        const value = ($event.target as HTMLInputElement).value;
        this.searchValue.set(value);
        this.tableState.update((state) => ({
            ...state,
            search: value
        }));
    }

    // save state to localStorage
    saveStateToLocalStorage(): void {
        if (this.storageName()) {
            localStorage.setItem(this.storageName(), JSON.stringify(this.tableState()));
        }
    }

    getStateFromLocalStorage(): void {
        if (this.storageName()) {
            const state = localStorage.getItem(this.storageName());
            if (state) {
                this.tableState.set(JSON.parse(state));
            }
        }
    }
}

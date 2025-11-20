import { Component, computed, effect, input, model, OnInit, output, signal, Type } from '@angular/core';
import { CustomTableState, DATE_FILTER_MATCH_MODES, DynamicColDef, ICellRendererAngularComp, INITIAL_STATE, SortCriterion, SortOrder } from '../../shared/models/TableColumn ';
import { ActionButtonRendererComponent } from '../smart-grid/default-component';
import { InputTextModule } from 'primeng/inputtext';
import { DatePickerModule } from 'primeng/datepicker';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { CommonModule, NgComponentOutlet } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { CustomSortComponent } from '../smart-grid/custom-sort/custom-sort.component';
import { PopoverModule } from 'primeng/popover';
import { PaginatorModule } from 'primeng/paginator';

@Component({
    selector: 'app-smart-grid-modernized',
    imports: [TableModule, InputTextModule, CustomSortComponent, PaginatorModule, PopoverModule, SelectModule, MultiSelectModule, ButtonModule, DatePickerModule, CommonModule, FormsModule, NgComponentOutlet],
    templateUrl: './smart-grid-modernized.component.html',
    styleUrl: './smart-grid-modernized.component.scss'
})
export class SmartGridModernizedComponent<T extends Record<string, any>> implements OnInit {
    data = model<T[]>([]);
    columns = model.required<DynamicColDef[]>();
    tableState = model<CustomTableState>(INITIAL_STATE);
    totalRecords = model<number>(0);
    loading = model(false);
    height = input<string>('1000px');
    heightNumber = computed(() => parseInt(this.height().replace('px', ''), 10));
    title = input<string>('');
    storageName = input<string>('');
    searchValue = signal<string>('');
    customComponents = model<{ [key: string]: Type<ICellRendererAngularComp> }>({});
    itemRendererComponent = input<Type<ICellRendererAngularComp>>(); // Component to render each data item
    itemRendererComponentParams = input<any>();
    itemPropertyName = input<string>(); // Optional: property name to pass data to the component (e.g., 'user', 'product')
    dateFilterMatchModes = DATE_FILTER_MATCH_MODES;
    lineItemComponent = input<Type<ICellRendererAngularComp>>();
    styleClass = input<string>('');

    // output
    onRowClick = output<T | T[] | undefined>();

    // Internal signals
    private componentMap = signal<{ [key: string]: Type<ICellRendererAngularComp> }>({
        default: ActionButtonRendererComponent
    });

    constructor() {
        this.getStateFromLocalStorage();
        // Initialize component map with custom components
        const customComps = this.customComponents();
        this.componentMap.set({
            ...customComps,
            default: ActionButtonRendererComponent
        });
    }

    ngOnInit(): void {}

    // ========== Component Rendering ==========
    getComponent(templateName: string | Type<ICellRendererAngularComp>): Type<ICellRendererAngularComp> {
        if (typeof templateName === 'string') {
            return this.componentMap()[templateName] || this.componentMap()['default'];
        }
        return templateName;
    }

    getSortOrderForField(field: string): SortOrder {
        const sortCriterion = this.tableState().sorts.find((s) => s.field === field);
        return sortCriterion?.order ?? 0;
    }

    sortChange(order: SortOrder, column: DynamicColDef): void {
        const sortField = column.sortField ?? column.field;
        const currentSorts = [...this.tableState().sorts];
        const sortMap = new Map<string, SortCriterion>(currentSorts.map((s) => [s.field, s]));

        if (order === 0) {
            // Remove sort
            sortMap.delete(sortField);
        } else {
            // Add or update sort
            sortMap.set(sortField, { field: sortField, order });
        }

        this.tableState.update((state) => ({
            ...state,
            sorts: Array.from(sortMap.values()),
            first: 0 // Reset to first page when sorting changes
        }));
        this.saveStateToLocalStorage();
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

    resetFilter(): void {
        console.log('Clear Filter:');

        this.tableState.update((state) => ({
            ...state,
            filters: {},
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

    // Helper method to create inputs for the dynamic component
    getComponentInputs(item: T): Record<string, any> {
        // If itemPropertyName is explicitly provided, use it
        if (this.itemPropertyName()) {
            return { [this.itemPropertyName()!]: item };
        }

        // Otherwise, try to infer the property name from the component name
        // For CardUserComponent, it expects a 'user' input
        const componentName = this.itemRendererComponent()?.name.toLowerCase() || '';

        // Try to infer the property name from the component name
        // e.g., CardUserComponent -> user, CardProductComponent -> product
        let propertyName = 'data'; // default fallback

        if (componentName.includes('user')) {
            propertyName = 'user';
        } else if (componentName.includes('product')) {
            propertyName = 'product';
        } else if (componentName.includes('item')) {
            propertyName = 'item';
        }

        return { [propertyName]: item };
    }
}

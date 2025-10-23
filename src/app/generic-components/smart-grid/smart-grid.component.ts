import { CommonModule } from '@angular/common';
import { Component, computed, contentChild, effect, input, model, OnInit, output, signal, TemplateRef, Type } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { TableModule } from 'primeng/table';
import { CustomTableState, DATE_FILTER_MATCH_MODES, DynamicColDef, ICellRendererAngularComp, INITIAL_STATE, SortCriterion, SortOrder } from '../../shared/models/TableColumn ';
import { ActionButtonRendererComponent } from './default-component';
import { CustomSortComponent } from './custom-sort/custom-sort.component';
import { DatePickerModule } from 'primeng/datepicker';
import { ButtonModule } from 'primeng/button';
import { PopoverModule } from 'primeng/popover';
import { PaginatorModule } from 'primeng/paginator';
@Component({
    selector: 'app-smart-grid',
    imports: [TableModule, TagModule, PaginatorModule, IconFieldModule, InputTextModule, InputIconModule, MultiSelectModule, SelectModule, CommonModule, CustomSortComponent, DatePickerModule, FormsModule, ButtonModule, PopoverModule],
    templateUrl: './smart-grid.component.html',
    styleUrl: './smart-grid.component.scss'
})
export class SmartGridComponent<T extends Record<string, any>> implements OnInit {
    // Input models
    tableState = model<CustomTableState>(INITIAL_STATE);
    customComponents = model<{ [key: string]: Type<ICellRendererAngularComp> }>({});
    data = model<T[]>([]);
    title = input<string>('');
    totalRecords = model<number>(0);
    loading = model(false);
    columns = model.required<DynamicColDef[]>();
    searchValue = signal<string>('');
    height = input<string>('1000px');
    editMode = model<boolean>(false);
    storageName = input<string>('');
    heightToSubtractPx = input<string>('185px');
    // Content children
    rightContent = contentChild<TemplateRef<any>>('right');
    leftContent = contentChild<TemplateRef<any>>('left');

    // output
    onRowClick = output<T | T[] | undefined>();

    // Internal signals
    private componentMap = signal<{ [key: string]: Type<ICellRendererAngularComp> }>({
        default: ActionButtonRendererComponent
    });

    // Date filter configuration
    dateFilterMatchModes = DATE_FILTER_MATCH_MODES;

    constructor() {
        // Debug effect to monitor state changes
        effect(() => {
            const state = this.tableState();
            console.log('Table State Changed:', {
                filters: state.filters,
                sorts: state.sorts,
                first: state.first,
                rows: state.rows
            });
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

    // ========== Component Rendering ==========
    getComponent(templateName: string | Type<ICellRendererAngularComp>): Type<ICellRendererAngularComp> {
        if (typeof templateName === 'string') {
            return this.componentMap()[templateName] || this.componentMap()['default'];
        }
        return templateName;
    }

    // ========== Sorting Methods ==========
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
    }

    getSortOrderForField(field: string): SortOrder {
        const sortCriterion = this.tableState().sorts.find((s) => s.field === field);
        return sortCriterion?.order ?? 0;
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

import { CustomTableState } from '../../shared/models/TableColumn ';

/**
 * OData Query Builder
 * Converts CustomTableState to OData query parameters
 */
export class ODataQueryBuilder {
    /**
     * Build complete OData query parameters from table state
     */
    static buildQuery(state: CustomTableState): ODataQueryParams {
        return {
            $filter: this.buildFilter(state.filters),
            $orderby: this.buildOrderBy(state.sorts),
            $top: state.rows,
            $skip: state.first,
            $count: true
        };
    }

    /**
     * Build OData $filter string from filters
     * @example { name: { value: 'John', matchMode: 'contains' } } => "contains(tolower(name), 'john')"
     */
    static buildFilter(filters?: { [key: string]: { value: any; matchMode: string } }): string | undefined {
        if (!filters || Object.keys(filters).length === 0) {
            return undefined;
        }

        const filterExpressions = Object.entries(filters)
            .map(([field, filter]) => this.buildFilterExpression(field, filter.value, filter.matchMode))
            .filter((expr) => expr !== null);

        return filterExpressions.length > 0 ? filterExpressions.join(' and ') : undefined;
    }

    /**
     * Build single filter expression
     */
    private static buildFilterExpression(field: string, value: any, matchMode: string): string | null {
        if (value === null || value === undefined || value === '') {
            return null;
        }

        switch (matchMode) {
            case 'contains':
                // OData v4: contains(tolower(field), 'value')
                return `contains(tolower(${field}), '${this.escapeODataString(value.toString().toLowerCase())}')`;

            case 'equals':
                if (typeof value === 'string') {
                    return `${field} eq '${this.escapeODataString(value)}'`;
                }
                return `${field} eq ${value}`;

            case 'in':
                // For array of values: field in ('value1', 'value2')
                if (Array.isArray(value) && value.length > 0) {
                    const values = value.map((v) => `'${this.escapeODataString(v)}'`).join(', ');
                    return `${field} in (${values})`;
                }
                return null;

            case 'dateIs':
                // date(field) eq date(value)
                return `date(${field}) eq ${this.formatODataDate(value)}`;

            case 'dateBefore':
                // field lt date
                return `${field} lt ${this.formatODataDateTime(value)}`;

            case 'dateAfter':
                // field gt date
                return `${field} gt ${this.formatODataDateTime(value)}`;

            case 'startsWith':
                return `startswith(tolower(${field}), '${this.escapeODataString(value.toString().toLowerCase())}')`;

            case 'endsWith':
                return `endswith(tolower(${field}), '${this.escapeODataString(value.toString().toLowerCase())}')`;

            case 'notEquals':
                if (typeof value === 'string') {
                    return `${field} ne '${this.escapeODataString(value)}'`;
                }
                return `${field} ne ${value}`;

            case 'greaterThan':
                return `${field} gt ${value}`;

            case 'lessThan':
                return `${field} lt ${value}`;

            case 'greaterThanOrEqual':
                return `${field} ge ${value}`;

            case 'lessThanOrEqual':
                return `${field} le ${value}`;

            default:
                console.warn(`Unknown match mode: ${matchMode}`);
                return null;
        }
    }

    /**
     * Build OData $orderby string from sorts
     * @example [{ field: 'name', order: 1 }] => "name asc"
     */
    static buildOrderBy(sorts?: Array<{ field: string; order: number }>): string | undefined {
        if (!sorts || sorts.length === 0) {
            return undefined;
        }

        return sorts
            .filter((sort) => sort.order !== 0)
            .map((sort) => `${sort.field} ${sort.order === 1 ? 'asc' : 'desc'}`)
            .join(', ');
    }

    /**
     * Build query string from OData params
     * @example { $filter: "name eq 'John'", $top: 10 } => "?$filter=name eq 'John'&$top=10"
     */
    static toQueryString(params: ODataQueryParams): string {
        const queryParts: string[] = [];

        if (params.$filter) {
            queryParts.push(`$filter=${encodeURIComponent(params.$filter)}`);
        }
        if (params.$orderby) {
            queryParts.push(`$orderby=${encodeURIComponent(params.$orderby)}`);
        }
        if (params.$top !== undefined) {
            queryParts.push(`$top=${params.$top}`);
        }
        if (params.$skip !== undefined && params.$skip > 0) {
            queryParts.push(`$skip=${params.$skip}`);
        }
        if (params.$count) {
            queryParts.push(`$count=true`);
        }
        if (params.$select) {
            queryParts.push(`$select=${params.$select}`);
        }
        if (params.$expand) {
            queryParts.push(`$expand=${params.$expand}`);
        }

        return queryParts.length > 0 ? `?${queryParts.join('&')}` : '';
    }

    /**
     * Escape single quotes in OData strings
     */
    private static escapeODataString(value: string): string {
        return value.replace(/'/g, "''");
    }

    /**
     * Format date for OData date() function
     * @example 2024-01-15
     */
    private static formatODataDate(date: Date | string): string {
        const d = new Date(date);
        return d.toISOString().split('T')[0];
    }

    /**
     * Format datetime for OData
     * @example 2024-01-15T10:30:00Z
     */
    private static formatODataDateTime(date: Date | string): string {
        const d = new Date(date);
        return d.toISOString();
    }
}

/**
 * OData Query Parameters
 */
export interface ODataQueryParams {
    $filter?: string;
    $orderby?: string;
    $top?: number;
    $skip?: number;
    $count?: boolean;
    $select?: string;
    $expand?: string;
}

/**
 * OData Response wrapper
 */
export interface ODataResponse<T> {
    '@odata.context'?: string;
    '@odata.count'?: number;
    value: T[];
}

/**
 * Helper to extract data and count from OData response
 */
export function parseODataResponse<T>(response: ODataResponse<T>): { data: T[]; totalCount: number } {
    return {
        data: response.value || [],
        totalCount: response['@odata.count'] || response.value?.length || 0
    };
}

import { Component, computed, effect, inject, linkedSignal, OnInit, signal, Type } from '@angular/core';
import { SmartGridModernizedComponent } from '../../../../generic-components/smart-grid-modernized/smart-grid-modernized.component';
import { TeacherCardComponent } from './teacher-card/teacher-card.component';
import { LanguageResponseDTO, RoleAppResponseDTO, StatusAccountDTO, TeacherResponseDTO, UserResponseDTO } from '../../../../../api';
import { CustomTableState, DynamicColDef, ICellRendererAngularComp, INITIAL_STATE } from '../../../../generic-components/smart-grid';
import { FavoritesMainService } from '../../../../shared/services/favorites-main.service';
import { UserMainService } from '../../../../shared/services/userMain.service';
import { firstValueFrom } from 'rxjs';

@Component({
    selector: 'app-student-favorites',
    imports: [SmartGridModernizedComponent, TeacherCardComponent],
    templateUrl: './student-favorites.component.html',
    styleUrl: './student-favorites.component.scss'
})
export class StudentFavoritesComponent {
    favoritesService = inject(FavoritesMainService);
    userService = inject(UserMainService);

    favorites = this.favoritesService.favorites;
    teachers = linkedSignal(() => this.favorites().map((favorite) => favorite.teacher!));
    customComponents = signal<{ [key: string]: Type<ICellRendererAngularComp> }>({});
    filterParams = signal<CustomTableState>(INITIAL_STATE);
    totalRecords = signal(0);
    loading = signal(false);
    // Options for filters
    statuses = signal<StatusAccountDTO[]>([]);
    roles = signal<RoleAppResponseDTO[]>([]);
    languages = signal<LanguageResponseDTO[]>([]);
    forceRender = signal(false);

    columns = computed<DynamicColDef[]>(() => {
        const statuses = this.statuses();
        const roles = this.roles();
        const languages = this.languages();
        return [
            {
                field: 'lastName',
                header: 'Nom de famille',
                type: 'text',
                sortable: true,
                sortField: 'lastName',
                filterable: true,
                width: '200px'
            },
            {
                field: 'email',
                header: 'Email',
                type: 'text',
                sortable: true,
                sortField: 'email',
                filterable: true
            },
            {
                field: 'userLanguages',
                header: 'Langues',
                type: 'array',
                options: this.languages(),
                optionLabel: 'name',
                optionValue: 'id',
                filterable: true,
                filterField: 'languages/Id',
                cellRenderer: 'options',
                cellRendererParams: {
                    field: 'userLanguages',
                    options: this.languages(),
                    optionLabel: 'name',
                    optionValue: 'id'
                }
            },
            {
                field: 'TeacherCursuses/name',
                header: 'Cursuses',
                type: 'text',
                filterable: true,
                width: '200px'
            }
        ];
    });

    teacherCardComponent = TeacherCardComponent;

    constructor() {
        this.getStatuses();
        this.getLanguages();
        effect(() => {
            const _ = this.forceRender();
            const filters = this.filterParams();
            this.favoritesService.getAllFavorites(filters);
        });
    }

    async getStatuses() {
        this.statuses.set([]);
        const response = await firstValueFrom(
            this.userService.getStatusAccount({
                first: 0,
                rows: 10,
                sorts: [],
                filters: {}
            } as CustomTableState)
        );
        this.statuses.set(response.data ?? []);
        return response.data ?? [];
    }
    async getLanguages() {
        this.languages.set([]);
        const response = await firstValueFrom(
            this.userService.getLanguages({
                first: 0,
                rows: 10,
                sorts: [],
                filters: {}
            } as CustomTableState)
        );
        this.languages.set(response.data ?? []);
        return response.data ?? [];
    }

    async loadData() {
        const filters = this.filterParams();
        const favorites = await this.favoritesService.getAllFavorites(filters);
    }
    resetFilter() {
        this.forceRender.set(!this.forceRender());
    }
}

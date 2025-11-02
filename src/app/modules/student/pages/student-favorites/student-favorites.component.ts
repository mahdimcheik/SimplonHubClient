import { Component, effect, inject, OnInit, signal, Type } from '@angular/core';
import { SmartGridModernizedComponent } from '../../../../generic-components/smart-grid-modernized/smart-grid-modernized.component';
import { TeacherCardComponent } from './teacher-card/teacher-card.component';
import { UserResponseDTO } from '../../../../../api';
import { CustomTableState, DynamicColDef, ICellRendererAngularComp, INITIAL_STATE } from '../../../../generic-components/smart-grid';
import { FavoritesMainService } from '../../../../shared/services/favorites-main.service';

@Component({
    selector: 'app-student-favorites',
    imports: [SmartGridModernizedComponent, TeacherCardComponent],
    templateUrl: './student-favorites.component.html',
    styleUrl: './student-favorites.component.scss'
})
export class StudentFavoritesComponent {
    favoritesService = inject(FavoritesMainService);

    teachers = signal<UserResponseDTO[]>([]);
    columns = signal<DynamicColDef[]>([]);
    customComponents = signal<{ [key: string]: Type<ICellRendererAngularComp> }>({});
    filterParams = signal<CustomTableState>(INITIAL_STATE);
    totalRecords = signal(0);
    loading = signal(false);

    teacherCardComponent = TeacherCardComponent;

    constructor() {
        effect(() => {
            const filters = this.filterParams();
            this.favoritesService.getAllFavorites(filters);
        });
    }

    async loadData() {
        const filters = this.filterParams();
        const favorites = await this.favoritesService.getAllFavorites(filters);
        this.teachers.set(favorites?.map((favorite) => favorite.teacher!) || []);
    }
}

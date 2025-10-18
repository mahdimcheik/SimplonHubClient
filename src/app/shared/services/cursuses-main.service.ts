import { inject, Injectable, signal } from '@angular/core';
import { CategoryCursusResponseDTO, CategoryCursusService, Cursus, CursusCategoryDTO, CursusCreateDTO, CursusResponseDTO, CursusService, CursusUpdateDTO, LevelCursusCreateDTO, LevelCursusDTO, LevelCursusService } from '../../../api';
import { firstValueFrom } from 'rxjs';
import { CustomTableState } from '../models/TableColumn ';

@Injectable({
    providedIn: 'root'
})
export class CursusesMainService {
    cursusService = inject(CursusService);
    cursusCategoriesService = inject(CategoryCursusService);
    cursusLevelsService = inject(LevelCursusService);

    cursuses = signal<CursusResponseDTO[]>([]);
    allCategories = signal<CategoryCursusResponseDTO[]>([]);
    allLevels = signal<LevelCursusDTO[]>([]);

    // cursus d'un utilisateur
    async getAllCursusesByUser(teacherId: string) {
        const cursuses = await firstValueFrom(this.cursusService.cursusTeacherTeacherIdGet(teacherId));
        this.cursuses.set(cursuses.data || []);
        return cursuses.data || [];
    }

    async getAllCursusesByUserPaginated(filters: CustomTableState) {
        const cursuses = await firstValueFrom(this.cursusService.cursusAllPaginatedPost(filters));
        this.cursuses.set(cursuses.data || []);
        return cursuses.data || [];
    }

    async createCursus(cursus: CursusCreateDTO) {
        const newCursus = await firstValueFrom(this.cursusService.cursusCreatePost(cursus));
        this.cursuses.update((current) => [...current, newCursus.data!]);
        return newCursus.data;
    }

    async updateCursus(cursusId: string, cursus: CursusUpdateDTO) {
        const updatedCursus = await firstValueFrom(this.cursusService.cursusUpdateIdPut(cursusId, cursus));
        this.cursuses.update((current) => current.map((c) => (c.id === cursusId ? updatedCursus.data! : c)));
        return updatedCursus.data;
    }

    async deleteCursus(cursusId: string) {
        await firstValueFrom(this.cursusService.cursusDeleteIdDelete(cursusId));
        this.cursuses.update((current) => current.filter((c) => c.id !== cursusId));
    }

    // toutes les catégories de cursus
    async loadAllCategories() {
        if (this.allCategories().length === 0) {
            const categories = await firstValueFrom(this.cursusCategoriesService.categorycursusAllGet());
            this.allCategories.set(categories.data || []);
        }
    }

    async getCategoryById(categoryId: string) {
        const category = await firstValueFrom(this.cursusCategoriesService.categorycursusIdGet(categoryId));
        return category.data;
    }

    async addCategory(category: CursusCreateDTO) {
        const newCategory = await firstValueFrom(this.cursusCategoriesService.categorycursusCreatePost(category));
        this.allCategories.update((current) => [...current, newCategory.data!]);
        return newCategory.data;
    }

    async updateCategory(categoryId: string, category: CursusUpdateDTO) {
        const updatedCategory = await firstValueFrom(this.cursusCategoriesService.categorycursusUpdateIdPut(categoryId, category));
        this.allCategories.update((current) => current.map((c) => (c.id === categoryId ? updatedCategory.data! : c)));
        return updatedCategory.data;
    }

    // tous les niveaux de cursus
    async loadAllLevels() {
        if (this.allLevels().length === 0) {
            const levels = await firstValueFrom(this.cursusLevelsService.levelcursusAllGet());
            this.allLevels.set(levels.data || []);
        }
    }

    async getLevelById(levelId: string) {
        const level = await firstValueFrom(this.cursusLevelsService.levelcursusIdGet(levelId));
        return level.data;
    }

    async addLevel(level: LevelCursusCreateDTO) {
        const newLevel = await firstValueFrom(this.cursusLevelsService.levelcursusCreatePost(level));
        this.allLevels.update((current) => [...current, newLevel.data!]);
        return newLevel.data;
    }

    async getCursusByTeacher(teacherId: string) {
        const cursuses = await firstValueFrom(this.cursusService.cursusTeacherTeacherIdGet(teacherId));
        this.cursuses.set(cursuses.data || []);
        return cursuses.data || [];
    }
}

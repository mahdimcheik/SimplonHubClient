import { inject, Injectable, signal } from '@angular/core';
import { FormationCreateDTO, FormationResponseDTO, FormationsService, FormationUpdateDTO } from '../../../api';
import { firstValueFrom } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class FormationsMainService {
    formationsService = inject(FormationsService);
    formations = signal<FormationResponseDTO[]>([]);

    // Get formations by user
    async getAllFormationsByUser(userId: string) {
        const formations = await firstValueFrom(this.formationsService.formationsUserUserIdGet(userId));
        this.formations.set(formations.data || []);
        return formations.data || [];
    }

    async createFormation(formation: FormationCreateDTO) {
        const newFormation = await firstValueFrom(this.formationsService.formationsCreatePost(formation));
        this.formations.update((current) => [...current, newFormation.data!]);
        return newFormation.data;
    }

    async updateFormation(formationId: string, formation: FormationUpdateDTO) {
        const updatedFormation = await firstValueFrom(this.formationsService.formationsUpdateIdPut(formationId, formation));
        this.formations.update((current) => current.map((form) => (form.id === formationId ? updatedFormation.data! : form)));
        return updatedFormation.data;
    }

    async deleteFormation(formationId: string) {
        await firstValueFrom(this.formationsService.formationsDeleteIdDelete(formationId));
        this.formations.update((current) => current.filter((form) => form.id !== formationId));
    }

    async getFormationById(formationId: string) {
        const formation = await firstValueFrom(this.formationsService.formationsIdGet(formationId));
        return formation.data;
    }

    // Convenience method to get formations by current user (if needed)
    async getFormationsByUser(userId: string) {
        return this.getAllFormationsByUser(userId);
    }
}

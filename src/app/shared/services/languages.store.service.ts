import { inject, Injectable, signal } from '@angular/core';
import { LanguageCreateDTO, LanguageResponseDTO, LanguagesService, LanguageUpdateDTO, ProgrammingLanguageResponseDTO, ProgrammingLanguagesService } from '../../../api';
import { firstValueFrom } from 'rxjs';
import { languagesOptions, programmingLanguagesOptions } from './constants';
import { CustomTableState } from '../models/TableColumn ';

@Injectable({
    providedIn: 'root'
})
export class LanguagesMainService {
    languagesService = inject(LanguagesService);
    programminglanguageService = inject(ProgrammingLanguagesService);

    // languages and programming languages signals pour un utilisateur
    languages = signal<LanguageResponseDTO[]>([]);
    programmingLanguages = signal<LanguageResponseDTO[]>([]);

    allLanguages = signal<LanguageResponseDTO[]>([]);
    allProgrammingLanguages = signal<ProgrammingLanguageResponseDTO[]>([]);

    async loadLanguages() {
        if (this.allLanguages().length === 0) {
            const langs = await firstValueFrom(
                this.languagesService.languagesAllPost({
                    first: 0,
                    rows: 10,
                    sorts: [],
                    filters: {}
                } as CustomTableState)
            );
            this.allLanguages.set(langs.data || []);
        }
    }

    async loadProgrammingLanguages() {
        if (this.allProgrammingLanguages().length === 0) {
            const langs = await firstValueFrom(this.programminglanguageService.programminglanguagesAllGet());
            this.allProgrammingLanguages.set(langs.data || []);
        }
    }

    async getLanguageByUserId(userId: string) {
        const langs = await firstValueFrom(this.languagesService.languagesUserUserIdGet(userId));
        this.languages.set(langs.data || []);
        return langs.data || [];
    }

    async getProgrammingLanguageByUserId(userId: string) {
        const langs = await firstValueFrom(this.programminglanguageService.programminglanguagesUserUserIdGet(userId));
        this.programmingLanguages.set(langs.data || []);
        return langs.data || [];
    }

    async updateLanguagesByUserId(languages: string[]) {
        const newLanguages = await firstValueFrom(this.languagesService.languagesUserUpdateLanguagesPost(languages));
        this.languages.set(newLanguages.data || []);
    }

    // admin methods
    async createLanguage(language: LanguageCreateDTO) {
        const newLanguage = await firstValueFrom(this.languagesService.languagesCreatePost(language));
        this.allLanguages.update((current) => [...current, newLanguage.data!]);
        return newLanguage.data;
    }

    async updateLanguage(languageId: string, language: LanguageUpdateDTO) {
        const updatedLanguage = await firstValueFrom(this.languagesService.languagesUpdateIdPut(languageId, language));
        this.allLanguages.update((current) => current.map((lang) => (lang.id === languageId ? updatedLanguage.data! : lang)));
        return updatedLanguage.data;
    }
}

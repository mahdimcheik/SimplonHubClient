import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { Image } from 'primeng/image';
import { TeacherResponseDTO } from '../../../../../api';
import { ChipsListComponent } from '../../../../generic-components/chips-list/chips-list.component';
import { SmartSectionComponent } from '../../../../generic-components/smart-section/smart-section.component';
import { LanguagesMainService } from '../../../../shared/services/languages.store.service';
import { UserMainService } from '../../../../shared/services/userMain.service';

@Component({
    selector: 'app-candidat-detail',
    imports: [SmartSectionComponent, Image, ChipsListComponent],
    templateUrl: './candidat-detail.component.html',
    styleUrl: './candidat-detail.component.scss'
})
export class CandidatDetailComponent implements OnInit {
    activatedRoute = inject(ActivatedRoute);
    destroyRef = inject(DestroyRef);
    userService = inject(UserMainService);
    languagesService = inject(LanguagesMainService);

    user = signal<TeacherResponseDTO | null>(null);
    programmingLanguages = this.languagesService.programmingLanguages;
    languages = this.languagesService.languages;

    ngOnInit(): void {
        this.activatedRoute.params.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
            const candidatId = params['id'];
            console.log('candidat id', candidatId);

            if (candidatId) {
                this.loadUserData(candidatId);
            }
        });
    }

    async loadUserData(candidatId: string) {
        const response = await this.userService.getPublicInformations(candidatId);
        this.user.set(response.data as TeacherResponseDTO);
        await this.languagesService.getLanguageByUserId(candidatId);
        await this.languagesService.getProgrammingLanguageByUserId(candidatId);
    }
}

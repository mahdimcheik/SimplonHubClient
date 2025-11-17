import { Component, computed, inject, model, OnInit, signal } from '@angular/core';
import { BaseCardComponent } from '../../../../../generic-components/base-card/base-card.component';
import { FavoriteResponseDTO, LanguageResponseDTO, ProgrammingLanguage, TeacherResponseDTO, UserResponseDTO } from '../../../../../../api';
import { ImageModule } from 'primeng/image';
import { ICellRendererAngularComp } from '../../../../../generic-components/smart-grid';
import { ChipModule } from 'primeng/chip';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
import { ConfirmModalComponent } from '../../../../../generic-components/confirm-modal/confirm-modal.component';
import { FavoritesMainService } from '../../../../../shared/services/favorites-main.service';
import { TooltipClasses, TooltipModule } from 'primeng/tooltip';

@Component({
    selector: 'app-teacher-card',
    imports: [BaseCardComponent, ImageModule, ChipModule, ButtonModule, ConfirmModalComponent, TooltipModule],
    templateUrl: './teacher-card.component.html',
    styleUrl: './teacher-card.component.scss'
})
export class TeacherCardComponent implements ICellRendererAngularComp, OnInit {
    router = inject(Router);
    favoritesService = inject(FavoritesMainService);

    showConfirmModal = signal<boolean>(false);
    data = model<FavoriteResponseDTO>();
    params = model<{ resetFilter: () => void }>();
    teacher = computed<TeacherResponseDTO | undefined>(() => this.data()?.teacher!);
    programmingLanguages = computed<ProgrammingLanguage[]>(() => this.teacher()?.programmingLanguages?.slice(0, 3) ?? []);
    languages = computed<LanguageResponseDTO[]>(() => this.teacher()?.languages?.slice(0, 3) ?? []);

    ngOnInit(): void {}

    seeProfile() {
        this.router.navigate(['/teacher/profile/', this.teacher()?.id]);
    }
    goBookPage($event: Event) {
        $event.preventDefault();
        $event.stopPropagation();
        this.router.navigate(['/student/calendar-student'], { queryParams: { teacherId: this.teacher()?.id } });
    }

    showconfirmModal($event: Event) {
        $event.preventDefault();
        $event.stopPropagation();
        this.showConfirmModal.set(true);
    }
    closeConfirmModal() {
        this.showConfirmModal.set(false);
    }
    async confirm() {
        await this.favoritesService.removeFavorite(this.teacher()?.id ?? '');
        this.params()?.resetFilter?.();
        this.showConfirmModal.set(false);
    }
}

import { CommonModule } from '@angular/common';
import { Component, computed, inject, linkedSignal, model, output, signal, WritableSignal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { Image } from 'primeng/image';
import { TeacherResponseDTO, UserResponseDTO } from '../../../../../../api/models';
import { CustomTableState, ICellRendererAngularComp } from '../../../../../generic-components/smart-grid';
import { Router } from '@angular/router';
import { ChipModule } from 'primeng/chip';
import { FavoritesMainService } from '../../../../../shared/services/favorites-main.service';
import { ConfirmModalComponent } from '../../../../../generic-components/confirm-modal/confirm-modal.component';

@Component({
    selector: 'app-card-user',
    imports: [ButtonModule, Image, CommonModule, ChipModule, ConfirmModalComponent],
    templateUrl: './card-user.component.html',
    styleUrl: './card-user.component.scss'
})
export class CardUserComponent implements ICellRendererAngularComp {
    router = inject(Router);
    favoritesService = inject(FavoritesMainService);

    showConfirmModal = signal<boolean>(false);
    confirmModalTitle = computed(() => `Confirmation ${this.data().isFavorite ? 'de suppression' : "d'ajout"}`);
    confirmModalQuestion = computed(() => `Êtes-vous sûr de vouloir ${this.data().isFavorite ? 'supprimer' : 'ajouter'} ce professeur de vos favoris?`);
    confirmModalConfirmText = computed(() => ` ${this.data().isFavorite ? 'Supprimer' : 'Ajouter'} ${this.data().isFavorite ? 'de' : 'à'} vos favoris?`);
    confirmModalCancelText = 'Annuler';
    confirmModalSeverity = computed(() => (this.data().isFavorite ? 'danger' : 'success'));
    data = model.required<TeacherResponseDTO>();
    params = model<{ resetFilter: () => void }>();

    roles = computed(() =>
        this.data()
            .roles?.map((role) => role.displayName)
            .join(', ')
    );

    languages = computed(() => this.data().languages);
    programmingLanguages = computed(() => this.data().programmingLanguages);
    onShowMore = output<TeacherResponseDTO>();
    onFavorites = output<TeacherResponseDTO>();

    onViewClick($event: Event) {
        $event.preventDefault();
        $event.stopPropagation();
        this.onShowMore.emit(this.data());
        this.router.navigate(['/teacher/profile/', this.data().id]);
    }
    bookAppointment($event: Event) {
        $event.preventDefault();
        $event.stopPropagation();
        this.router.navigate(['/student/calendar-student'], { queryParams: { teacherId: this.data().id } });
    }
    closeConfirmModal() {
        this.showConfirmModal.set(false);
    }
    async confirm() {
        if (this.data().isFavorite) {
            await this.removeFromFavorites();
        } else {
            await this.addToFavorites();
        }
        this.params()?.resetFilter?.();
        this.showConfirmModal.set(false);
    }

    async addToFavorites() {
        await this.favoritesService.addFavorite(this.data().id);
    }

    async removeFromFavorites() {
        await this.favoritesService.removeFavorite(this.data().id);
    }
}

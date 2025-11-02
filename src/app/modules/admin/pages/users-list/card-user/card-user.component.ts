import { CommonModule } from '@angular/common';
import { Component, computed, inject, model, output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { Image } from 'primeng/image';
import { UserResponseDTO } from '../../../../../../api/models';
import { ICellRendererAngularComp } from '../../../../../generic-components/smart-grid';
import { Router } from '@angular/router';
import { ChipModule } from 'primeng/chip';
import { FavoritesMainService } from '../../../../../shared/services/favorites-main.service';

@Component({
    selector: 'app-card-user',
    imports: [ButtonModule, Image, CommonModule, ChipModule],
    templateUrl: './card-user.component.html',
    styleUrl: './card-user.component.scss'
})
export class CardUserComponent implements ICellRendererAngularComp {
    router = inject(Router);
    favoritesService = inject(FavoritesMainService);

    data = model.required<UserResponseDTO>();
    roles = computed(() =>
        this.data()
            .roles?.map((role) => role.displayName)
            .join(', ')
    );
    languages = computed(() => this.data().languages);
    programmingLanguages = computed(() => this.data().programmingLanguages);
    onShowMore = output<UserResponseDTO>();
    onFavorites = output<UserResponseDTO>();

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

    async addToFavorites() {
        await this.favoritesService.addFavorite(this.data().id);
    }
}

import { inject, Injectable, signal } from '@angular/core';
import { FavoriteDynamicFilters, FavoriteResponseDTO, FavoritesService, TeacherResponseDTO, UserResponseDTO } from '../../../api';
import { firstValueFrom } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class FavoritesMainService {
    favoritesService = inject(FavoritesService);

    favorites = signal<FavoriteResponseDTO[]>([]);

    async getAllFavorites(filters: FavoriteDynamicFilters) {
        const favorites = await firstValueFrom(this.favoritesService.favoritesMyFavoritesPost(filters));
        this.favorites.set(favorites.data || []);
        return favorites.data;
    }
    async addFavorite(teacherId: string, note: string) {
        const favorite = await firstValueFrom(this.favoritesService.favoritesAddPost({ teacherId, note }));
        return favorite.data;
    }
    async removeFavorite(favoriteId: string) {
        const favorite = await firstValueFrom(this.favoritesService.favoritesRemoveIdDelete(favoriteId));
        return favorite.data;
    }
}

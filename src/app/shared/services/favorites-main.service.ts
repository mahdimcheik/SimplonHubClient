import { inject, Injectable, signal } from '@angular/core';
import { FavoriteDynamicFilters, FavoriteResponseDTO, FavoritesService, UserResponseDTO } from '../../../api';
import { firstValueFrom } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class FavoritesMainService {
    favoritesService = inject(FavoritesService);

    favorites = signal<UserResponseDTO[]>([]);

    async getAllFavorites(filters: FavoriteDynamicFilters) {
        const favorites = await firstValueFrom(this.favoritesService.favoritesMyFavoritesPost(filters));
        this.favorites.set(favorites.data?.map((favorite) => favorite.teacher!) || []);
        return this.favorites();
    }
    async addFavorite(teacherId: string) {
        const favorite = await firstValueFrom(this.favoritesService.favoritesAddPost({ teacherId }));
        return favorite.data;
    }
    async removeFavorite(favoriteId: string) {
        const favorite = await firstValueFrom(this.favoritesService.favoritesRemoveIdDelete(favoriteId));
        return favorite.data;
    }
}

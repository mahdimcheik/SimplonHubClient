import { inject, Injectable } from '@angular/core';
import { FavoriteDynamicFilters, FavoritesService } from '../../../api';
import { firstValueFrom } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class FavoritesMainService {
    favoritesService = inject(FavoritesService);

    async getAllFavorites(filters: FavoriteDynamicFilters) {
        const favorites = await firstValueFrom(this.favoritesService.favoritesMyFavoritesPost(filters));
        return favorites.data;
    }
}

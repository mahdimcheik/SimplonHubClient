import { inject, Injectable, signal } from '@angular/core';
import { GenderDTO, GendersService } from '../../../api';
import { firstValueFrom, map, tap } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class MainGenderService {
    private genderService = inject(GendersService);

    genders = signal<GenderDTO[]>([]);

    async getGenders() {
        if (this.genders().length == 0) {
            return await firstValueFrom(
                this.genderService.gendersAllGet().pipe(
                    map((response) => response.data ?? ([] as GenderDTO[])),
                    tap((res) => {
                        this.genders.set(res);
                    })
                )
            );
        } else {
            return this.genders();
        }
    }
}

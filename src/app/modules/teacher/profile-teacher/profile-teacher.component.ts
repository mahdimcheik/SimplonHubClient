import { Component, inject, OnInit, signal } from '@angular/core';
import { SmartSectionComponent } from '../../../generic-components/smart-section/smart-section.component';
import { ButtonModule } from 'primeng/button';
import { Image } from 'primeng/image';
import { FormationsListComponent } from '../../../generic-components/formations-list/formations-list.component';
import { FormationComponent } from '../../../generic-components/formation/formation.component';
import { AddressesListComponent } from '../../../generic-components/addresses-list/addresses-list.component';
import { PersonnalInfosComponent } from '../../../generic-components/personnal-infos/personnal-infos.component';
import { ChipsListComponent } from '../../../generic-components/chips-list/chips-list.component';
import { LanguageResponseDTO } from '../../../../api';
import { CursusesListComponent } from '../../../generic-components/cursuses-list/cursuses-list.component';
import { LanguagesMainService } from '../../../shared/services/languages.store.service';
import { UserMainService } from '../../../shared/services/userMain.service';

@Component({
    selector: 'app-profile-teacher',
    imports: [SmartSectionComponent, ButtonModule, FormationsListComponent, AddressesListComponent, PersonnalInfosComponent, ChipsListComponent, CursusesListComponent],
    templateUrl: './profile-teacher.component.html',
    styleUrl: './profile-teacher.component.scss'
})
export class ProfileTeacherComponent {
    languagesStoreService = inject(LanguagesMainService);
    userMainService = inject(UserMainService);

    languages = this.languagesStoreService.languages;
    user = this.userMainService.userConnected;
}

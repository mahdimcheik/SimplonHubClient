import { Component, DestroyRef, inject, model, OnInit, signal } from '@angular/core';
import { SmartSectionComponent } from '../smart-section/smart-section.component';
import { FormationResponseDTO } from '../../../api';
import { FormationComponent } from '../formation/formation.component';
import { FormationsMainService } from '../../shared/services/formations-main.service';
import { UserMainService } from '../../shared/services/userMain.service';
import { MessageService } from 'primeng/api';
import { ModalFormationComponent } from '../modal-formation/modal-formation.component';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-formations-list',
    imports: [SmartSectionComponent, FormationComponent, ModalFormationComponent],
    templateUrl: './formations-list.component.html',
    styleUrl: './formations-list.component.scss'
})
export class FormationsListComponent implements OnInit {
    formationService = inject(FormationsMainService);
    user = inject(UserMainService).userConnected;
    messageService = inject(MessageService);
    activatedRoute = inject(ActivatedRoute);
    destroyRef = inject(DestroyRef);

    title = 'Liste des Formations';

    editMode = model(true);
    buttonIcon = model('pi pi-plus');
    showEditModal = signal(false);

    formations = this.formationService.formations;

    async ngOnInit() {
        this.activatedRoute.params.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
            const teacherId = params['id'];
            if (teacherId && teacherId === 'me') {
                this.editMode.set(true);
                this.formationService.getAllFormationsByUser(this.user().id).then((formations) => {
                    this.formations.set(formations);
                    return formations;
                });
            } else {
                this.editMode.set(false);
                this.formationService.getAllFormationsByUser(teacherId).then((formations) => {
                    this.formations.set(formations);
                    return formations;
                });
            }
        });
    }

    async openModal() {
        this.showEditModal.set(true);
    }

    cancel() {
        this.showEditModal.set(false);
    }
}

import { Component, computed, DestroyRef, inject, model, OnInit, signal } from '@angular/core';
import { SmartSectionComponent } from '../smart-section/smart-section.component';
import { CursusComponent } from '../cursus/cursus.component';
import { CursusesMainService } from '../../shared/services/cursuses-main.service';
import { MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { UserMainService } from '../../shared/services/userMain.service';
import { ModalCursusComponent } from '../modal-cursus/modal-cursus.component';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-cursuses-list',
    imports: [SmartSectionComponent, CursusComponent, DialogModule, ModalCursusComponent],
    templateUrl: './cursuses-list.component.html',
    styleUrl: './cursuses-list.component.scss'
})
export class CursusesListComponent implements OnInit {
    cursusService = inject(CursusesMainService);
    user = inject(UserMainService).userConnected;
    messageService = inject(MessageService);
    activatedRoute = inject(ActivatedRoute);
    destroyRef = inject(DestroyRef);

    title = 'Listes des Coursus';

    editMode = model(true);
    buttonIcon = model('pi pi-plus');
    showEditModal = signal(false);

    cursuses = this.cursusService.cursuses;

    async ngOnInit() {
        this.activatedRoute.params.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
            const teacherId = params['id'];
            if (teacherId && teacherId === 'me') {
                this.editMode.set(true);
                this.cursusService.getCursusByTeacher(this.user().id).then((cursuses) => {
                    this.cursuses.set(cursuses);
                    return cursuses;
                });
            } else {
                this.editMode.set(false);
                this.cursusService.getCursusByTeacher(teacherId).then((cursuses) => {
                    this.cursuses.set(cursuses);
                    return cursuses;
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

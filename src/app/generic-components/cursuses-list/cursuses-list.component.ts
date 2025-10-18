import { Component, computed, DestroyRef, inject, model, OnInit, signal } from '@angular/core';
import { SmartSectionComponent } from '../smart-section/smart-section.component';
import { CursusComponent } from '../cursus/cursus.component';
import { CursusesMainService } from '../../shared/services/cursuses-main.service';
import { Structure } from '../configurable-form/related-models';
import { Drawer } from 'primeng/drawer';
import { Footer, MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { ConfigurableFormComponent } from '../configurable-form/configurable-form.component';
import { FormGroup } from '@angular/forms';
import { UserMainService } from '../../shared/services/userMain.service';
import { Message } from 'primeng/message';
import { ModalCursusComponent } from '../modal-cursus/modal-cursus.component';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CursusResponseDTO } from '../../../api';

@Component({
    selector: 'app-cursuses-list',
    imports: [SmartSectionComponent, CursusComponent, Drawer, DialogModule, ConfigurableFormComponent, ModalCursusComponent],
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

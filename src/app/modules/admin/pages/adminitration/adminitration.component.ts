import { Component, computed, effect, inject, model, signal, Type } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { firstValueFrom } from 'rxjs';
import { LanguageResponseDTO, RoleAppResponseDTO, StatusAccountDTO, StatusAccountResponseDTO } from '../../../../../api/models';
import { ModalCreateEditLanguageComponent } from '../../../../generic-components/modal-create-edit-language/modal-create-edit-language';
import { ModalCreateEditStatusComponent } from '../../../../generic-components/modal-create-edit-status/modal-create-edit-status';
import { ModalEditRoleComponent } from '../../../../generic-components/modal-edit-role/modal-edit-role';
import { ActionButtonRendererComponent, CustomTableState, DynamicColDef, ICellRendererAngularComp, INITIAL_STATE, SmartGridComponent } from '../../../../generic-components/smart-grid';
import { ColorGridComponent } from '../../../../generic-components/smart-grid/color-grid.component';
import { SmartSectionComponent } from '../../../../generic-components/smart-section/smart-section.component';
import { AdminMainService } from '../../../../shared/services/admin-main.service';
import { UserMainService } from '../../../../shared/services/userMain.service';

@Component({
    selector: 'app-adminitration',
    imports: [SmartGridComponent, SmartSectionComponent, ModalCreateEditLanguageComponent, ButtonModule, ModalEditRoleComponent, ModalCreateEditStatusComponent],
    templateUrl: './adminitration.component.html',
    styleUrl: './adminitration.component.scss'
})
export class AdminitrationComponent {
    userService = inject(UserMainService);
    adminService = inject(AdminMainService);

    editMode = model(true);
    editModeLanguages = model(false);

    roles = signal<RoleAppResponseDTO[]>([]);
    statusesAccount = signal<StatusAccountDTO[]>([]);
    languages = signal<LanguageResponseDTO[]>([]);

    // modals
    showEditModalLanguage = signal(false);
    showEditModalRole = signal(false);
    showEditModalStatus = signal(false);

    tableStateRoles = signal<CustomTableState>(INITIAL_STATE);
    tableStateStatusesAccount = signal<CustomTableState>(INITIAL_STATE);
    tableStateLanguages = signal<CustomTableState>(INITIAL_STATE);
    totalRecordsRoles = signal(0);
    loadingRoles = signal(false);
    totalRecordsStatusesAccount = signal(0);
    loadingStatusesAccount = signal(false);
    totalRecordsLanguages = signal(0);
    loadingLanguages = signal(false);

    // selected language for modal
    selectedLanguage = signal<LanguageResponseDTO | null>(null);
    selectedRole = signal<RoleAppResponseDTO | null>(null);
    selectedStatus = signal<StatusAccountResponseDTO | null>(null);

    customComponents = signal<{ [key: string]: Type<ICellRendererAngularComp> }>({
        color: ColorGridComponent,
        action: ActionButtonRendererComponent
    });

    colDefsLanguages = computed<DynamicColDef[]>(() => {
        const languages = this.languages();
        return [
            { field: 'name', header: 'Nom', type: 'text' },
            { field: 'color', header: 'Couleur', type: 'array', cellRenderer: 'color', cellRendererParams: { editMode: this.editModeLanguages() } },
            { field: 'createdAt', header: 'Créé le', type: 'date', valueFormatter: (data: any) => new Date(data.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' }) },
            { field: 'updatedAt', header: 'Mis à jour le', type: 'date', valueFormatter: (data: any) => (data ? new Date(data.updatedAt).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' }) : 'Pas de date') },
            { field: 'id', header: 'Actions', type: 'text', cellRenderer: 'Default', cellRendererParams: { showEdit: true, showDelete: false, onEdit: this.onEditClickLanguage.bind(this) } }
        ];
    });

    colDefsRoles = computed<DynamicColDef[]>(() => {
        const roles = this.roles();
        return [
            { field: 'name', header: 'Nom', type: 'text' },
            { field: 'color', header: 'Couleur', type: 'array', cellRenderer: 'color', cellRendererParams: { editMode: this.editModeLanguages() } },
            { field: 'createdAt', header: 'Créé le', type: 'date', valueFormatter: (data: any) => new Date(data.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' }) },
            { field: 'updatedAt', header: 'Mis à jour le', type: 'date', valueFormatter: (data: any) => (data ? new Date(data.updatedAt).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' }) : 'Pas de date') },
            { field: 'id', header: 'Actions', type: 'text', cellRenderer: 'Default', cellRendererParams: { showEdit: true, showDelete: false, onEdit: this.onEditClickRole.bind(this) } }
        ];
    });

    colDefsStatusesAccount = computed<DynamicColDef[]>(() => {
        const statusesAccount = this.statusesAccount();
        return [
            { field: 'name', header: 'Nom', type: 'text' },
            { field: 'color', header: 'Couleur', type: 'array', cellRenderer: 'color', cellRendererParams: { editMode: this.showEditModalStatus() } },

            { field: 'createdAt', header: 'Créé le', type: 'date', valueFormatter: (data: any) => new Date(data.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' }) },
            { field: 'updatedAt', header: 'Mis à jour le', type: 'date', valueFormatter: (data: any) => (data ? new Date(data.updatedAt).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' }) : 'Pas de date') },
            { field: 'id', header: 'Actions', type: 'text', cellRenderer: 'Default', cellRendererParams: { showEdit: true, showDelete: false, onEdit: this.onEditClickStatus.bind(this) } }
        ];
    });

    constructor() {
        effect(async () => {
            const tableStateRoles = this.tableStateRoles();
            // roles
            this.loadingRoles.set(true);
            const roles = await firstValueFrom(this.userService.getRoles(this.tableStateRoles()));
            const statusesAccount = await firstValueFrom(this.userService.getStatusAccount(this.tableStateStatusesAccount()));
            this.roles.set(roles.data ?? []);
            this.totalRecordsRoles.set(roles.count ?? 0);
            this.loadingRoles.set(false);
        });

        effect(async () => {
            const tableStateStatusesAccount = this.tableStateStatusesAccount();
            // statuses account
            this.loadingStatusesAccount.set(true);
            const statusesAccount = await firstValueFrom(this.userService.getStatusAccount(this.tableStateStatusesAccount()));
            this.statusesAccount.set(statusesAccount.data ?? []);
            this.totalRecordsStatusesAccount.set(statusesAccount.count ?? 0);
            this.loadingStatusesAccount.set(false);
        });
        effect(async () => {
            const tableStateLanguages = this.tableStateLanguages();
            // languages
            this.loadingLanguages.set(true);
            const languages = await firstValueFrom(this.userService.getLanguages(this.tableStateLanguages()));
            this.languages.set(languages.data ?? []);
            this.totalRecordsLanguages.set(languages.count ?? 0);
            this.loadingLanguages.set(false);
        });
    }

    onCreateClickLanguage() {
        // creation mode
        this.selectedLanguage.set(null);
        this.showEditModalLanguage.set(true);
    }
    onEditClickLanguage(language: LanguageResponseDTO) {
        // edition mode
        console.log('onEditClickLanguage', language);
        this.selectedLanguage.set(language);
        this.showEditModalLanguage.set(true);
    }

    onEditClickRole(role: RoleAppResponseDTO) {
        console.log('onEditClickRole', role);
        this.selectedRole.set(role);
        this.showEditModalRole.set(true);
    }

    onAddClickStatus() {
        this.selectedStatus.set(null);
        this.showEditModalStatus.set(true);
    }
    onEditClickStatus(Status: StatusAccountResponseDTO) {
        this.selectedStatus.set(Status);
        this.showEditModalStatus.set(true);
    }

    onDeleteClickRole(role: RoleAppResponseDTO) {
        console.log('onDeleteClickRole', role);
    }

    // submits modals
    async onSubmitLanguage() {
        this.showEditModalLanguage.set(false);
        this.reloadLanguages();
    }
    async onSubmitRole() {
        this.showEditModalRole.set(false);
        this.reloadRoles();
    }
    async onSubmitStatus() {
        this.showEditModalStatus.set(false);
        this.reloadStatusesAccount();
    }

    async reloadLanguages() {
        this.loadingLanguages.set(true);
        const languages = await firstValueFrom(this.userService.getLanguages(this.tableStateLanguages()));
        this.languages.set(languages.data ?? []);
        this.totalRecordsLanguages.set(languages.count ?? 0);
        this.loadingLanguages.set(false);
    }
    async reloadRoles() {
        this.loadingRoles.set(true);
        const roles = await firstValueFrom(this.userService.getRoles(this.tableStateRoles()));
        this.roles.set(roles.data ?? []);
        this.totalRecordsRoles.set(roles.count ?? 0);
        this.loadingRoles.set(false);
    }
    async reloadStatusesAccount() {
        this.loadingStatusesAccount.set(true);
        const statusesAccount = await firstValueFrom(this.userService.getStatusAccount(this.tableStateStatusesAccount()));
        this.statusesAccount.set(statusesAccount.data ?? []);
        this.totalRecordsStatusesAccount.set(statusesAccount.count ?? 0);
        this.loadingStatusesAccount.set(false);
    }
}

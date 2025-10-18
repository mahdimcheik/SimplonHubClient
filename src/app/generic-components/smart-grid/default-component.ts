import { Component, Input, Output, EventEmitter, input, computed } from '@angular/core';
import { ButtonModule } from 'primeng/button'; // Exemple avec PrimeNG
import { ICellRendererAngularComp } from '../../shared/models/TableColumn ';

@Component({
    selector: 'app-action-button-renderer',
    standalone: true,
    imports: [ButtonModule],
    template: `
        <div class="flex gap-2">
            @if (showEdit()) {
                <p-button icon="pi pi-pencil" styleClass="p-button-sm p-button-info" (click)="onEditClick($event)"> </p-button>
            }
            @if (showDelete()) {
                <p-button icon="pi pi-trash" styleClass="p-button-sm p-button-danger" (click)="onDeleteClick($event)" [style]="{ 'margin-left': '4px' }"> </p-button>
            }
        </div>
    `
})
export class ActionButtonRendererComponent implements ICellRendererAngularComp {
    data = input<any>(); // Reçoit toute la ligne de données (rowData)
    params = input<any>(); // Reçoit les cellRendererParams
    showEdit = computed(() => this.params().showEdit ?? true);
    showDelete = computed(() => this.params().showDelete ?? true);

    // Exemple d'interaction vers le composant parent
    // @Output() action = new EventEmitter<any>();

    onEditClick(event: Event) {
        event.preventDefault();
        event.stopPropagation();
        if (this.params().onEdit) {
            this.params().onEdit(this.data());
        }
    }

    onDeleteClick(event: Event) {
        event.preventDefault();
        event.stopPropagation();
        if (this.params().onDelete) {
            this.params().onDelete(this.data());
        }
    }
}

import { Component, Input, forwardRef, signal, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FileUploadModule } from 'primeng/fileupload';

@Component({
    selector: 'app-custom-upload-file',
    standalone: true,
    imports: [CommonModule, FileUploadModule],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => CustomUploadFileComponent),
            multi: true
        }
    ],
    template: `
        <p-fileupload
            [id]="id"
            [name]="name"
            [chooseLabel]="chooseLabel"
            [showUploadButton]="showUploadButton"
            [uploadLabel]="uploadLabel"
            [cancelLabel]="cancelLabel"
            [multiple]="multiple"
            [accept]="accept"
            [maxFileSize]="maxFileSize"
            [mode]="mode"
            [url]="url"
            [showCancelButton]="showCancelButton"
            [auto]="auto"
            [disabled]="disabled()"
            (onUpload)="onUpload($event)"
            (onSelect)="onSelect($event)"
            (onRemove)="onRemove($event)"
            (onClear)="onClear($event)"
            class="w-full"
            [class.p-invalid]="invalid"
        >
            <ng-template #empty>
                <div class="text-center p-4 text-gray-500 flex flex-row items-center justify-center rounded border border-dashed border-gray-300 p-4">
                    <span class="flex-1  text-center flex items-center justify-center ">
                        {{ emptyMessage }}
                    </span>
                    @if (url) {
                        <div class="flex flex-col items-center ml-4 flex-1 justify-center">
                            <span>Votre avatar</span>
                            <img src="{{ url }}" alt="" class=" mx-auto mt-2 max-h-24 object-contain border rounded-2" />
                        </div>
                    }
                </div>
            </ng-template>
            <ng-template #content>
                <div class="space-y-2">
                    @for (file of uploadedFiles(); track file.name) {
                        <div class="flex items-center justify-between p-2 bg-gray-50 rounded border">
                            <span class="text-sm truncate">{{ file.name }}</span>
                            <span class="text-xs text-gray-500">{{ file.size | number }} bytes</span>
                        </div>
                    }
                </div>
            </ng-template>
        </p-fileupload>
    `,
    styles: [
        `
            :host {
                display: block;
                width: 100%;
            }
        `
    ]
})
export class CustomUploadFileComponent implements ControlValueAccessor, OnInit {
    // Input properties for file upload configuration
    @Input() id: string = '';
    @Input() name: string = '';
    @Input() accept: string = '*';
    @Input() multiple: boolean = false;
    @Input() maxFileSize: number = 1000000;
    @Input() chooseLabel: string = 'Choisir';
    @Input() uploadLabel: string = 'Téléverser';
    @Input() cancelLabel: string = 'Annuler';
    @Input() emptyMessage: string = 'Sélectionnez et glissez vos fichiers ici';
    @Input() mode: 'basic' | 'advanced' = 'advanced';
    @Input() url: string = '';
    @Input() showUploadButton: boolean = false;
    @Input() showCancelButton: boolean = true;
    @Input() auto: boolean = false;
    @Input() invalid: boolean = false;

    // Internal state
    uploadedFiles = signal<File[]>([]);
    disabled = signal<boolean>(false);

    // ControlValueAccessor callbacks
    private onChange = (value: File | File[] | null) => {};
    private onTouched = () => {};

    ngOnInit() {
        // Initialize empty files array
        this.uploadedFiles.set([]);
    }

    // ControlValueAccessor implementation
    writeValue(value: File | File[] | null): void {
        if (value === null || value === undefined) {
            this.uploadedFiles.set([]);
        } else if (Array.isArray(value)) {
            this.uploadedFiles.set(value);
        } else {
            this.uploadedFiles.set([value]);
        }
    }

    registerOnChange(fn: (value: File | File[] | null) => void): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.disabled.set(isDisabled);
    }

    // File upload event handlers
    onUpload(event: any) {
        this.handleFileChange(event.files);
    }

    onSelect(event: any) {
        this.handleFileChange(event.files);
    }

    onRemove(event: any) {
        const currentFiles = this.uploadedFiles() ?? [];
        if (currentFiles.length > 0) {
            const updatedFiles = currentFiles.filter((file) => file !== event.file);
            this.handleFileChange(updatedFiles);
        } else {
            this.handleFileChange([]);
        }
    }

    onClear(event: any) {
        this.handleFileChange([]);
    }

    private handleFileChange(files: File[]) {
        this.uploadedFiles.set(files);
        this.onTouched();

        // Emit the appropriate value based on multiple flag
        if (this.multiple) {
            this.onChange(files.length > 0 ? files : null);
        } else {
            this.onChange(files.length > 0 ? files[0] : null);
        }
    }

    // Helper methods
    getFiles(): File[] {
        return this.uploadedFiles();
    }

    hasFiles(): boolean {
        return this.uploadedFiles().length > 0;
    }

    clearFiles(): void {
        this.handleFileChange([]);
    }
}

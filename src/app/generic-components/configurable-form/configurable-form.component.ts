import { Component, inject, input, output, OnInit, signal, computed, effect, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormControl, FormArray } from '@angular/forms';

import { errorMessages, FormField, FormFieldGroup, Structure } from './related-models';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { MultiSelectModule } from 'primeng/multiselect';
import { CheckboxModule } from 'primeng/checkbox';
import { DatePickerModule } from 'primeng/datepicker';
import { ButtonModule } from 'primeng/button';
import { ColorPickerModule } from 'primeng/colorpicker';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { CustomUploadFileComponent } from '../custom-upload-file/custom-upload-file.component';
import { PasswordModule } from 'primeng/password';
import { ChipsListComponent } from '../chips-list/chips-list.component';
@Component({
    selector: 'app-configurable-form',
    styleUrls: ['./configurable-form.component.scss'],
    standalone: true,
    imports: [
        ReactiveFormsModule,
        PasswordModule,
        CustomUploadFileComponent,
        InputTextModule,
        InputNumberModule,
        TextareaModule,
        SelectModule,
        MultiSelectModule,
        CheckboxModule,
        RadioButtonModule,
        DatePickerModule,
        ColorPickerModule,
        ButtonModule,
        InputGroupModule,
        InputGroupAddonModule,
        ChipsListComponent
    ],
    templateUrl: './configurable-form.component.html',
    changeDetection: ChangeDetectionStrategy.Default
})
export class ConfigurableFormComponent implements OnInit {
    private fb = inject(FormBuilder);

    // Input signal for the structure
    structure = input<Structure | null>(null);

    // Output signal for form submission
    onFormSubmit = output<FormGroup>();
    onCancel = output<void>();

    // Form instance - now contains nested FormGroups
    form = signal<FormGroup>(this.fb.group({}));

    // Reactive signal to track form validity
    formValid = signal<boolean>(true);

    // Reactive signal to track form touched state
    formTouched = signal<boolean>(false);

    // Error messages map
    errorMessages = errorMessages;

    // Password visibility state signal
    passwordVisibility = signal<{ [key: string]: boolean }>({});

    // Computed signal to track form validity (now properly reactive)
    isFormValid = computed(() => {
        return this.formValid();
    });

    // Computed signal to track if form has been touched (now properly reactive)
    isFormTouched = computed(() => this.formTouched());

    // Computed signals for sorted fields and groups
    sortedFormElements = computed(() => {
        const structure = this.structure();
        if (!structure) return [];

        const elements: (FormField<any> | FormFieldGroup)[] = [];

        // Add FormFieldGroups
        structure.formFieldGroups?.forEach((group) => {
            elements.push(group);
        });

        // Add FormFields
        structure.formFields?.forEach((field) => {
            elements.push(field);
        });

        // Sort by order, default to high value if no order specified
        return [...elements].sort((a, b) => {
            const orderA = (a as FormField<any> | FormFieldGroup).order ?? 999999;
            const orderB = (b as FormField<any> | FormFieldGroup).order ?? 999999;
            return orderA - orderB;
        });
    });

    constructor() {
        // Use effect to respond to structure changes
        effect(() => {
            const structureData = this.structure();
            if (structureData) {
                this.createForm();
            }
        });
    }

    ngOnInit(): void {}

    private createForm() {
        const structure = this.structure();
        if (!structure) {
            this.form.set(this.fb.group({}));
            return;
        }

        const formControls: { [key: string]: FormGroup | FormControl } = {};

        // Create FormGroups for each FormFieldGroup
        structure.formFieldGroups?.forEach((group: FormFieldGroup) => {
            const groupControls: { [key: string]: FormControl } = {};

            // Add all fields from this group to the group's FormGroup
            group.fields.forEach((field: FormField<any>) => {
                const validators = this.createFieldValidators(field);
                const initialValue = field.value !== undefined && field.value !== null ? field.value : this.getDefaultValue(field.type);
                const control = this.fb.control(
                    {
                        value: initialValue,
                        disabled: field.disabled || false
                    },
                    validators
                );
                groupControls[field.name] = control;
            });

            // Create FormGroup for this section with group-level validators
            formControls[group.id] = this.fb.group(groupControls, {
                validators: group.groupValidators || []
            });
        });

        // Create FormControls for direct formFields
        structure.formFields?.forEach((field: FormField<any>) => {
            const validators = this.createFieldValidators(field);
            const initialValue = field.value !== undefined && field.value !== null ? field.value : this.getDefaultValue(field.type);
            const control = this.fb.control(
                {
                    value: initialValue,
                    disabled: field.disabled || false
                },
                validators
            );
            formControls[field.name] = control;
        });

        // Create the main form with both FormGroups and direct FormControls
        const newForm = this.fb.group(formControls, {
            validators: structure.globalValidators || []
        });
        this.form.set(newForm);

        // Set up reactivity for form validity and touched state
        this.setupFormReactivity();
    }

    private createFieldValidators(field: FormField<any>): any[] {
        const validators = [];

        // Add required validator if field is required
        if (field.required) {
            validators.push((control: any) => {
                if (!control.value || control.value === '' || (Array.isArray(control.value) && control.value.length === 0)) {
                    return { required: true };
                }
                return null;
            });
        }

        // Add custom validators if provided
        if (field.validation) {
            validators.push(...field.validation);
        }

        return validators;
    }

    private setupFormReactivity() {
        const currentForm = this.form();

        this.formValid.set(currentForm.valid);
        this.formTouched.set(currentForm.touched);

        currentForm.statusChanges.subscribe(() => {
            this.formValid.set(currentForm.valid);
            this.formTouched.set(currentForm.touched);
        });
    }

    private getDefaultValue(type: string): any {
        switch (type) {
            case 'checkbox':
                return false;
            case 'number':
                return 0;
            case 'date':
                return '';
            case 'file':
                return null;
            default:
                return '';
        }
    }

    onSubmit() {
        const formInstance = this.form();
        if (formInstance.valid) {
            this.onFormSubmit.emit(formInstance);
        } else {
            formInstance.markAllAsTouched();
            this.form.set(formInstance);
            this.formValid.set(formInstance.valid);
            this.formTouched.set(formInstance.touched);
        }
    }

    getFormGroup(groupId: string): FormGroup {
        return this.form().get(groupId) as FormGroup;
    }

    getFieldError(groupId: string, fieldName: string): string | null {
        const groupForm = this.getFormGroup(groupId);
        if (!groupForm) return null;

        const control = groupForm.get(fieldName);
        if (control && control.invalid && (control.dirty || control.touched)) {
            const errors = control.errors;
            if (errors) {
                const fieldLabel = this.structure()
                    ?.formFieldGroups?.find((group) => group.id === groupId)
                    ?.fields.find((field) => field.name === fieldName)?.label;
                const errorKey = Object.keys(errors)[0];
                return this.errorMessages[errorKey] ? `${fieldLabel} : ${this.errorMessages[errorKey](errors[errorKey])}` : 'Erreur de validation';
            }
        }
        return null;
    }

    getGroupValidationErrors(groupId: string): string[] {
        const groupForm = this.getFormGroup(groupId);
        if (!groupForm || !groupForm.errors) return [];

        const errors: string[] = [];
        Object.keys(groupForm.errors).forEach((errorKey) => {
            const errorMessage = this.errorMessages[errorKey] ? this.errorMessages[errorKey](groupForm.errors![errorKey]) : `Erreur de validation du groupe: ${errorKey}`;
            errors.push(errorMessage);
        });

        return errors;
    }

    getGlobalValidationErrors(): string[] {
        const form = this.form();
        if (!form || !form.errors) return [];

        const errors: string[] = [];
        Object.keys(form.errors).forEach((errorKey) => {
            const errorMessage = this.errorMessages[errorKey] ? this.errorMessages[errorKey](form.errors![errorKey]) : `Erreur de validation globale: ${errorKey}`;
            errors.push(errorMessage);
        });

        return errors;
    }

    hasGlobalValidationErrors(): boolean {
        const form = this.form();
        return !!(form && form.errors && Object.keys(form.errors).length > 0);
    }

    hasGroupValidationErrors(groupId: string): boolean {
        const groupForm = this.getFormGroup(groupId);
        return !!(groupForm && groupForm.errors && Object.keys(groupForm.errors).length > 0);
    }

    isFieldInvalid(groupId: string, fieldName: string): boolean {
        const groupForm = this.getFormGroup(groupId);
        if (!groupForm) return false;

        const control = groupForm.get(fieldName);
        return !!(control && control.invalid && (control.dirty || control.touched));
    }

    isDirectFieldInvalid(fieldName: string): boolean {
        const form = this.form();
        const control = form.get(fieldName);
        return !!(control && control.invalid && (control.dirty || control.touched));
    }

    getDirectFieldError(fieldName: string): string | null {
        const form = this.form();
        const control = form.get(fieldName);

        if (control && control.invalid && (control.dirty || control.touched)) {
            const errors = control.errors;
            if (errors) {
                const fieldLabel = this.structure()?.formFields?.find((field) => field.name === fieldName)?.label;
                const errorKey = Object.keys(errors)[0];
                return this.errorMessages[errorKey] ? `${fieldLabel} : ${this.errorMessages[errorKey](errors[errorKey])}` : 'Erreur de validation';
            }
        }
        return null;
    }

    isGroupValid(groupId: string): boolean {
        const groupForm = this.getFormGroup(groupId);
        return groupForm ? groupForm.valid : false;
    }

    isGroupTouched(groupId: string): boolean {
        const groupForm = this.getFormGroup(groupId);
        return groupForm ? groupForm.touched : false;
    }

    getGroupErrors(groupId: string): string[] {
        const groupForm = this.getFormGroup(groupId);
        if (!groupForm) return [];

        const errors: string[] = [];

        const groupValidationErrors = this.getGroupValidationErrors(groupId);
        errors.push(...groupValidationErrors);

        Object.keys(groupForm.controls).forEach((fieldName) => {
            const fieldError = this.getFieldError(groupId, fieldName);
            if (fieldError) {
                errors.push(fieldError);
            }
        });

        return errors;
    }

    getStructuredFormValue(): any {
        const formValue = this.form().value;
        return formValue;
    }

    getFlattenedFormValue(): any {
        const formValue = this.form().value;
        const flattened: any = {};

        Object.keys(formValue).forEach((groupId) => {
            const groupValue = formValue[groupId];
            Object.keys(groupValue).forEach((fieldName) => {
                flattened[fieldName] = groupValue[fieldName];
            });
        });

        return flattened;
    }

    getSelectOptions(field: FormField<any>): any[] {
        if (!field.options) return [];

        if (field.displayKey || field.compareKey) {
            return field.options;
        }

        if (field.options.length > 0 && typeof field.options[0] === 'object' && field.options[0].label) {
            return field.options;
        }
        return field.options;
    }

    getOptionValue(option: any, field: FormField<any>): any {
        if (field.compareKey) {
            return option[field.compareKey];
        }
        return option.value !== undefined ? option.value : option;
    }

    getOptionLabel(option: any, field: FormField<any>): string {
        let label: string;

        if (field.displayKey) {
            label = option[field.displayKey];
        } else {
            label = option.label !== undefined ? option.label : option.toString();
        }

        // Appliquer le formateur de valeur s'il est défini
        if (field.valueFormatter) {
            return field.valueFormatter(option);
        }

        return label;
    }

    getSortedFieldsInGroup(group: FormFieldGroup): FormField<any>[] {
        return [...group.fields].sort((a, b) => {
            const orderA = a.order ?? 999999;
            const orderB = b.order ?? 999999;
            return orderA - orderB;
        });
    }

    isFormField(element: FormField<any> | FormFieldGroup): element is FormField<any> {
        return 'name' in element && 'type' in element;
    }

    isFormFieldGroup(element: FormField<any> | FormFieldGroup): element is FormFieldGroup {
        return 'fields' in element && Array.isArray((element as FormFieldGroup).fields);
    }

    trackByFieldId(index: number, field: FormField<any>): string {
        return field.id;
    }

    trackByGroupId(index: number, group: FormFieldGroup): string {
        return group.id;
    }

    trackByElementId(index: number, element: FormField<any> | FormFieldGroup): string {
        return this.isFormField(element) ? element.id : (element as FormFieldGroup).id;
    }

    onCancelClick() {
        this.onCancel.emit();
    }

    togglePasswordVisibility(fieldId: string) {
        const currentVisibility = this.passwordVisibility();
        this.passwordVisibility.set({
            ...currentVisibility,
            [fieldId]: !currentVisibility[fieldId]
        });
    }

    isPasswordVisible(fieldId: string): boolean {
        return this.passwordVisibility()[fieldId] || false;
    }

    getPasswordFieldType(fieldId: string): string {
        return this.isPasswordVisible(fieldId) ? 'text' : 'password';
    }
}

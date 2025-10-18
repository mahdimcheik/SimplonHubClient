import { Component, model, output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { InputText } from 'primeng/inputtext';

@Component({
    selector: 'app-smart-editable-input',
    imports: [InputText],
    templateUrl: './smart-editable-input.component.html',
    styleUrl: './smart-editable-input.component.scss'
})
export class SmartEditableInputComponent implements ControlValueAccessor {
    writeValue(obj: any): void {
        this.value.set(obj);
    }
    registerOnChange(fn: any): void {
        this.onChange.emit(this.value());
    }
    registerOnTouched(fn: any): void {
        this.onTouched.emit();
    }
    setDisabledState?(isDisabled: boolean): void {
        this.disabled.set(isDisabled);
    }
    editMode = model(false);
    value = model('');
    label = model.required();
    disabled = model(false);
    onChange = output<string>();
    onTouched = output<void>();
}

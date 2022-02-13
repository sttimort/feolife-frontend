import { Injectable } from "@angular/core";
import { FormControl } from "@angular/forms";

@Injectable({
    providedIn: 'root'
})
export class FormValidationHelper {
    public shouldShowError(formControl: FormControl, dirtyOnly: boolean = true): boolean {
        return (formControl.touched && !dirtyOnly || formControl.dirty) && formControl.errors != null;
    }

    public getErrorMessage(formControl: FormControl, fieldName: string): string {
        const errors = formControl.errors
        if (errors?.['required']) {
            return `${fieldName} is required`;
        } else if (errors?.['minlength']) {
            const minLength = errors?.['minlength'].requiredLength;
            return `${fieldName} min length is ${minLength}`;
        } else if (errors?.['maxlength']) {
            const maxLength = errors?.['maxlength'].requiredLength;
            return `${fieldName} max length is ${maxLength}`;
        } else if (errors != null) {
            return `${fieldName} is invalid`;
        } else {
            return '';
        }
    }
}
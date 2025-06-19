import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

export interface ValidationError {
  formErrors: string[];
  fieldErrors: { [key: string]: string[] };
}

export interface FormValidationErrors {
  [key: string]: any;
}

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlerService {
  /**
   * Extract validation errors from HTTP error response
   */
  extractValidationErrors(error: HttpErrorResponse): ValidationError | null {
    if (error.status === 400 && error.error) {
      const errorData = error.error;

      // Check if it's a Zod validation error
      if (errorData.formErrors || errorData.fieldErrors) {
        return {
          formErrors: errorData.formErrors || [],
          fieldErrors: errorData.fieldErrors || {},
        };
      }
    }
    return null;
  }

  /**
   * Convert validation errors to Angular form errors format
   */
  convertToFormErrors(validationError: ValidationError): FormValidationErrors {
    const formErrors: FormValidationErrors = {};

    // Add field-specific errors
    Object.keys(validationError.fieldErrors).forEach((fieldName) => {
      const errors = validationError.fieldErrors[fieldName];
      if (errors && errors.length > 0) {
        formErrors[fieldName] = {
          serverError: errors[0], // Take the first error message
        };
      }
    });

    // Add general form errors
    if (validationError.formErrors && validationError.formErrors.length > 0) {
      formErrors['general'] = {
        serverError: validationError.formErrors[0],
      };
    }

    return formErrors;
  }

  /**
   * Get user-friendly error message
   */
  getErrorMessage(error: HttpErrorResponse): string {
    if (error.status === 0) {
      return 'Unable to connect to the server. Please check your internet connection.';
    }

    if (error.status === 400) {
      const validationError = this.extractValidationErrors(error);
      if (validationError) {
        const fieldErrors = Object.values(validationError.fieldErrors).flat();
        if (fieldErrors.length > 0) {
          return fieldErrors[0];
        }
      }
      return 'Invalid request data. Please check your input.';
    }

    if (error.status === 401) {
      return 'You are not authorized to perform this action.';
    }

    if (error.status === 403) {
      return 'Access forbidden.';
    }

    if (error.status === 404) {
      return 'The requested resource was not found.';
    }

    if (error.status === 500) {
      return 'Server error. Please try again later.';
    }

    return 'An unexpected error occurred. Please try again.';
  }

  /**
   * Handle HTTP error and return appropriate error message
   */
  handleError(error: HttpErrorResponse): {
    message: string;
    validationErrors?: FormValidationErrors;
  } {
    const message = this.getErrorMessage(error);
    const validationError = this.extractValidationErrors(error);

    if (validationError) {
      const formErrors = this.convertToFormErrors(validationError);
      return { message, validationErrors: formErrors };
    }

    return { message };
  }
}

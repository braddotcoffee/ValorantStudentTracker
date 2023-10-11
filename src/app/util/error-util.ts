import { HttpErrorResponse } from "@angular/common/http";
import { MatSnackBar } from "@angular/material/snack-bar";

export function handleError(snackBar: MatSnackBar, error: Error) {
    if (error instanceof HttpErrorResponse) {
        handleHttpError(snackBar, error);
    } else {
        handleUnexpectedError(snackBar, error);
    }

    console.log(error);
}

export function displaySnackBarError(snackBar: MatSnackBar, message: string) {
    snackBar.open(message, 'Dismiss', {
        panelClass: ['snackbar-warn']
    });
}

function handleHttpError(snackBar: MatSnackBar, error: HttpErrorResponse) {
    var errorMessage: string = `Woah! Something went wrong (${error.status})`;
    if (error.status === 404) {
        errorMessage = "Page not found...";
    } else if (error.status === 429) {
        errorMessage = "Daily request limit exceeded... try again tomorrow!";
    }

    displaySnackBarError(snackBar, errorMessage);
}

function handleUnexpectedError(snackBar: MatSnackBar, error: Error) {
    displaySnackBarError(snackBar, "Unexpected exception... check console...");
}
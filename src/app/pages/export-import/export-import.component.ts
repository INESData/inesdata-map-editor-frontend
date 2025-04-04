import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ExportService, ImportService } from 'projects/mapper-api-client';
import { finalize } from 'rxjs';
import { LanguageService } from 'src/app/shared/services/language.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { LABELS_NO_FILE_SELECTED, MESSAGES_ERRORS, MESSAGES_EXPORT_ERROR } from 'src/app/shared/utils/app.constants';

@Component({
	selector: 'app-export-import',
	templateUrl: './export-import.component.html'
})
export class ExportImportComponent {
	destroyRef = inject(DestroyRef);

	constructor(private exportService: ExportService, private importService: ImportService, private notificationService: NotificationService, private languageService: LanguageService) { }

	confirmDialogVisible = false;
	importDialogVisible = false;

	file: File;
	fileName: string = this.languageService.translateValue(LABELS_NO_FILE_SELECTED);
	fileSelected = false;
	fileRequired = false;

	submittingForm = false;

	/**
	 * Display confirmation dialog
	 */
	showConfirmationDialog(): void {
		this.confirmDialogVisible = true;
	}

	/**
	 * Display import dialog
	 */
	showImportDialog(): void {
		this.importDialogVisible = true;
	}

	/**
	 * Exports mapping data as a downloadable file
	 */
	export(): void {
		this.submittingForm = true;
		this.exportService.exportMapping()
			.pipe(
				takeUntilDestroyed(this.destroyRef),
				finalize(() => this.submittingForm = false)
			)
			.subscribe({
				next: (value) => {
					const blob = new Blob([value], { type: 'application/json' });
					const data = window.URL.createObjectURL(blob);
					const link = document.createElement('a');

					link.href = data;
					link.download = `data${this.getCurrentDate()}`;
					link.click();
					this.confirmDialogVisible = false;
				},
				error: (error) => {
					if (error.status === 404) {
						this.notificationService.showErrorMessage(MESSAGES_EXPORT_ERROR, MESSAGES_ERRORS);
					}
				},
			});
	}


	/**
	 * Imports mapping as a file
	 */
	import(): void {
		if (!this.file) {
			this.fileRequired = true;
			return;
		}
		this.submittingForm = true;
		this.importService.importMapping(this.file)
			.pipe(
				takeUntilDestroyed(this.destroyRef),
				// On success or error
				finalize(() => {
					this.submittingForm = false
				})
			)
			.subscribe({
				next: () => {
					this.notificationService.showSuccess("exito");
					this.importDialogVisible = false;
				}
			});
	}

	/**
	 * Generates the current date in YYYYMMDD format
	 */
	getCurrentDate(): string {
		const currentDate = new Date();
		return currentDate.getFullYear().toString() +
			(currentDate.getMonth() + 1).toString().padStart(2, '0') +
			currentDate.getDate().toString().padStart(2, '0');
	}

	/**
	 * Extract selected file
	 */
	onFileSelected(event) {
		this.file = event.target.files[0];
		if (this.file) {
			this.fileName = this.file.name;
			this.fileSelected = true;
			this.fileRequired = false;
		} else {
			this.resetFile();
		}
	}

	/**
	 * Reset file to initial state
	 */
	resetFile(): void {
		this.fileName = this.languageService.translateValue(LABELS_NO_FILE_SELECTED);
		this.fileSelected = false;
		this.file = null;
		this.fileRequired = false;
	}
}

import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ExportImporService } from 'projects/mapper-api-client';
import { LanguageService } from 'src/app/shared/services/language.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { LABELS_NO_FILE_SELECTED, MESSAGES_ERRORS, MESSAGES_EXPORT_ERROR } from 'src/app/shared/utils/app.constants';

@Component({
	selector: 'app-export-import',
	templateUrl: './export-import.component.html'
})
export class ExportImportComponent {
	destroyRef = inject(DestroyRef);

	constructor(private exportImportService: ExportImporService, private notificationService: NotificationService, private languageService: LanguageService) { }

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
		this.exportImportService.exportMapping()
			.pipe(
				takeUntilDestroyed(this.destroyRef))
			.subscribe({
				next: (value) => {
					const blob = new Blob([value]);
					const data = window.URL.createObjectURL(blob);
					const link = document.createElement('a');
					const currentDate = new Date();
					const date = currentDate.getFullYear().toString() +
						(currentDate.getMonth() + 1).toString().padStart(2, '0') +
						currentDate.getDate().toString().padStart(2, '0');
					link.href = data;
					link.download = "data" + date;
					link.click();
					this.confirmDialogVisible = false;
					this.submittingForm = false;
				},
				error: (error) => {
					if (error.status === 404) {
						this.notificationService.showErrorMessage(MESSAGES_EXPORT_ERROR, MESSAGES_ERRORS);
						this.submittingForm = false;
					}
				},
			});
	}

	import(): void {
		this.submittingForm = true;
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

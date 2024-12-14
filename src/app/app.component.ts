import { Component, inject, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NxButtonModule, NxIconButtonComponent } from '@aposin/ng-aquila/button';
import { NxCheckboxModule } from '@aposin/ng-aquila/checkbox';
import { NxDocumentationIconModule } from '@aposin/ng-aquila/documentation-icons';
import { NxDropdownModule } from '@aposin/ng-aquila/dropdown';
import { NxFooterModule } from '@aposin/ng-aquila/footer';
import { NxFormfieldComponent, NxFormfieldErrorDirective, NxFormfieldHintDirective, NxFormfieldModule, NxFormfieldNoteDirective, NxFormfieldSuffixDirective } from '@aposin/ng-aquila/formfield';
import { NxGridModule } from '@aposin/ng-aquila/grid';
import { NxHeadlineModule } from '@aposin/ng-aquila/headline';
import { NxIconModule } from '@aposin/ng-aquila/icon';
import { NxInputDirective, NxInputModule } from '@aposin/ng-aquila/input';
import { NxLinkModule } from '@aposin/ng-aquila/link';
import { NxMessageComponent, NxMessageModule } from '@aposin/ng-aquila/message';
import { NxDialogService, NxModalModule, NxModalRef } from '@aposin/ng-aquila/modal';
import { NxOverlayModule } from '@aposin/ng-aquila/overlay';
import { NxPopoverModule } from '@aposin/ng-aquila/popover';
import { NxSmallStageModule } from '@aposin/ng-aquila/small-stage';
import { NxIsoDateModule } from '@aposin/ng-aquila/iso-date-adapter';
import { NX_DATE_FORMATS, NxDatepickerToggleComponent } from '@aposin/ng-aquila/datefield';
import { NxDatefieldDirective } from '@aposin/ng-aquila/datefield';
import { NxErrorComponent, NxLabelComponent } from '@aposin/ng-aquila/base';
import { NxDatepickerComponent } from '@aposin/ng-aquila/datefield';
import dayjs from 'dayjs';
import {
    NxRadioComponent,
    NxRadioGroupComponent,
} from '@aposin/ng-aquila/radio-button';
import { ProfessionService } from './services/profession.service';
import { lastValueFrom } from 'rxjs';
import { NxSliderComponent } from '@aposin/ng-aquila/slider';
import { RessourceService } from './services/ressource.service';
import { QuoteService } from './services/quote.service';
import { JsonPipe } from '@angular/common';

export const MY_FORMATS = {
    parse: {
        dateInput: 'DD.MM.YYYY',
    },
    display: {
        dateInput: 'DD.MM.YYYY',
        monthYearLabel: 'MMM YYYY',
        dateA11yLabel: 'LL',
        monthYearA11yLabel: 'MMMM YYYY',
    },
};

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        NxButtonModule,
        NxCheckboxModule,
        NxDocumentationIconModule,
        NxDropdownModule,
        NxFooterModule,
        NxFormfieldModule,
        NxGridModule,
        NxHeadlineModule,
        NxIconModule,
        NxInputModule,
        NxLinkModule,
        NxMessageModule,
        NxModalModule,
        NxOverlayModule,
        NxPopoverModule,
        NxSmallStageModule,
        NxFormfieldComponent,
        NxDatefieldDirective,
        NxInputDirective,
        FormsModule,
        NxFormfieldHintDirective,
        NxMessageComponent,
        NxDatepickerToggleComponent,
        NxFormfieldSuffixDirective,
        NxDatepickerComponent,
        NxErrorComponent,
        NxFormfieldErrorDirective,
        NxIsoDateModule,
        NxRadioComponent,
        NxRadioGroupComponent,
        NxLabelComponent,
        NxSliderComponent,
        JsonPipe,
    ],
    providers: [{ provide: NX_DATE_FORMATS, useValue: MY_FORMATS }],
    templateUrl: './app.component.html',
})
export class AppComponent {
    formGroup: FormGroup;
    minDate = dayjs().subtract(100, 'year').toDate();
    maxDate = dayjs().subtract(20, 'year').toDate();
    professions: string[] = []
    quoteResult: any
    private ressourceId: string = ''
    private readonly professionService = inject(ProfessionService)
    private readonly ressourceService = inject(RessourceService)
    private readonly quoteService = inject(QuoteService)

    constructor(readonly dialogService: NxDialogService) {
        this.formGroup = new FormBuilder().group({
            birthDate: [dayjs().subtract(20, 'year').format('YYYY-MM-DD'), Validators.required],
            versicherungsdauer: [67, [Validators.required, Validators.min(18), Validators.max(67)]],
            monatlicheRente: [67, [Validators.required, Validators.min(18), Validators.max(2500)]],
            zahlbeitrag: [67, [Validators.required, Validators.min(18), Validators.max(2500)]],
            profession: ['', Validators.required],
            smoker: ['0', Validators.required],
        });
    }

    async ngOnInit() {
        this.ressourceId = (await lastValueFrom(this.ressourceService.getRessourceId())).resourceId
        this.professions = await lastValueFrom(this.professionService.getProfessions())
    }

    async getQuote() {
        Object.keys(this.formGroup.controls).forEach(key => {
            const control = this.formGroup.get(key);
            control?.markAsTouched();
        });

        if (this.formGroup.invalid) {
            const errors = this.getFormValidationErrors();
            console.error('Form validation errors:', errors);
            return;
        }

        const quote = await lastValueFrom(this.quoteService.getQuote({
            birthDate: this.formGroup.get('birthDate')?.value,
            profession: this.formGroup.get('profession')?.value,
            zahlbeitrag: this.formGroup.get('zahlbeitrag')?.value,
            isSmoker: this.formGroup.get('smoker')?.value === '1',
            versicherungsdauer: this.getVersicherungsDauer(),
            ressourceId: this.ressourceId
        }));
        this.quoteResult = quote;
    }

    private getVersicherungsDauer(): number {
        const birthDate = dayjs(this.formGroup.get('birthDate')?.value);
        const targetAge = this.formGroup.get('versicherungsdauer')?.value;

        const currentAge = dayjs().diff(birthDate, 'year');

        const duration = targetAge - currentAge;

        return duration;
    }

    private getFormValidationErrors(): Record<string, unknown> {
        const errors: Record<string, unknown> = {};

        Object.keys(this.formGroup.controls).forEach(key => {
            const control = this.formGroup.get(key);
            if (control?.errors) {
                errors[key] = control.errors;
            }
        });

        return errors;
    }
}


import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import * as dayjs from 'dayjs';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IAuftrag, Auftrag } from '../auftrag.model';
import { AuftragService } from '../service/auftrag.service';
import { IStatus } from 'app/entities/status/status.model';
import { StatusService } from 'app/entities/status/service/status.service';
import { IPatner } from 'app/entities/patner/patner.model';
import { PatnerService } from 'app/entities/patner/service/patner.service';
import { IBediener } from 'app/entities/bediener/bediener.model';
import { BedienerService } from 'app/entities/bediener/service/bediener.service';

@Component({
  selector: 'jhi-auftrag-update',
  templateUrl: './auftrag-update.component.html',
})
export class AuftragUpdateComponent implements OnInit {
  isSaving = false;

  statusesSharedCollection: IStatus[] = [];
  patnersSharedCollection: IPatner[] = [];
  bedienersSharedCollection: IBediener[] = [];

  editForm = this.fb.group({
    id: [],
    erfasstAm: [],
    faelligAm: [],
    bezahl: [],
    bezahltAm: [],
    abgeschlossenAm: [],
    kommentar: [],
    status: [],
    kunde: [],
    bediener: [],
  });

  constructor(
    protected auftragService: AuftragService,
    protected statusService: StatusService,
    protected patnerService: PatnerService,
    protected bedienerService: BedienerService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ auftrag }) => {
      if (auftrag.id === undefined) {
        const today = dayjs().startOf('day');
        auftrag.erfasstAm = today;
        auftrag.faelligAm = today;
        auftrag.bezahltAm = today;
        auftrag.abgeschlossenAm = today;
      }

      this.updateForm(auftrag);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const auftrag = this.createFromForm();
    if (auftrag.id !== undefined) {
      this.subscribeToSaveResponse(this.auftragService.update(auftrag));
    } else {
      this.subscribeToSaveResponse(this.auftragService.create(auftrag));
    }
  }

  trackStatusById(index: number, item: IStatus): number {
    return item.id!;
  }

  trackPatnerById(index: number, item: IPatner): number {
    return item.id!;
  }

  trackBedienerById(index: number, item: IBediener): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAuftrag>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(auftrag: IAuftrag): void {
    this.editForm.patchValue({
      id: auftrag.id,
      erfasstAm: auftrag.erfasstAm ? auftrag.erfasstAm.format(DATE_TIME_FORMAT) : null,
      faelligAm: auftrag.faelligAm ? auftrag.faelligAm.format(DATE_TIME_FORMAT) : null,
      bezahl: auftrag.bezahl,
      bezahltAm: auftrag.bezahltAm ? auftrag.bezahltAm.format(DATE_TIME_FORMAT) : null,
      abgeschlossenAm: auftrag.abgeschlossenAm ? auftrag.abgeschlossenAm.format(DATE_TIME_FORMAT) : null,
      kommentar: auftrag.kommentar,
      status: auftrag.status,
      kunde: auftrag.kunde,
      bediener: auftrag.bediener,
    });

    this.statusesSharedCollection = this.statusService.addStatusToCollectionIfMissing(this.statusesSharedCollection, auftrag.status);
    this.patnersSharedCollection = this.patnerService.addPatnerToCollectionIfMissing(this.patnersSharedCollection, auftrag.kunde);
    this.bedienersSharedCollection = this.bedienerService.addBedienerToCollectionIfMissing(
      this.bedienersSharedCollection,
      auftrag.bediener
    );
  }

  protected loadRelationshipsOptions(): void {
    this.statusService
      .query()
      .pipe(map((res: HttpResponse<IStatus[]>) => res.body ?? []))
      .pipe(map((statuses: IStatus[]) => this.statusService.addStatusToCollectionIfMissing(statuses, this.editForm.get('status')!.value)))
      .subscribe((statuses: IStatus[]) => (this.statusesSharedCollection = statuses));

    this.patnerService
      .query()
      .pipe(map((res: HttpResponse<IPatner[]>) => res.body ?? []))
      .pipe(map((patners: IPatner[]) => this.patnerService.addPatnerToCollectionIfMissing(patners, this.editForm.get('kunde')!.value)))
      .subscribe((patners: IPatner[]) => (this.patnersSharedCollection = patners));

    this.bedienerService
      .query()
      .pipe(map((res: HttpResponse<IBediener[]>) => res.body ?? []))
      .pipe(
        map((bedieners: IBediener[]) =>
          this.bedienerService.addBedienerToCollectionIfMissing(bedieners, this.editForm.get('bediener')!.value)
        )
      )
      .subscribe((bedieners: IBediener[]) => (this.bedienersSharedCollection = bedieners));
  }

  protected createFromForm(): IAuftrag {
    return {
      ...new Auftrag(),
      id: this.editForm.get(['id'])!.value,
      erfasstAm: this.editForm.get(['erfasstAm'])!.value ? dayjs(this.editForm.get(['erfasstAm'])!.value, DATE_TIME_FORMAT) : undefined,
      faelligAm: this.editForm.get(['faelligAm'])!.value ? dayjs(this.editForm.get(['faelligAm'])!.value, DATE_TIME_FORMAT) : undefined,
      bezahl: this.editForm.get(['bezahl'])!.value,
      bezahltAm: this.editForm.get(['bezahltAm'])!.value ? dayjs(this.editForm.get(['bezahltAm'])!.value, DATE_TIME_FORMAT) : undefined,
      abgeschlossenAm: this.editForm.get(['abgeschlossenAm'])!.value
        ? dayjs(this.editForm.get(['abgeschlossenAm'])!.value, DATE_TIME_FORMAT)
        : undefined,
      kommentar: this.editForm.get(['kommentar'])!.value,
      status: this.editForm.get(['status'])!.value,
      kunde: this.editForm.get(['kunde'])!.value,
      bediener: this.editForm.get(['bediener'])!.value,
    };
  }
}

import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IRechnungKopf, RechnungKopf } from '../rechnung-kopf.model';
import { RechnungKopfService } from '../service/rechnung-kopf.service';
import { IAuftrag } from 'app/entities/auftrag/auftrag.model';
import { AuftragService } from 'app/entities/auftrag/service/auftrag.service';
import { IBediener } from 'app/entities/bediener/bediener.model';
import { BedienerService } from 'app/entities/bediener/service/bediener.service';
import { IPatner } from 'app/entities/patner/patner.model';
import { PatnerService } from 'app/entities/patner/service/patner.service';
import { IStatus } from 'app/entities/status/status.model';
import { StatusService } from 'app/entities/status/service/status.service';

@Component({
  selector: 'jhi-rechnung-kopf-update',
  templateUrl: './rechnung-kopf-update.component.html',
})
export class RechnungKopfUpdateComponent implements OnInit {
  isSaving = false;

  auftragsSharedCollection: IAuftrag[] = [];
  bedienersSharedCollection: IBediener[] = [];
  patnersSharedCollection: IPatner[] = [];
  statusesSharedCollection: IStatus[] = [];

  editForm = this.fb.group({
    id: [],
    auftrag: [],
    bediner: [],
    kunde: [],
    status: [],
  });

  constructor(
    protected rechnungKopfService: RechnungKopfService,
    protected auftragService: AuftragService,
    protected bedienerService: BedienerService,
    protected patnerService: PatnerService,
    protected statusService: StatusService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ rechnungKopf }) => {
      this.updateForm(rechnungKopf);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const rechnungKopf = this.createFromForm();
    if (rechnungKopf.id !== undefined) {
      this.subscribeToSaveResponse(this.rechnungKopfService.update(rechnungKopf));
    } else {
      this.subscribeToSaveResponse(this.rechnungKopfService.create(rechnungKopf));
    }
  }

  trackAuftragById(index: number, item: IAuftrag): number {
    return item.id!;
  }

  trackBedienerById(index: number, item: IBediener): number {
    return item.id!;
  }

  trackPatnerById(index: number, item: IPatner): number {
    return item.id!;
  }

  trackStatusById(index: number, item: IStatus): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IRechnungKopf>>): void {
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

  protected updateForm(rechnungKopf: IRechnungKopf): void {
    this.editForm.patchValue({
      id: rechnungKopf.id,
      auftrag: rechnungKopf.auftrag,
      bediner: rechnungKopf.bediner,
      kunde: rechnungKopf.kunde,
      status: rechnungKopf.status,
    });

    this.auftragsSharedCollection = this.auftragService.addAuftragToCollectionIfMissing(
      this.auftragsSharedCollection,
      rechnungKopf.auftrag
    );
    this.bedienersSharedCollection = this.bedienerService.addBedienerToCollectionIfMissing(
      this.bedienersSharedCollection,
      rechnungKopf.bediner
    );
    this.patnersSharedCollection = this.patnerService.addPatnerToCollectionIfMissing(this.patnersSharedCollection, rechnungKopf.kunde);
    this.statusesSharedCollection = this.statusService.addStatusToCollectionIfMissing(this.statusesSharedCollection, rechnungKopf.status);
  }

  protected loadRelationshipsOptions(): void {
    this.auftragService
      .query()
      .pipe(map((res: HttpResponse<IAuftrag[]>) => res.body ?? []))
      .pipe(
        map((auftrags: IAuftrag[]) => this.auftragService.addAuftragToCollectionIfMissing(auftrags, this.editForm.get('auftrag')!.value))
      )
      .subscribe((auftrags: IAuftrag[]) => (this.auftragsSharedCollection = auftrags));

    this.bedienerService
      .query()
      .pipe(map((res: HttpResponse<IBediener[]>) => res.body ?? []))
      .pipe(
        map((bedieners: IBediener[]) =>
          this.bedienerService.addBedienerToCollectionIfMissing(bedieners, this.editForm.get('bediner')!.value)
        )
      )
      .subscribe((bedieners: IBediener[]) => (this.bedienersSharedCollection = bedieners));

    this.patnerService
      .query()
      .pipe(map((res: HttpResponse<IPatner[]>) => res.body ?? []))
      .pipe(map((patners: IPatner[]) => this.patnerService.addPatnerToCollectionIfMissing(patners, this.editForm.get('kunde')!.value)))
      .subscribe((patners: IPatner[]) => (this.patnersSharedCollection = patners));

    this.statusService
      .query()
      .pipe(map((res: HttpResponse<IStatus[]>) => res.body ?? []))
      .pipe(map((statuses: IStatus[]) => this.statusService.addStatusToCollectionIfMissing(statuses, this.editForm.get('status')!.value)))
      .subscribe((statuses: IStatus[]) => (this.statusesSharedCollection = statuses));
  }

  protected createFromForm(): IRechnungKopf {
    return {
      ...new RechnungKopf(),
      id: this.editForm.get(['id'])!.value,
      auftrag: this.editForm.get(['auftrag'])!.value,
      bediner: this.editForm.get(['bediner'])!.value,
      kunde: this.editForm.get(['kunde'])!.value,
      status: this.editForm.get(['status'])!.value,
    };
  }
}

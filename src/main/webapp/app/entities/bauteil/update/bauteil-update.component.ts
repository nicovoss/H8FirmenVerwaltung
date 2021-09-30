import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IBauteil, Bauteil } from '../bauteil.model';
import { BauteilService } from '../service/bauteil.service';
import { IBauteilGruppe } from 'app/entities/bauteil-gruppe/bauteil-gruppe.model';
import { BauteilGruppeService } from 'app/entities/bauteil-gruppe/service/bauteil-gruppe.service';

@Component({
  selector: 'jhi-bauteil-update',
  templateUrl: './bauteil-update.component.html',
})
export class BauteilUpdateComponent implements OnInit {
  isSaving = false;

  bauteilGruppesSharedCollection: IBauteilGruppe[] = [];

  editForm = this.fb.group({
    id: [],
    name: [],
    bauteilgruppe: [],
  });

  constructor(
    protected bauteilService: BauteilService,
    protected bauteilGruppeService: BauteilGruppeService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ bauteil }) => {
      this.updateForm(bauteil);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const bauteil = this.createFromForm();
    if (bauteil.id !== undefined) {
      this.subscribeToSaveResponse(this.bauteilService.update(bauteil));
    } else {
      this.subscribeToSaveResponse(this.bauteilService.create(bauteil));
    }
  }

  trackBauteilGruppeById(index: number, item: IBauteilGruppe): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IBauteil>>): void {
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

  protected updateForm(bauteil: IBauteil): void {
    this.editForm.patchValue({
      id: bauteil.id,
      name: bauteil.name,
      bauteilgruppe: bauteil.bauteilgruppe,
    });

    this.bauteilGruppesSharedCollection = this.bauteilGruppeService.addBauteilGruppeToCollectionIfMissing(
      this.bauteilGruppesSharedCollection,
      bauteil.bauteilgruppe
    );
  }

  protected loadRelationshipsOptions(): void {
    this.bauteilGruppeService
      .query()
      .pipe(map((res: HttpResponse<IBauteilGruppe[]>) => res.body ?? []))
      .pipe(
        map((bauteilGruppes: IBauteilGruppe[]) =>
          this.bauteilGruppeService.addBauteilGruppeToCollectionIfMissing(bauteilGruppes, this.editForm.get('bauteilgruppe')!.value)
        )
      )
      .subscribe((bauteilGruppes: IBauteilGruppe[]) => (this.bauteilGruppesSharedCollection = bauteilGruppes));
  }

  protected createFromForm(): IBauteil {
    return {
      ...new Bauteil(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      bauteilgruppe: this.editForm.get(['bauteilgruppe'])!.value,
    };
  }
}

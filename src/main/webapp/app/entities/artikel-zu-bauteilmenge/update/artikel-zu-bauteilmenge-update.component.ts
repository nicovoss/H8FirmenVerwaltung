import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IArtikelZuBauteilmenge, ArtikelZuBauteilmenge } from '../artikel-zu-bauteilmenge.model';
import { ArtikelZuBauteilmengeService } from '../service/artikel-zu-bauteilmenge.service';
import { IBauteil } from 'app/entities/bauteil/bauteil.model';
import { BauteilService } from 'app/entities/bauteil/service/bauteil.service';
import { IArtikel } from 'app/entities/artikel/artikel.model';
import { ArtikelService } from 'app/entities/artikel/service/artikel.service';

@Component({
  selector: 'jhi-artikel-zu-bauteilmenge-update',
  templateUrl: './artikel-zu-bauteilmenge-update.component.html',
})
export class ArtikelZuBauteilmengeUpdateComponent implements OnInit {
  isSaving = false;

  bauteilsSharedCollection: IBauteil[] = [];
  artikelsSharedCollection: IArtikel[] = [];

  editForm = this.fb.group({
    id: [],
    menge: [],
    bauteil: [],
    artikel: [],
  });

  constructor(
    protected artikelZuBauteilmengeService: ArtikelZuBauteilmengeService,
    protected bauteilService: BauteilService,
    protected artikelService: ArtikelService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ artikelZuBauteilmenge }) => {
      this.updateForm(artikelZuBauteilmenge);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const artikelZuBauteilmenge = this.createFromForm();
    if (artikelZuBauteilmenge.id !== undefined) {
      this.subscribeToSaveResponse(this.artikelZuBauteilmengeService.update(artikelZuBauteilmenge));
    } else {
      this.subscribeToSaveResponse(this.artikelZuBauteilmengeService.create(artikelZuBauteilmenge));
    }
  }

  trackBauteilById(index: number, item: IBauteil): number {
    return item.id!;
  }

  trackArtikelById(index: number, item: IArtikel): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IArtikelZuBauteilmenge>>): void {
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

  protected updateForm(artikelZuBauteilmenge: IArtikelZuBauteilmenge): void {
    this.editForm.patchValue({
      id: artikelZuBauteilmenge.id,
      menge: artikelZuBauteilmenge.menge,
      bauteil: artikelZuBauteilmenge.bauteil,
      artikel: artikelZuBauteilmenge.artikel,
    });

    this.bauteilsSharedCollection = this.bauteilService.addBauteilToCollectionIfMissing(
      this.bauteilsSharedCollection,
      artikelZuBauteilmenge.bauteil
    );
    this.artikelsSharedCollection = this.artikelService.addArtikelToCollectionIfMissing(
      this.artikelsSharedCollection,
      artikelZuBauteilmenge.artikel
    );
  }

  protected loadRelationshipsOptions(): void {
    this.bauteilService
      .query()
      .pipe(map((res: HttpResponse<IBauteil[]>) => res.body ?? []))
      .pipe(
        map((bauteils: IBauteil[]) => this.bauteilService.addBauteilToCollectionIfMissing(bauteils, this.editForm.get('bauteil')!.value))
      )
      .subscribe((bauteils: IBauteil[]) => (this.bauteilsSharedCollection = bauteils));

    this.artikelService
      .query()
      .pipe(map((res: HttpResponse<IArtikel[]>) => res.body ?? []))
      .pipe(
        map((artikels: IArtikel[]) => this.artikelService.addArtikelToCollectionIfMissing(artikels, this.editForm.get('artikel')!.value))
      )
      .subscribe((artikels: IArtikel[]) => (this.artikelsSharedCollection = artikels));
  }

  protected createFromForm(): IArtikelZuBauteilmenge {
    return {
      ...new ArtikelZuBauteilmenge(),
      id: this.editForm.get(['id'])!.value,
      menge: this.editForm.get(['menge'])!.value,
      bauteil: this.editForm.get(['bauteil'])!.value,
      artikel: this.editForm.get(['artikel'])!.value,
    };
  }
}

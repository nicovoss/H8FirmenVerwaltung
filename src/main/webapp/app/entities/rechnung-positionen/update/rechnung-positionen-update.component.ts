import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IRechnungPositionen, RechnungPositionen } from '../rechnung-positionen.model';
import { RechnungPositionenService } from '../service/rechnung-positionen.service';
import { IRechnungKopf } from 'app/entities/rechnung-kopf/rechnung-kopf.model';
import { RechnungKopfService } from 'app/entities/rechnung-kopf/service/rechnung-kopf.service';
import { IArtikel } from 'app/entities/artikel/artikel.model';
import { ArtikelService } from 'app/entities/artikel/service/artikel.service';

@Component({
  selector: 'jhi-rechnung-positionen-update',
  templateUrl: './rechnung-positionen-update.component.html',
})
export class RechnungPositionenUpdateComponent implements OnInit {
  isSaving = false;

  rechnungKopfsSharedCollection: IRechnungKopf[] = [];
  artikelsSharedCollection: IArtikel[] = [];

  editForm = this.fb.group({
    id: [],
    artikelName: [],
    artikelBeschreibung: [],
    artikelPreis: [],
    menge: [null, [Validators.required]],
    rechnungskopf: [],
    artikel: [],
  });

  constructor(
    protected rechnungPositionenService: RechnungPositionenService,
    protected rechnungKopfService: RechnungKopfService,
    protected artikelService: ArtikelService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ rechnungPositionen }) => {
      this.updateForm(rechnungPositionen);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const rechnungPositionen = this.createFromForm();
    if (rechnungPositionen.id !== undefined) {
      this.subscribeToSaveResponse(this.rechnungPositionenService.update(rechnungPositionen));
    } else {
      this.subscribeToSaveResponse(this.rechnungPositionenService.create(rechnungPositionen));
    }
  }

  trackRechnungKopfById(index: number, item: IRechnungKopf): number {
    return item.id!;
  }

  trackArtikelById(index: number, item: IArtikel): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IRechnungPositionen>>): void {
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

  protected updateForm(rechnungPositionen: IRechnungPositionen): void {
    this.editForm.patchValue({
      id: rechnungPositionen.id,
      artikelName: rechnungPositionen.artikelName,
      artikelBeschreibung: rechnungPositionen.artikelBeschreibung,
      artikelPreis: rechnungPositionen.artikelPreis,
      menge: rechnungPositionen.menge,
      rechnungskopf: rechnungPositionen.rechnungskopf,
      artikel: rechnungPositionen.artikel,
    });

    this.rechnungKopfsSharedCollection = this.rechnungKopfService.addRechnungKopfToCollectionIfMissing(
      this.rechnungKopfsSharedCollection,
      rechnungPositionen.rechnungskopf
    );
    this.artikelsSharedCollection = this.artikelService.addArtikelToCollectionIfMissing(
      this.artikelsSharedCollection,
      rechnungPositionen.artikel
    );
  }

  protected loadRelationshipsOptions(): void {
    this.rechnungKopfService
      .query()
      .pipe(map((res: HttpResponse<IRechnungKopf[]>) => res.body ?? []))
      .pipe(
        map((rechnungKopfs: IRechnungKopf[]) =>
          this.rechnungKopfService.addRechnungKopfToCollectionIfMissing(rechnungKopfs, this.editForm.get('rechnungskopf')!.value)
        )
      )
      .subscribe((rechnungKopfs: IRechnungKopf[]) => (this.rechnungKopfsSharedCollection = rechnungKopfs));

    this.artikelService
      .query()
      .pipe(map((res: HttpResponse<IArtikel[]>) => res.body ?? []))
      .pipe(
        map((artikels: IArtikel[]) => this.artikelService.addArtikelToCollectionIfMissing(artikels, this.editForm.get('artikel')!.value))
      )
      .subscribe((artikels: IArtikel[]) => (this.artikelsSharedCollection = artikels));
  }

  protected createFromForm(): IRechnungPositionen {
    return {
      ...new RechnungPositionen(),
      id: this.editForm.get(['id'])!.value,
      artikelName: this.editForm.get(['artikelName'])!.value,
      artikelBeschreibung: this.editForm.get(['artikelBeschreibung'])!.value,
      artikelPreis: this.editForm.get(['artikelPreis'])!.value,
      menge: this.editForm.get(['menge'])!.value,
      rechnungskopf: this.editForm.get(['rechnungskopf'])!.value,
      artikel: this.editForm.get(['artikel'])!.value,
    };
  }
}

import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IAuftragPositionen, AuftragPositionen } from '../auftrag-positionen.model';
import { AuftragPositionenService } from '../service/auftrag-positionen.service';
import { IAuftrag } from 'app/entities/auftrag/auftrag.model';
import { AuftragService } from 'app/entities/auftrag/service/auftrag.service';
import { IArtikel } from 'app/entities/artikel/artikel.model';
import { ArtikelService } from 'app/entities/artikel/service/artikel.service';

@Component({
  selector: 'jhi-auftrag-positionen-update',
  templateUrl: './auftrag-positionen-update.component.html',
})
export class AuftragPositionenUpdateComponent implements OnInit {
  isSaving = false;

  auftragsSharedCollection: IAuftrag[] = [];
  artikelsSharedCollection: IArtikel[] = [];

  editForm = this.fb.group({
    id: [],
    menge: [],
    auftrag: [],
    artikel: [],
  });

  constructor(
    protected auftragPositionenService: AuftragPositionenService,
    protected auftragService: AuftragService,
    protected artikelService: ArtikelService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ auftragPositionen }) => {
      this.updateForm(auftragPositionen);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const auftragPositionen = this.createFromForm();
    if (auftragPositionen.id !== undefined) {
      this.subscribeToSaveResponse(this.auftragPositionenService.update(auftragPositionen));
    } else {
      this.subscribeToSaveResponse(this.auftragPositionenService.create(auftragPositionen));
    }
  }

  trackAuftragById(index: number, item: IAuftrag): number {
    return item.id!;
  }

  trackArtikelById(index: number, item: IArtikel): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAuftragPositionen>>): void {
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

  protected updateForm(auftragPositionen: IAuftragPositionen): void {
    this.editForm.patchValue({
      id: auftragPositionen.id,
      menge: auftragPositionen.menge,
      auftrag: auftragPositionen.auftrag,
      artikel: auftragPositionen.artikel,
    });

    this.auftragsSharedCollection = this.auftragService.addAuftragToCollectionIfMissing(
      this.auftragsSharedCollection,
      auftragPositionen.auftrag
    );
    this.artikelsSharedCollection = this.artikelService.addArtikelToCollectionIfMissing(
      this.artikelsSharedCollection,
      auftragPositionen.artikel
    );
  }

  protected loadRelationshipsOptions(): void {
    this.auftragService
      .query()
      .pipe(map((res: HttpResponse<IAuftrag[]>) => res.body ?? []))
      .pipe(
        map((auftrags: IAuftrag[]) => this.auftragService.addAuftragToCollectionIfMissing(auftrags, this.editForm.get('auftrag')!.value))
      )
      .subscribe((auftrags: IAuftrag[]) => (this.auftragsSharedCollection = auftrags));

    this.artikelService
      .query()
      .pipe(map((res: HttpResponse<IArtikel[]>) => res.body ?? []))
      .pipe(
        map((artikels: IArtikel[]) => this.artikelService.addArtikelToCollectionIfMissing(artikels, this.editForm.get('artikel')!.value))
      )
      .subscribe((artikels: IArtikel[]) => (this.artikelsSharedCollection = artikels));
  }

  protected createFromForm(): IAuftragPositionen {
    return {
      ...new AuftragPositionen(),
      id: this.editForm.get(['id'])!.value,
      menge: this.editForm.get(['menge'])!.value,
      auftrag: this.editForm.get(['auftrag'])!.value,
      artikel: this.editForm.get(['artikel'])!.value,
    };
  }
}

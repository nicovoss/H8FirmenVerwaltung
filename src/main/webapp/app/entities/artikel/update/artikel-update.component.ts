import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IArtikel, Artikel } from '../artikel.model';
import { ArtikelService } from '../service/artikel.service';
import { IArtikelTyp } from 'app/entities/artikel-typ/artikel-typ.model';
import { ArtikelTypService } from 'app/entities/artikel-typ/service/artikel-typ.service';

@Component({
  selector: 'jhi-artikel-update',
  templateUrl: './artikel-update.component.html',
})
export class ArtikelUpdateComponent implements OnInit {
  isSaving = false;

  artikelTypsSharedCollection: IArtikelTyp[] = [];

  editForm = this.fb.group({
    id: [],
    name: [],
    artikelTyp: [],
  });

  constructor(
    protected artikelService: ArtikelService,
    protected artikelTypService: ArtikelTypService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ artikel }) => {
      this.updateForm(artikel);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const artikel = this.createFromForm();
    if (artikel.id !== undefined) {
      this.subscribeToSaveResponse(this.artikelService.update(artikel));
    } else {
      this.subscribeToSaveResponse(this.artikelService.create(artikel));
    }
  }

  trackArtikelTypById(index: number, item: IArtikelTyp): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IArtikel>>): void {
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

  protected updateForm(artikel: IArtikel): void {
    this.editForm.patchValue({
      id: artikel.id,
      name: artikel.name,
      artikelTyp: artikel.artikelTyp,
    });

    this.artikelTypsSharedCollection = this.artikelTypService.addArtikelTypToCollectionIfMissing(
      this.artikelTypsSharedCollection,
      artikel.artikelTyp
    );
  }

  protected loadRelationshipsOptions(): void {
    this.artikelTypService
      .query()
      .pipe(map((res: HttpResponse<IArtikelTyp[]>) => res.body ?? []))
      .pipe(
        map((artikelTyps: IArtikelTyp[]) =>
          this.artikelTypService.addArtikelTypToCollectionIfMissing(artikelTyps, this.editForm.get('artikelTyp')!.value)
        )
      )
      .subscribe((artikelTyps: IArtikelTyp[]) => (this.artikelTypsSharedCollection = artikelTyps));
  }

  protected createFromForm(): IArtikel {
    return {
      ...new Artikel(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      artikelTyp: this.editForm.get(['artikelTyp'])!.value,
    };
  }
}

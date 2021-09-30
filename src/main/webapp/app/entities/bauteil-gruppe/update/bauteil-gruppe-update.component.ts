import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IBauteilGruppe, BauteilGruppe } from '../bauteil-gruppe.model';
import { BauteilGruppeService } from '../service/bauteil-gruppe.service';
import { IArtikelTyp } from 'app/entities/artikel-typ/artikel-typ.model';
import { ArtikelTypService } from 'app/entities/artikel-typ/service/artikel-typ.service';

@Component({
  selector: 'jhi-bauteil-gruppe-update',
  templateUrl: './bauteil-gruppe-update.component.html',
})
export class BauteilGruppeUpdateComponent implements OnInit {
  isSaving = false;

  artikelTypsSharedCollection: IArtikelTyp[] = [];

  editForm = this.fb.group({
    id: [],
    name: [],
    artikelTyp: [],
  });

  constructor(
    protected bauteilGruppeService: BauteilGruppeService,
    protected artikelTypService: ArtikelTypService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ bauteilGruppe }) => {
      this.updateForm(bauteilGruppe);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const bauteilGruppe = this.createFromForm();
    if (bauteilGruppe.id !== undefined) {
      this.subscribeToSaveResponse(this.bauteilGruppeService.update(bauteilGruppe));
    } else {
      this.subscribeToSaveResponse(this.bauteilGruppeService.create(bauteilGruppe));
    }
  }

  trackArtikelTypById(index: number, item: IArtikelTyp): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IBauteilGruppe>>): void {
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

  protected updateForm(bauteilGruppe: IBauteilGruppe): void {
    this.editForm.patchValue({
      id: bauteilGruppe.id,
      name: bauteilGruppe.name,
      artikelTyp: bauteilGruppe.artikelTyp,
    });

    this.artikelTypsSharedCollection = this.artikelTypService.addArtikelTypToCollectionIfMissing(
      this.artikelTypsSharedCollection,
      bauteilGruppe.artikelTyp
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

  protected createFromForm(): IBauteilGruppe {
    return {
      ...new BauteilGruppe(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      artikelTyp: this.editForm.get(['artikelTyp'])!.value,
    };
  }
}

import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IArtikelTyp, ArtikelTyp } from '../artikel-typ.model';
import { ArtikelTypService } from '../service/artikel-typ.service';

@Component({
  selector: 'jhi-artikel-typ-update',
  templateUrl: './artikel-typ-update.component.html',
})
export class ArtikelTypUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    name: [],
  });

  constructor(protected artikelTypService: ArtikelTypService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ artikelTyp }) => {
      this.updateForm(artikelTyp);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const artikelTyp = this.createFromForm();
    if (artikelTyp.id !== undefined) {
      this.subscribeToSaveResponse(this.artikelTypService.update(artikelTyp));
    } else {
      this.subscribeToSaveResponse(this.artikelTypService.create(artikelTyp));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IArtikelTyp>>): void {
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

  protected updateForm(artikelTyp: IArtikelTyp): void {
    this.editForm.patchValue({
      id: artikelTyp.id,
      name: artikelTyp.name,
    });
  }

  protected createFromForm(): IArtikelTyp {
    return {
      ...new ArtikelTyp(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
    };
  }
}

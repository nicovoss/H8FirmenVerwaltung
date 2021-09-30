import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IBediener, Bediener } from '../bediener.model';
import { BedienerService } from '../service/bediener.service';

@Component({
  selector: 'jhi-bediener-update',
  templateUrl: './bediener-update.component.html',
})
export class BedienerUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    vname: [],
    name: [],
  });

  constructor(protected bedienerService: BedienerService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ bediener }) => {
      this.updateForm(bediener);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const bediener = this.createFromForm();
    if (bediener.id !== undefined) {
      this.subscribeToSaveResponse(this.bedienerService.update(bediener));
    } else {
      this.subscribeToSaveResponse(this.bedienerService.create(bediener));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IBediener>>): void {
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

  protected updateForm(bediener: IBediener): void {
    this.editForm.patchValue({
      id: bediener.id,
      vname: bediener.vname,
      name: bediener.name,
    });
  }

  protected createFromForm(): IBediener {
    return {
      ...new Bediener(),
      id: this.editForm.get(['id'])!.value,
      vname: this.editForm.get(['vname'])!.value,
      name: this.editForm.get(['name'])!.value,
    };
  }
}

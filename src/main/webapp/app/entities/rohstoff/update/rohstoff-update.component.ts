import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IRohstoff, Rohstoff } from '../rohstoff.model';
import { RohstoffService } from '../service/rohstoff.service';

@Component({
  selector: 'jhi-rohstoff-update',
  templateUrl: './rohstoff-update.component.html',
})
export class RohstoffUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    name: [],
    preis: [],
  });

  constructor(protected rohstoffService: RohstoffService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ rohstoff }) => {
      this.updateForm(rohstoff);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const rohstoff = this.createFromForm();
    if (rohstoff.id !== undefined) {
      this.subscribeToSaveResponse(this.rohstoffService.update(rohstoff));
    } else {
      this.subscribeToSaveResponse(this.rohstoffService.create(rohstoff));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IRohstoff>>): void {
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

  protected updateForm(rohstoff: IRohstoff): void {
    this.editForm.patchValue({
      id: rohstoff.id,
      name: rohstoff.name,
      preis: rohstoff.preis,
    });
  }

  protected createFromForm(): IRohstoff {
    return {
      ...new Rohstoff(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      preis: this.editForm.get(['preis'])!.value,
    };
  }
}

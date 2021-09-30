import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IOrganistation, Organistation } from '../organistation.model';
import { OrganistationService } from '../service/organistation.service';

@Component({
  selector: 'jhi-organistation-update',
  templateUrl: './organistation-update.component.html',
})
export class OrganistationUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    orgaId: [null, [Validators.required]],
    name: [],
  });

  constructor(protected organistationService: OrganistationService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ organistation }) => {
      this.updateForm(organistation);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const organistation = this.createFromForm();
    if (organistation.id !== undefined) {
      this.subscribeToSaveResponse(this.organistationService.update(organistation));
    } else {
      this.subscribeToSaveResponse(this.organistationService.create(organistation));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IOrganistation>>): void {
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

  protected updateForm(organistation: IOrganistation): void {
    this.editForm.patchValue({
      id: organistation.id,
      orgaId: organistation.orgaId,
      name: organistation.name,
    });
  }

  protected createFromForm(): IOrganistation {
    return {
      ...new Organistation(),
      id: this.editForm.get(['id'])!.value,
      orgaId: this.editForm.get(['orgaId'])!.value,
      name: this.editForm.get(['name'])!.value,
    };
  }
}

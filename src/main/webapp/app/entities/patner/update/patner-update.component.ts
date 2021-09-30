import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IPatner, Patner } from '../patner.model';
import { PatnerService } from '../service/patner.service';
import { IOrganistation } from 'app/entities/organistation/organistation.model';
import { OrganistationService } from 'app/entities/organistation/service/organistation.service';

@Component({
  selector: 'jhi-patner-update',
  templateUrl: './patner-update.component.html',
})
export class PatnerUpdateComponent implements OnInit {
  isSaving = false;

  organistationsSharedCollection: IOrganistation[] = [];

  editForm = this.fb.group({
    id: [],
    vname: [],
    name: [],
    organistation: [],
  });

  constructor(
    protected patnerService: PatnerService,
    protected organistationService: OrganistationService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ patner }) => {
      this.updateForm(patner);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const patner = this.createFromForm();
    if (patner.id !== undefined) {
      this.subscribeToSaveResponse(this.patnerService.update(patner));
    } else {
      this.subscribeToSaveResponse(this.patnerService.create(patner));
    }
  }

  trackOrganistationById(index: number, item: IOrganistation): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPatner>>): void {
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

  protected updateForm(patner: IPatner): void {
    this.editForm.patchValue({
      id: patner.id,
      vname: patner.vname,
      name: patner.name,
      organistation: patner.organistation,
    });

    this.organistationsSharedCollection = this.organistationService.addOrganistationToCollectionIfMissing(
      this.organistationsSharedCollection,
      patner.organistation
    );
  }

  protected loadRelationshipsOptions(): void {
    this.organistationService
      .query()
      .pipe(map((res: HttpResponse<IOrganistation[]>) => res.body ?? []))
      .pipe(
        map((organistations: IOrganistation[]) =>
          this.organistationService.addOrganistationToCollectionIfMissing(organistations, this.editForm.get('organistation')!.value)
        )
      )
      .subscribe((organistations: IOrganistation[]) => (this.organistationsSharedCollection = organistations));
  }

  protected createFromForm(): IPatner {
    return {
      ...new Patner(),
      id: this.editForm.get(['id'])!.value,
      vname: this.editForm.get(['vname'])!.value,
      name: this.editForm.get(['name'])!.value,
      organistation: this.editForm.get(['organistation'])!.value,
    };
  }
}

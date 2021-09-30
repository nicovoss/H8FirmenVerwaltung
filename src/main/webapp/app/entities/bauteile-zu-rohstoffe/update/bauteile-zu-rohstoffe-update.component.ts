import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IBauteileZuRohstoffe, BauteileZuRohstoffe } from '../bauteile-zu-rohstoffe.model';
import { BauteileZuRohstoffeService } from '../service/bauteile-zu-rohstoffe.service';
import { IBauteil } from 'app/entities/bauteil/bauteil.model';
import { BauteilService } from 'app/entities/bauteil/service/bauteil.service';
import { IRohstoff } from 'app/entities/rohstoff/rohstoff.model';
import { RohstoffService } from 'app/entities/rohstoff/service/rohstoff.service';

@Component({
  selector: 'jhi-bauteile-zu-rohstoffe-update',
  templateUrl: './bauteile-zu-rohstoffe-update.component.html',
})
export class BauteileZuRohstoffeUpdateComponent implements OnInit {
  isSaving = false;

  bauteilsSharedCollection: IBauteil[] = [];
  rohstoffsSharedCollection: IRohstoff[] = [];

  editForm = this.fb.group({
    id: [],
    menge: [],
    bauteil: [],
    rohstoff: [],
  });

  constructor(
    protected bauteileZuRohstoffeService: BauteileZuRohstoffeService,
    protected bauteilService: BauteilService,
    protected rohstoffService: RohstoffService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ bauteileZuRohstoffe }) => {
      this.updateForm(bauteileZuRohstoffe);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const bauteileZuRohstoffe = this.createFromForm();
    if (bauteileZuRohstoffe.id !== undefined) {
      this.subscribeToSaveResponse(this.bauteileZuRohstoffeService.update(bauteileZuRohstoffe));
    } else {
      this.subscribeToSaveResponse(this.bauteileZuRohstoffeService.create(bauteileZuRohstoffe));
    }
  }

  trackBauteilById(index: number, item: IBauteil): number {
    return item.id!;
  }

  trackRohstoffById(index: number, item: IRohstoff): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IBauteileZuRohstoffe>>): void {
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

  protected updateForm(bauteileZuRohstoffe: IBauteileZuRohstoffe): void {
    this.editForm.patchValue({
      id: bauteileZuRohstoffe.id,
      menge: bauteileZuRohstoffe.menge,
      bauteil: bauteileZuRohstoffe.bauteil,
      rohstoff: bauteileZuRohstoffe.rohstoff,
    });

    this.bauteilsSharedCollection = this.bauteilService.addBauteilToCollectionIfMissing(
      this.bauteilsSharedCollection,
      bauteileZuRohstoffe.bauteil
    );
    this.rohstoffsSharedCollection = this.rohstoffService.addRohstoffToCollectionIfMissing(
      this.rohstoffsSharedCollection,
      bauteileZuRohstoffe.rohstoff
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

    this.rohstoffService
      .query()
      .pipe(map((res: HttpResponse<IRohstoff[]>) => res.body ?? []))
      .pipe(
        map((rohstoffs: IRohstoff[]) =>
          this.rohstoffService.addRohstoffToCollectionIfMissing(rohstoffs, this.editForm.get('rohstoff')!.value)
        )
      )
      .subscribe((rohstoffs: IRohstoff[]) => (this.rohstoffsSharedCollection = rohstoffs));
  }

  protected createFromForm(): IBauteileZuRohstoffe {
    return {
      ...new BauteileZuRohstoffe(),
      id: this.editForm.get(['id'])!.value,
      menge: this.editForm.get(['menge'])!.value,
      bauteil: this.editForm.get(['bauteil'])!.value,
      rohstoff: this.editForm.get(['rohstoff'])!.value,
    };
  }
}

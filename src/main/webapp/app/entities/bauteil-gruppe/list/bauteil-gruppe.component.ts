import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IBauteilGruppe } from '../bauteil-gruppe.model';
import { BauteilGruppeService } from '../service/bauteil-gruppe.service';
import { BauteilGruppeDeleteDialogComponent } from '../delete/bauteil-gruppe-delete-dialog.component';

@Component({
  selector: 'jhi-bauteil-gruppe',
  templateUrl: './bauteil-gruppe.component.html',
})
export class BauteilGruppeComponent implements OnInit {
  bauteilGruppes?: IBauteilGruppe[];
  isLoading = false;

  constructor(protected bauteilGruppeService: BauteilGruppeService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.bauteilGruppeService.query().subscribe(
      (res: HttpResponse<IBauteilGruppe[]>) => {
        this.isLoading = false;
        this.bauteilGruppes = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IBauteilGruppe): number {
    return item.id!;
  }

  delete(bauteilGruppe: IBauteilGruppe): void {
    const modalRef = this.modalService.open(BauteilGruppeDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.bauteilGruppe = bauteilGruppe;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}

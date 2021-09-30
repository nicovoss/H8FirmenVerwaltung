import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IRechnungKopf } from '../rechnung-kopf.model';
import { RechnungKopfService } from '../service/rechnung-kopf.service';
import { RechnungKopfDeleteDialogComponent } from '../delete/rechnung-kopf-delete-dialog.component';

@Component({
  selector: 'jhi-rechnung-kopf',
  templateUrl: './rechnung-kopf.component.html',
})
export class RechnungKopfComponent implements OnInit {
  rechnungKopfs?: IRechnungKopf[];
  isLoading = false;

  constructor(protected rechnungKopfService: RechnungKopfService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.rechnungKopfService.query().subscribe(
      (res: HttpResponse<IRechnungKopf[]>) => {
        this.isLoading = false;
        this.rechnungKopfs = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IRechnungKopf): number {
    return item.id!;
  }

  delete(rechnungKopf: IRechnungKopf): void {
    const modalRef = this.modalService.open(RechnungKopfDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.rechnungKopf = rechnungKopf;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}

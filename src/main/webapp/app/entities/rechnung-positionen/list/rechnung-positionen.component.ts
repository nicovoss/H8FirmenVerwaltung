import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IRechnungPositionen } from '../rechnung-positionen.model';
import { RechnungPositionenService } from '../service/rechnung-positionen.service';
import { RechnungPositionenDeleteDialogComponent } from '../delete/rechnung-positionen-delete-dialog.component';

@Component({
  selector: 'jhi-rechnung-positionen',
  templateUrl: './rechnung-positionen.component.html',
})
export class RechnungPositionenComponent implements OnInit {
  rechnungPositionens?: IRechnungPositionen[];
  isLoading = false;

  constructor(protected rechnungPositionenService: RechnungPositionenService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.rechnungPositionenService.query().subscribe(
      (res: HttpResponse<IRechnungPositionen[]>) => {
        this.isLoading = false;
        this.rechnungPositionens = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IRechnungPositionen): number {
    return item.id!;
  }

  delete(rechnungPositionen: IRechnungPositionen): void {
    const modalRef = this.modalService.open(RechnungPositionenDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.rechnungPositionen = rechnungPositionen;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}

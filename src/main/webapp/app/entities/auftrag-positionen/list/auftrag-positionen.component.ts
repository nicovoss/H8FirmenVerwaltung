import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IAuftragPositionen } from '../auftrag-positionen.model';
import { AuftragPositionenService } from '../service/auftrag-positionen.service';
import { AuftragPositionenDeleteDialogComponent } from '../delete/auftrag-positionen-delete-dialog.component';

@Component({
  selector: 'jhi-auftrag-positionen',
  templateUrl: './auftrag-positionen.component.html',
})
export class AuftragPositionenComponent implements OnInit {
  auftragPositionens?: IAuftragPositionen[];
  isLoading = false;

  constructor(protected auftragPositionenService: AuftragPositionenService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.auftragPositionenService.query().subscribe(
      (res: HttpResponse<IAuftragPositionen[]>) => {
        this.isLoading = false;
        this.auftragPositionens = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IAuftragPositionen): number {
    return item.id!;
  }

  delete(auftragPositionen: IAuftragPositionen): void {
    const modalRef = this.modalService.open(AuftragPositionenDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.auftragPositionen = auftragPositionen;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IAuftrag } from '../auftrag.model';
import { AuftragService } from '../service/auftrag.service';
import { AuftragDeleteDialogComponent } from '../delete/auftrag-delete-dialog.component';

@Component({
  selector: 'jhi-auftrag',
  templateUrl: './auftrag.component.html',
})
export class AuftragComponent implements OnInit {
  auftrags?: IAuftrag[];
  isLoading = false;

  constructor(protected auftragService: AuftragService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.auftragService.query().subscribe(
      (res: HttpResponse<IAuftrag[]>) => {
        this.isLoading = false;
        this.auftrags = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IAuftrag): number {
    return item.id!;
  }

  delete(auftrag: IAuftrag): void {
    const modalRef = this.modalService.open(AuftragDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.auftrag = auftrag;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}

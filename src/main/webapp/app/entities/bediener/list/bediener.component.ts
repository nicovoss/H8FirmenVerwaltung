import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IBediener } from '../bediener.model';
import { BedienerService } from '../service/bediener.service';
import { BedienerDeleteDialogComponent } from '../delete/bediener-delete-dialog.component';

@Component({
  selector: 'jhi-bediener',
  templateUrl: './bediener.component.html',
})
export class BedienerComponent implements OnInit {
  bedieners?: IBediener[];
  isLoading = false;

  constructor(protected bedienerService: BedienerService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.bedienerService.query().subscribe(
      (res: HttpResponse<IBediener[]>) => {
        this.isLoading = false;
        this.bedieners = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IBediener): number {
    return item.id!;
  }

  delete(bediener: IBediener): void {
    const modalRef = this.modalService.open(BedienerDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.bediener = bediener;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}

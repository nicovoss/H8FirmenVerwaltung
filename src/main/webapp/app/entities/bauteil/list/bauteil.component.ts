import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IBauteil } from '../bauteil.model';
import { BauteilService } from '../service/bauteil.service';
import { BauteilDeleteDialogComponent } from '../delete/bauteil-delete-dialog.component';

@Component({
  selector: 'jhi-bauteil',
  templateUrl: './bauteil.component.html',
})
export class BauteilComponent implements OnInit {
  bauteils?: IBauteil[];
  isLoading = false;

  constructor(protected bauteilService: BauteilService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.bauteilService.query().subscribe(
      (res: HttpResponse<IBauteil[]>) => {
        this.isLoading = false;
        this.bauteils = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IBauteil): number {
    return item.id!;
  }

  delete(bauteil: IBauteil): void {
    const modalRef = this.modalService.open(BauteilDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.bauteil = bauteil;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}

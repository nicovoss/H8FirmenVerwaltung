import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IRohstoff } from '../rohstoff.model';
import { RohstoffService } from '../service/rohstoff.service';
import { RohstoffDeleteDialogComponent } from '../delete/rohstoff-delete-dialog.component';

@Component({
  selector: 'jhi-rohstoff',
  templateUrl: './rohstoff.component.html',
})
export class RohstoffComponent implements OnInit {
  rohstoffs?: IRohstoff[];
  isLoading = false;

  constructor(protected rohstoffService: RohstoffService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.rohstoffService.query().subscribe(
      (res: HttpResponse<IRohstoff[]>) => {
        this.isLoading = false;
        this.rohstoffs = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IRohstoff): number {
    return item.id!;
  }

  delete(rohstoff: IRohstoff): void {
    const modalRef = this.modalService.open(RohstoffDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.rohstoff = rohstoff;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IPatner } from '../patner.model';
import { PatnerService } from '../service/patner.service';
import { PatnerDeleteDialogComponent } from '../delete/patner-delete-dialog.component';

@Component({
  selector: 'jhi-patner',
  templateUrl: './patner.component.html',
})
export class PatnerComponent implements OnInit {
  patners?: IPatner[];
  isLoading = false;

  constructor(protected patnerService: PatnerService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.patnerService.query().subscribe(
      (res: HttpResponse<IPatner[]>) => {
        this.isLoading = false;
        this.patners = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IPatner): number {
    return item.id!;
  }

  delete(patner: IPatner): void {
    const modalRef = this.modalService.open(PatnerDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.patner = patner;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IOrganistation } from '../organistation.model';
import { OrganistationService } from '../service/organistation.service';
import { OrganistationDeleteDialogComponent } from '../delete/organistation-delete-dialog.component';

@Component({
  selector: 'jhi-organistation',
  templateUrl: './organistation.component.html',
})
export class OrganistationComponent implements OnInit {
  organistations?: IOrganistation[];
  isLoading = false;

  constructor(protected organistationService: OrganistationService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.organistationService.query().subscribe(
      (res: HttpResponse<IOrganistation[]>) => {
        this.isLoading = false;
        this.organistations = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IOrganistation): number {
    return item.id!;
  }

  delete(organistation: IOrganistation): void {
    const modalRef = this.modalService.open(OrganistationDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.organistation = organistation;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}

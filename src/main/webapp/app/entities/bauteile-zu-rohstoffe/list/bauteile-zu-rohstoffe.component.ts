import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IBauteileZuRohstoffe } from '../bauteile-zu-rohstoffe.model';
import { BauteileZuRohstoffeService } from '../service/bauteile-zu-rohstoffe.service';
import { BauteileZuRohstoffeDeleteDialogComponent } from '../delete/bauteile-zu-rohstoffe-delete-dialog.component';

@Component({
  selector: 'jhi-bauteile-zu-rohstoffe',
  templateUrl: './bauteile-zu-rohstoffe.component.html',
})
export class BauteileZuRohstoffeComponent implements OnInit {
  bauteileZuRohstoffes?: IBauteileZuRohstoffe[];
  isLoading = false;

  constructor(protected bauteileZuRohstoffeService: BauteileZuRohstoffeService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.bauteileZuRohstoffeService.query().subscribe(
      (res: HttpResponse<IBauteileZuRohstoffe[]>) => {
        this.isLoading = false;
        this.bauteileZuRohstoffes = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IBauteileZuRohstoffe): number {
    return item.id!;
  }

  delete(bauteileZuRohstoffe: IBauteileZuRohstoffe): void {
    const modalRef = this.modalService.open(BauteileZuRohstoffeDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.bauteileZuRohstoffe = bauteileZuRohstoffe;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}

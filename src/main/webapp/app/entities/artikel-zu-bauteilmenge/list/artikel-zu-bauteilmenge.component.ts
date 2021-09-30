import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IArtikelZuBauteilmenge } from '../artikel-zu-bauteilmenge.model';
import { ArtikelZuBauteilmengeService } from '../service/artikel-zu-bauteilmenge.service';
import { ArtikelZuBauteilmengeDeleteDialogComponent } from '../delete/artikel-zu-bauteilmenge-delete-dialog.component';

@Component({
  selector: 'jhi-artikel-zu-bauteilmenge',
  templateUrl: './artikel-zu-bauteilmenge.component.html',
})
export class ArtikelZuBauteilmengeComponent implements OnInit {
  artikelZuBauteilmenges?: IArtikelZuBauteilmenge[];
  isLoading = false;

  constructor(protected artikelZuBauteilmengeService: ArtikelZuBauteilmengeService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.artikelZuBauteilmengeService.query().subscribe(
      (res: HttpResponse<IArtikelZuBauteilmenge[]>) => {
        this.isLoading = false;
        this.artikelZuBauteilmenges = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IArtikelZuBauteilmenge): number {
    return item.id!;
  }

  delete(artikelZuBauteilmenge: IArtikelZuBauteilmenge): void {
    const modalRef = this.modalService.open(ArtikelZuBauteilmengeDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.artikelZuBauteilmenge = artikelZuBauteilmenge;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}

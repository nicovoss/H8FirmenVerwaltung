import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IArtikel } from '../artikel.model';
import { ArtikelService } from '../service/artikel.service';
import { ArtikelDeleteDialogComponent } from '../delete/artikel-delete-dialog.component';

@Component({
  selector: 'jhi-artikel',
  templateUrl: './artikel.component.html',
})
export class ArtikelComponent implements OnInit {
  artikels?: IArtikel[];
  isLoading = false;

  constructor(protected artikelService: ArtikelService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.artikelService.query().subscribe(
      (res: HttpResponse<IArtikel[]>) => {
        this.isLoading = false;
        this.artikels = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IArtikel): number {
    return item.id!;
  }

  delete(artikel: IArtikel): void {
    const modalRef = this.modalService.open(ArtikelDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.artikel = artikel;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}

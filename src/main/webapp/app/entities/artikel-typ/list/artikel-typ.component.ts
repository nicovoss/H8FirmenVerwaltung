import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IArtikelTyp } from '../artikel-typ.model';
import { ArtikelTypService } from '../service/artikel-typ.service';
import { ArtikelTypDeleteDialogComponent } from '../delete/artikel-typ-delete-dialog.component';

@Component({
  selector: 'jhi-artikel-typ',
  templateUrl: './artikel-typ.component.html',
})
export class ArtikelTypComponent implements OnInit {
  artikelTyps?: IArtikelTyp[];
  isLoading = false;

  constructor(protected artikelTypService: ArtikelTypService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.artikelTypService.query().subscribe(
      (res: HttpResponse<IArtikelTyp[]>) => {
        this.isLoading = false;
        this.artikelTyps = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IArtikelTyp): number {
    return item.id!;
  }

  delete(artikelTyp: IArtikelTyp): void {
    const modalRef = this.modalService.open(ArtikelTypDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.artikelTyp = artikelTyp;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}

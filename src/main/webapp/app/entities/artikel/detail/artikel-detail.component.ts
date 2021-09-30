import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IArtikel } from '../artikel.model';

@Component({
  selector: 'jhi-artikel-detail',
  templateUrl: './artikel-detail.component.html',
})
export class ArtikelDetailComponent implements OnInit {
  artikel: IArtikel | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ artikel }) => {
      this.artikel = artikel;
    });
  }

  previousState(): void {
    window.history.back();
  }
}

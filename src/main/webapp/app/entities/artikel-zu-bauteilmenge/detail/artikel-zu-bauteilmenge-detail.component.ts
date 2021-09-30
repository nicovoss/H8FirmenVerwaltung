import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IArtikelZuBauteilmenge } from '../artikel-zu-bauteilmenge.model';

@Component({
  selector: 'jhi-artikel-zu-bauteilmenge-detail',
  templateUrl: './artikel-zu-bauteilmenge-detail.component.html',
})
export class ArtikelZuBauteilmengeDetailComponent implements OnInit {
  artikelZuBauteilmenge: IArtikelZuBauteilmenge | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ artikelZuBauteilmenge }) => {
      this.artikelZuBauteilmenge = artikelZuBauteilmenge;
    });
  }

  previousState(): void {
    window.history.back();
  }
}

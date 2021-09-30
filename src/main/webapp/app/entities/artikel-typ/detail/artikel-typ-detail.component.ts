import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IArtikelTyp } from '../artikel-typ.model';

@Component({
  selector: 'jhi-artikel-typ-detail',
  templateUrl: './artikel-typ-detail.component.html',
})
export class ArtikelTypDetailComponent implements OnInit {
  artikelTyp: IArtikelTyp | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ artikelTyp }) => {
      this.artikelTyp = artikelTyp;
    });
  }

  previousState(): void {
    window.history.back();
  }
}

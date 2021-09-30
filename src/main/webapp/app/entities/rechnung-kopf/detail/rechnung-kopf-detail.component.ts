import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IRechnungKopf } from '../rechnung-kopf.model';

@Component({
  selector: 'jhi-rechnung-kopf-detail',
  templateUrl: './rechnung-kopf-detail.component.html',
})
export class RechnungKopfDetailComponent implements OnInit {
  rechnungKopf: IRechnungKopf | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ rechnungKopf }) => {
      this.rechnungKopf = rechnungKopf;
    });
  }

  previousState(): void {
    window.history.back();
  }
}

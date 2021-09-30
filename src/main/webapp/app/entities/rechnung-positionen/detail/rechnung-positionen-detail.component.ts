import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IRechnungPositionen } from '../rechnung-positionen.model';

@Component({
  selector: 'jhi-rechnung-positionen-detail',
  templateUrl: './rechnung-positionen-detail.component.html',
})
export class RechnungPositionenDetailComponent implements OnInit {
  rechnungPositionen: IRechnungPositionen | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ rechnungPositionen }) => {
      this.rechnungPositionen = rechnungPositionen;
    });
  }

  previousState(): void {
    window.history.back();
  }
}

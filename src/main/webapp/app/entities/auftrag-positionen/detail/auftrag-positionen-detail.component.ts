import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IAuftragPositionen } from '../auftrag-positionen.model';

@Component({
  selector: 'jhi-auftrag-positionen-detail',
  templateUrl: './auftrag-positionen-detail.component.html',
})
export class AuftragPositionenDetailComponent implements OnInit {
  auftragPositionen: IAuftragPositionen | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ auftragPositionen }) => {
      this.auftragPositionen = auftragPositionen;
    });
  }

  previousState(): void {
    window.history.back();
  }
}

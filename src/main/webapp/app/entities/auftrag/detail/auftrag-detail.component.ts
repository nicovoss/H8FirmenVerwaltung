import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IAuftrag } from '../auftrag.model';

@Component({
  selector: 'jhi-auftrag-detail',
  templateUrl: './auftrag-detail.component.html',
})
export class AuftragDetailComponent implements OnInit {
  auftrag: IAuftrag | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ auftrag }) => {
      this.auftrag = auftrag;
    });
  }

  previousState(): void {
    window.history.back();
  }
}

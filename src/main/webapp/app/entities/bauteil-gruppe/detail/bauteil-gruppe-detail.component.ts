import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IBauteilGruppe } from '../bauteil-gruppe.model';

@Component({
  selector: 'jhi-bauteil-gruppe-detail',
  templateUrl: './bauteil-gruppe-detail.component.html',
})
export class BauteilGruppeDetailComponent implements OnInit {
  bauteilGruppe: IBauteilGruppe | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ bauteilGruppe }) => {
      this.bauteilGruppe = bauteilGruppe;
    });
  }

  previousState(): void {
    window.history.back();
  }
}

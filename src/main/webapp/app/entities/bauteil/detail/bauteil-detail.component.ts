import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IBauteil } from '../bauteil.model';

@Component({
  selector: 'jhi-bauteil-detail',
  templateUrl: './bauteil-detail.component.html',
})
export class BauteilDetailComponent implements OnInit {
  bauteil: IBauteil | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ bauteil }) => {
      this.bauteil = bauteil;
    });
  }

  previousState(): void {
    window.history.back();
  }
}

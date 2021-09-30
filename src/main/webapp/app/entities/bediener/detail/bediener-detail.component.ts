import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IBediener } from '../bediener.model';

@Component({
  selector: 'jhi-bediener-detail',
  templateUrl: './bediener-detail.component.html',
})
export class BedienerDetailComponent implements OnInit {
  bediener: IBediener | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ bediener }) => {
      this.bediener = bediener;
    });
  }

  previousState(): void {
    window.history.back();
  }
}

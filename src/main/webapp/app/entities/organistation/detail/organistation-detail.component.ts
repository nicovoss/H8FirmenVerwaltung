import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IOrganistation } from '../organistation.model';

@Component({
  selector: 'jhi-organistation-detail',
  templateUrl: './organistation-detail.component.html',
})
export class OrganistationDetailComponent implements OnInit {
  organistation: IOrganistation | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ organistation }) => {
      this.organistation = organistation;
    });
  }

  previousState(): void {
    window.history.back();
  }
}

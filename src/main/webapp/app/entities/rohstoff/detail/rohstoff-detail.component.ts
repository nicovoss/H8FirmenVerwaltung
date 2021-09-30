import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IRohstoff } from '../rohstoff.model';

@Component({
  selector: 'jhi-rohstoff-detail',
  templateUrl: './rohstoff-detail.component.html',
})
export class RohstoffDetailComponent implements OnInit {
  rohstoff: IRohstoff | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ rohstoff }) => {
      this.rohstoff = rohstoff;
    });
  }

  previousState(): void {
    window.history.back();
  }
}

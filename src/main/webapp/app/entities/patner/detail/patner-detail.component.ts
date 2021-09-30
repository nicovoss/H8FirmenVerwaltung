import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IPatner } from '../patner.model';

@Component({
  selector: 'jhi-patner-detail',
  templateUrl: './patner-detail.component.html',
})
export class PatnerDetailComponent implements OnInit {
  patner: IPatner | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ patner }) => {
      this.patner = patner;
    });
  }

  previousState(): void {
    window.history.back();
  }
}

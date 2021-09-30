import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IBauteileZuRohstoffe } from '../bauteile-zu-rohstoffe.model';

@Component({
  selector: 'jhi-bauteile-zu-rohstoffe-detail',
  templateUrl: './bauteile-zu-rohstoffe-detail.component.html',
})
export class BauteileZuRohstoffeDetailComponent implements OnInit {
  bauteileZuRohstoffe: IBauteileZuRohstoffe | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ bauteileZuRohstoffe }) => {
      this.bauteileZuRohstoffe = bauteileZuRohstoffe;
    });
  }

  previousState(): void {
    window.history.back();
  }
}

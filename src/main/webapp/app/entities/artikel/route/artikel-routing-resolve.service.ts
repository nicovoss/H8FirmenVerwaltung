import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IArtikel, Artikel } from '../artikel.model';
import { ArtikelService } from '../service/artikel.service';

@Injectable({ providedIn: 'root' })
export class ArtikelRoutingResolveService implements Resolve<IArtikel> {
  constructor(protected service: ArtikelService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IArtikel> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((artikel: HttpResponse<Artikel>) => {
          if (artikel.body) {
            return of(artikel.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Artikel());
  }
}

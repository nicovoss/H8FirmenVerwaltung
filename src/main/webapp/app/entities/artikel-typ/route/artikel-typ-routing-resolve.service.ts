import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IArtikelTyp, ArtikelTyp } from '../artikel-typ.model';
import { ArtikelTypService } from '../service/artikel-typ.service';

@Injectable({ providedIn: 'root' })
export class ArtikelTypRoutingResolveService implements Resolve<IArtikelTyp> {
  constructor(protected service: ArtikelTypService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IArtikelTyp> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((artikelTyp: HttpResponse<ArtikelTyp>) => {
          if (artikelTyp.body) {
            return of(artikelTyp.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new ArtikelTyp());
  }
}

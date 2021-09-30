import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IArtikelZuBauteilmenge, ArtikelZuBauteilmenge } from '../artikel-zu-bauteilmenge.model';
import { ArtikelZuBauteilmengeService } from '../service/artikel-zu-bauteilmenge.service';

@Injectable({ providedIn: 'root' })
export class ArtikelZuBauteilmengeRoutingResolveService implements Resolve<IArtikelZuBauteilmenge> {
  constructor(protected service: ArtikelZuBauteilmengeService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IArtikelZuBauteilmenge> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((artikelZuBauteilmenge: HttpResponse<ArtikelZuBauteilmenge>) => {
          if (artikelZuBauteilmenge.body) {
            return of(artikelZuBauteilmenge.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new ArtikelZuBauteilmenge());
  }
}

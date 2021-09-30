import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IRechnungPositionen, RechnungPositionen } from '../rechnung-positionen.model';
import { RechnungPositionenService } from '../service/rechnung-positionen.service';

@Injectable({ providedIn: 'root' })
export class RechnungPositionenRoutingResolveService implements Resolve<IRechnungPositionen> {
  constructor(protected service: RechnungPositionenService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IRechnungPositionen> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((rechnungPositionen: HttpResponse<RechnungPositionen>) => {
          if (rechnungPositionen.body) {
            return of(rechnungPositionen.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new RechnungPositionen());
  }
}

import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IRechnungKopf, RechnungKopf } from '../rechnung-kopf.model';
import { RechnungKopfService } from '../service/rechnung-kopf.service';

@Injectable({ providedIn: 'root' })
export class RechnungKopfRoutingResolveService implements Resolve<IRechnungKopf> {
  constructor(protected service: RechnungKopfService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IRechnungKopf> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((rechnungKopf: HttpResponse<RechnungKopf>) => {
          if (rechnungKopf.body) {
            return of(rechnungKopf.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new RechnungKopf());
  }
}

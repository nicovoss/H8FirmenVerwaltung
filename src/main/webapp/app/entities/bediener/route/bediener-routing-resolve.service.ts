import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IBediener, Bediener } from '../bediener.model';
import { BedienerService } from '../service/bediener.service';

@Injectable({ providedIn: 'root' })
export class BedienerRoutingResolveService implements Resolve<IBediener> {
  constructor(protected service: BedienerService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IBediener> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((bediener: HttpResponse<Bediener>) => {
          if (bediener.body) {
            return of(bediener.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Bediener());
  }
}

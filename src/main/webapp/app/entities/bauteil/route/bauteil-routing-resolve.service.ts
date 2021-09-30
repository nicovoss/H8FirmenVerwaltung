import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IBauteil, Bauteil } from '../bauteil.model';
import { BauteilService } from '../service/bauteil.service';

@Injectable({ providedIn: 'root' })
export class BauteilRoutingResolveService implements Resolve<IBauteil> {
  constructor(protected service: BauteilService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IBauteil> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((bauteil: HttpResponse<Bauteil>) => {
          if (bauteil.body) {
            return of(bauteil.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Bauteil());
  }
}

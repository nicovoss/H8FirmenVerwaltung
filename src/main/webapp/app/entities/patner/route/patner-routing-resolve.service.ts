import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IPatner, Patner } from '../patner.model';
import { PatnerService } from '../service/patner.service';

@Injectable({ providedIn: 'root' })
export class PatnerRoutingResolveService implements Resolve<IPatner> {
  constructor(protected service: PatnerService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IPatner> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((patner: HttpResponse<Patner>) => {
          if (patner.body) {
            return of(patner.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Patner());
  }
}

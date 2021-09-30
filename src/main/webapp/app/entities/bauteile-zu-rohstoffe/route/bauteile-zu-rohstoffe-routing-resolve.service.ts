import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IBauteileZuRohstoffe, BauteileZuRohstoffe } from '../bauteile-zu-rohstoffe.model';
import { BauteileZuRohstoffeService } from '../service/bauteile-zu-rohstoffe.service';

@Injectable({ providedIn: 'root' })
export class BauteileZuRohstoffeRoutingResolveService implements Resolve<IBauteileZuRohstoffe> {
  constructor(protected service: BauteileZuRohstoffeService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IBauteileZuRohstoffe> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((bauteileZuRohstoffe: HttpResponse<BauteileZuRohstoffe>) => {
          if (bauteileZuRohstoffe.body) {
            return of(bauteileZuRohstoffe.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new BauteileZuRohstoffe());
  }
}

import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IRohstoff, Rohstoff } from '../rohstoff.model';
import { RohstoffService } from '../service/rohstoff.service';

@Injectable({ providedIn: 'root' })
export class RohstoffRoutingResolveService implements Resolve<IRohstoff> {
  constructor(protected service: RohstoffService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IRohstoff> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((rohstoff: HttpResponse<Rohstoff>) => {
          if (rohstoff.body) {
            return of(rohstoff.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Rohstoff());
  }
}

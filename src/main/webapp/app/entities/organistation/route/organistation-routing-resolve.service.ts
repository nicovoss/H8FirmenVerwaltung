import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IOrganistation, Organistation } from '../organistation.model';
import { OrganistationService } from '../service/organistation.service';

@Injectable({ providedIn: 'root' })
export class OrganistationRoutingResolveService implements Resolve<IOrganistation> {
  constructor(protected service: OrganistationService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IOrganistation> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((organistation: HttpResponse<Organistation>) => {
          if (organistation.body) {
            return of(organistation.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Organistation());
  }
}

import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IBauteilGruppe, BauteilGruppe } from '../bauteil-gruppe.model';
import { BauteilGruppeService } from '../service/bauteil-gruppe.service';

@Injectable({ providedIn: 'root' })
export class BauteilGruppeRoutingResolveService implements Resolve<IBauteilGruppe> {
  constructor(protected service: BauteilGruppeService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IBauteilGruppe> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((bauteilGruppe: HttpResponse<BauteilGruppe>) => {
          if (bauteilGruppe.body) {
            return of(bauteilGruppe.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new BauteilGruppe());
  }
}

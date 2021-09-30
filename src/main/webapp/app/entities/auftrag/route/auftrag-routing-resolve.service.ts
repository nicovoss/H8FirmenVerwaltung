import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IAuftrag, Auftrag } from '../auftrag.model';
import { AuftragService } from '../service/auftrag.service';

@Injectable({ providedIn: 'root' })
export class AuftragRoutingResolveService implements Resolve<IAuftrag> {
  constructor(protected service: AuftragService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IAuftrag> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((auftrag: HttpResponse<Auftrag>) => {
          if (auftrag.body) {
            return of(auftrag.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Auftrag());
  }
}

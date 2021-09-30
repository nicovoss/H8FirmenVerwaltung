import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IAuftragPositionen, AuftragPositionen } from '../auftrag-positionen.model';
import { AuftragPositionenService } from '../service/auftrag-positionen.service';

@Injectable({ providedIn: 'root' })
export class AuftragPositionenRoutingResolveService implements Resolve<IAuftragPositionen> {
  constructor(protected service: AuftragPositionenService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IAuftragPositionen> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((auftragPositionen: HttpResponse<AuftragPositionen>) => {
          if (auftragPositionen.body) {
            return of(auftragPositionen.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new AuftragPositionen());
  }
}

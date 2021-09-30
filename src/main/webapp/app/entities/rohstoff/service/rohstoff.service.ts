import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IRohstoff, getRohstoffIdentifier } from '../rohstoff.model';

export type EntityResponseType = HttpResponse<IRohstoff>;
export type EntityArrayResponseType = HttpResponse<IRohstoff[]>;

@Injectable({ providedIn: 'root' })
export class RohstoffService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/rohstoffs');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(rohstoff: IRohstoff): Observable<EntityResponseType> {
    return this.http.post<IRohstoff>(this.resourceUrl, rohstoff, { observe: 'response' });
  }

  update(rohstoff: IRohstoff): Observable<EntityResponseType> {
    return this.http.put<IRohstoff>(`${this.resourceUrl}/${getRohstoffIdentifier(rohstoff) as number}`, rohstoff, { observe: 'response' });
  }

  partialUpdate(rohstoff: IRohstoff): Observable<EntityResponseType> {
    return this.http.patch<IRohstoff>(`${this.resourceUrl}/${getRohstoffIdentifier(rohstoff) as number}`, rohstoff, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IRohstoff>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IRohstoff[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addRohstoffToCollectionIfMissing(rohstoffCollection: IRohstoff[], ...rohstoffsToCheck: (IRohstoff | null | undefined)[]): IRohstoff[] {
    const rohstoffs: IRohstoff[] = rohstoffsToCheck.filter(isPresent);
    if (rohstoffs.length > 0) {
      const rohstoffCollectionIdentifiers = rohstoffCollection.map(rohstoffItem => getRohstoffIdentifier(rohstoffItem)!);
      const rohstoffsToAdd = rohstoffs.filter(rohstoffItem => {
        const rohstoffIdentifier = getRohstoffIdentifier(rohstoffItem);
        if (rohstoffIdentifier == null || rohstoffCollectionIdentifiers.includes(rohstoffIdentifier)) {
          return false;
        }
        rohstoffCollectionIdentifiers.push(rohstoffIdentifier);
        return true;
      });
      return [...rohstoffsToAdd, ...rohstoffCollection];
    }
    return rohstoffCollection;
  }
}

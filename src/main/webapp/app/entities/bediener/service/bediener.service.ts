import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IBediener, getBedienerIdentifier } from '../bediener.model';

export type EntityResponseType = HttpResponse<IBediener>;
export type EntityArrayResponseType = HttpResponse<IBediener[]>;

@Injectable({ providedIn: 'root' })
export class BedienerService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/bedieners');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(bediener: IBediener): Observable<EntityResponseType> {
    return this.http.post<IBediener>(this.resourceUrl, bediener, { observe: 'response' });
  }

  update(bediener: IBediener): Observable<EntityResponseType> {
    return this.http.put<IBediener>(`${this.resourceUrl}/${getBedienerIdentifier(bediener) as number}`, bediener, { observe: 'response' });
  }

  partialUpdate(bediener: IBediener): Observable<EntityResponseType> {
    return this.http.patch<IBediener>(`${this.resourceUrl}/${getBedienerIdentifier(bediener) as number}`, bediener, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IBediener>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IBediener[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addBedienerToCollectionIfMissing(bedienerCollection: IBediener[], ...bedienersToCheck: (IBediener | null | undefined)[]): IBediener[] {
    const bedieners: IBediener[] = bedienersToCheck.filter(isPresent);
    if (bedieners.length > 0) {
      const bedienerCollectionIdentifiers = bedienerCollection.map(bedienerItem => getBedienerIdentifier(bedienerItem)!);
      const bedienersToAdd = bedieners.filter(bedienerItem => {
        const bedienerIdentifier = getBedienerIdentifier(bedienerItem);
        if (bedienerIdentifier == null || bedienerCollectionIdentifiers.includes(bedienerIdentifier)) {
          return false;
        }
        bedienerCollectionIdentifiers.push(bedienerIdentifier);
        return true;
      });
      return [...bedienersToAdd, ...bedienerCollection];
    }
    return bedienerCollection;
  }
}

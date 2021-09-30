import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IBauteil, getBauteilIdentifier } from '../bauteil.model';

export type EntityResponseType = HttpResponse<IBauteil>;
export type EntityArrayResponseType = HttpResponse<IBauteil[]>;

@Injectable({ providedIn: 'root' })
export class BauteilService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/bauteils');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(bauteil: IBauteil): Observable<EntityResponseType> {
    return this.http.post<IBauteil>(this.resourceUrl, bauteil, { observe: 'response' });
  }

  update(bauteil: IBauteil): Observable<EntityResponseType> {
    return this.http.put<IBauteil>(`${this.resourceUrl}/${getBauteilIdentifier(bauteil) as number}`, bauteil, { observe: 'response' });
  }

  partialUpdate(bauteil: IBauteil): Observable<EntityResponseType> {
    return this.http.patch<IBauteil>(`${this.resourceUrl}/${getBauteilIdentifier(bauteil) as number}`, bauteil, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IBauteil>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IBauteil[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addBauteilToCollectionIfMissing(bauteilCollection: IBauteil[], ...bauteilsToCheck: (IBauteil | null | undefined)[]): IBauteil[] {
    const bauteils: IBauteil[] = bauteilsToCheck.filter(isPresent);
    if (bauteils.length > 0) {
      const bauteilCollectionIdentifiers = bauteilCollection.map(bauteilItem => getBauteilIdentifier(bauteilItem)!);
      const bauteilsToAdd = bauteils.filter(bauteilItem => {
        const bauteilIdentifier = getBauteilIdentifier(bauteilItem);
        if (bauteilIdentifier == null || bauteilCollectionIdentifiers.includes(bauteilIdentifier)) {
          return false;
        }
        bauteilCollectionIdentifiers.push(bauteilIdentifier);
        return true;
      });
      return [...bauteilsToAdd, ...bauteilCollection];
    }
    return bauteilCollection;
  }
}

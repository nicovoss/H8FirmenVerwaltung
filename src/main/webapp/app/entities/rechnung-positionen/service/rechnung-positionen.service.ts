import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IRechnungPositionen, getRechnungPositionenIdentifier } from '../rechnung-positionen.model';

export type EntityResponseType = HttpResponse<IRechnungPositionen>;
export type EntityArrayResponseType = HttpResponse<IRechnungPositionen[]>;

@Injectable({ providedIn: 'root' })
export class RechnungPositionenService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/rechnung-positionens');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(rechnungPositionen: IRechnungPositionen): Observable<EntityResponseType> {
    return this.http.post<IRechnungPositionen>(this.resourceUrl, rechnungPositionen, { observe: 'response' });
  }

  update(rechnungPositionen: IRechnungPositionen): Observable<EntityResponseType> {
    return this.http.put<IRechnungPositionen>(
      `${this.resourceUrl}/${getRechnungPositionenIdentifier(rechnungPositionen) as number}`,
      rechnungPositionen,
      { observe: 'response' }
    );
  }

  partialUpdate(rechnungPositionen: IRechnungPositionen): Observable<EntityResponseType> {
    return this.http.patch<IRechnungPositionen>(
      `${this.resourceUrl}/${getRechnungPositionenIdentifier(rechnungPositionen) as number}`,
      rechnungPositionen,
      { observe: 'response' }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IRechnungPositionen>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IRechnungPositionen[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addRechnungPositionenToCollectionIfMissing(
    rechnungPositionenCollection: IRechnungPositionen[],
    ...rechnungPositionensToCheck: (IRechnungPositionen | null | undefined)[]
  ): IRechnungPositionen[] {
    const rechnungPositionens: IRechnungPositionen[] = rechnungPositionensToCheck.filter(isPresent);
    if (rechnungPositionens.length > 0) {
      const rechnungPositionenCollectionIdentifiers = rechnungPositionenCollection.map(
        rechnungPositionenItem => getRechnungPositionenIdentifier(rechnungPositionenItem)!
      );
      const rechnungPositionensToAdd = rechnungPositionens.filter(rechnungPositionenItem => {
        const rechnungPositionenIdentifier = getRechnungPositionenIdentifier(rechnungPositionenItem);
        if (rechnungPositionenIdentifier == null || rechnungPositionenCollectionIdentifiers.includes(rechnungPositionenIdentifier)) {
          return false;
        }
        rechnungPositionenCollectionIdentifiers.push(rechnungPositionenIdentifier);
        return true;
      });
      return [...rechnungPositionensToAdd, ...rechnungPositionenCollection];
    }
    return rechnungPositionenCollection;
  }
}

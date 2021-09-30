import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IRechnungKopf, getRechnungKopfIdentifier } from '../rechnung-kopf.model';

export type EntityResponseType = HttpResponse<IRechnungKopf>;
export type EntityArrayResponseType = HttpResponse<IRechnungKopf[]>;

@Injectable({ providedIn: 'root' })
export class RechnungKopfService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/rechnung-kopfs');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(rechnungKopf: IRechnungKopf): Observable<EntityResponseType> {
    return this.http.post<IRechnungKopf>(this.resourceUrl, rechnungKopf, { observe: 'response' });
  }

  update(rechnungKopf: IRechnungKopf): Observable<EntityResponseType> {
    return this.http.put<IRechnungKopf>(`${this.resourceUrl}/${getRechnungKopfIdentifier(rechnungKopf) as number}`, rechnungKopf, {
      observe: 'response',
    });
  }

  partialUpdate(rechnungKopf: IRechnungKopf): Observable<EntityResponseType> {
    return this.http.patch<IRechnungKopf>(`${this.resourceUrl}/${getRechnungKopfIdentifier(rechnungKopf) as number}`, rechnungKopf, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IRechnungKopf>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IRechnungKopf[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addRechnungKopfToCollectionIfMissing(
    rechnungKopfCollection: IRechnungKopf[],
    ...rechnungKopfsToCheck: (IRechnungKopf | null | undefined)[]
  ): IRechnungKopf[] {
    const rechnungKopfs: IRechnungKopf[] = rechnungKopfsToCheck.filter(isPresent);
    if (rechnungKopfs.length > 0) {
      const rechnungKopfCollectionIdentifiers = rechnungKopfCollection.map(
        rechnungKopfItem => getRechnungKopfIdentifier(rechnungKopfItem)!
      );
      const rechnungKopfsToAdd = rechnungKopfs.filter(rechnungKopfItem => {
        const rechnungKopfIdentifier = getRechnungKopfIdentifier(rechnungKopfItem);
        if (rechnungKopfIdentifier == null || rechnungKopfCollectionIdentifiers.includes(rechnungKopfIdentifier)) {
          return false;
        }
        rechnungKopfCollectionIdentifiers.push(rechnungKopfIdentifier);
        return true;
      });
      return [...rechnungKopfsToAdd, ...rechnungKopfCollection];
    }
    return rechnungKopfCollection;
  }
}

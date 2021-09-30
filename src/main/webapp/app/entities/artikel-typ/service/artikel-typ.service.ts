import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IArtikelTyp, getArtikelTypIdentifier } from '../artikel-typ.model';

export type EntityResponseType = HttpResponse<IArtikelTyp>;
export type EntityArrayResponseType = HttpResponse<IArtikelTyp[]>;

@Injectable({ providedIn: 'root' })
export class ArtikelTypService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/artikel-typs');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(artikelTyp: IArtikelTyp): Observable<EntityResponseType> {
    return this.http.post<IArtikelTyp>(this.resourceUrl, artikelTyp, { observe: 'response' });
  }

  update(artikelTyp: IArtikelTyp): Observable<EntityResponseType> {
    return this.http.put<IArtikelTyp>(`${this.resourceUrl}/${getArtikelTypIdentifier(artikelTyp) as number}`, artikelTyp, {
      observe: 'response',
    });
  }

  partialUpdate(artikelTyp: IArtikelTyp): Observable<EntityResponseType> {
    return this.http.patch<IArtikelTyp>(`${this.resourceUrl}/${getArtikelTypIdentifier(artikelTyp) as number}`, artikelTyp, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IArtikelTyp>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IArtikelTyp[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addArtikelTypToCollectionIfMissing(
    artikelTypCollection: IArtikelTyp[],
    ...artikelTypsToCheck: (IArtikelTyp | null | undefined)[]
  ): IArtikelTyp[] {
    const artikelTyps: IArtikelTyp[] = artikelTypsToCheck.filter(isPresent);
    if (artikelTyps.length > 0) {
      const artikelTypCollectionIdentifiers = artikelTypCollection.map(artikelTypItem => getArtikelTypIdentifier(artikelTypItem)!);
      const artikelTypsToAdd = artikelTyps.filter(artikelTypItem => {
        const artikelTypIdentifier = getArtikelTypIdentifier(artikelTypItem);
        if (artikelTypIdentifier == null || artikelTypCollectionIdentifiers.includes(artikelTypIdentifier)) {
          return false;
        }
        artikelTypCollectionIdentifiers.push(artikelTypIdentifier);
        return true;
      });
      return [...artikelTypsToAdd, ...artikelTypCollection];
    }
    return artikelTypCollection;
  }
}

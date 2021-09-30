import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IArtikelZuBauteilmenge, getArtikelZuBauteilmengeIdentifier } from '../artikel-zu-bauteilmenge.model';

export type EntityResponseType = HttpResponse<IArtikelZuBauteilmenge>;
export type EntityArrayResponseType = HttpResponse<IArtikelZuBauteilmenge[]>;

@Injectable({ providedIn: 'root' })
export class ArtikelZuBauteilmengeService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/artikel-zu-bauteilmenges');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(artikelZuBauteilmenge: IArtikelZuBauteilmenge): Observable<EntityResponseType> {
    return this.http.post<IArtikelZuBauteilmenge>(this.resourceUrl, artikelZuBauteilmenge, { observe: 'response' });
  }

  update(artikelZuBauteilmenge: IArtikelZuBauteilmenge): Observable<EntityResponseType> {
    return this.http.put<IArtikelZuBauteilmenge>(
      `${this.resourceUrl}/${getArtikelZuBauteilmengeIdentifier(artikelZuBauteilmenge) as number}`,
      artikelZuBauteilmenge,
      { observe: 'response' }
    );
  }

  partialUpdate(artikelZuBauteilmenge: IArtikelZuBauteilmenge): Observable<EntityResponseType> {
    return this.http.patch<IArtikelZuBauteilmenge>(
      `${this.resourceUrl}/${getArtikelZuBauteilmengeIdentifier(artikelZuBauteilmenge) as number}`,
      artikelZuBauteilmenge,
      { observe: 'response' }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IArtikelZuBauteilmenge>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IArtikelZuBauteilmenge[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addArtikelZuBauteilmengeToCollectionIfMissing(
    artikelZuBauteilmengeCollection: IArtikelZuBauteilmenge[],
    ...artikelZuBauteilmengesToCheck: (IArtikelZuBauteilmenge | null | undefined)[]
  ): IArtikelZuBauteilmenge[] {
    const artikelZuBauteilmenges: IArtikelZuBauteilmenge[] = artikelZuBauteilmengesToCheck.filter(isPresent);
    if (artikelZuBauteilmenges.length > 0) {
      const artikelZuBauteilmengeCollectionIdentifiers = artikelZuBauteilmengeCollection.map(
        artikelZuBauteilmengeItem => getArtikelZuBauteilmengeIdentifier(artikelZuBauteilmengeItem)!
      );
      const artikelZuBauteilmengesToAdd = artikelZuBauteilmenges.filter(artikelZuBauteilmengeItem => {
        const artikelZuBauteilmengeIdentifier = getArtikelZuBauteilmengeIdentifier(artikelZuBauteilmengeItem);
        if (
          artikelZuBauteilmengeIdentifier == null ||
          artikelZuBauteilmengeCollectionIdentifiers.includes(artikelZuBauteilmengeIdentifier)
        ) {
          return false;
        }
        artikelZuBauteilmengeCollectionIdentifiers.push(artikelZuBauteilmengeIdentifier);
        return true;
      });
      return [...artikelZuBauteilmengesToAdd, ...artikelZuBauteilmengeCollection];
    }
    return artikelZuBauteilmengeCollection;
  }
}

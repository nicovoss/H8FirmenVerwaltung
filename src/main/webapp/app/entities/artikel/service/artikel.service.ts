import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IArtikel, getArtikelIdentifier } from '../artikel.model';

export type EntityResponseType = HttpResponse<IArtikel>;
export type EntityArrayResponseType = HttpResponse<IArtikel[]>;

@Injectable({ providedIn: 'root' })
export class ArtikelService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/artikels');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(artikel: IArtikel): Observable<EntityResponseType> {
    return this.http.post<IArtikel>(this.resourceUrl, artikel, { observe: 'response' });
  }

  update(artikel: IArtikel): Observable<EntityResponseType> {
    return this.http.put<IArtikel>(`${this.resourceUrl}/${getArtikelIdentifier(artikel) as number}`, artikel, { observe: 'response' });
  }

  partialUpdate(artikel: IArtikel): Observable<EntityResponseType> {
    return this.http.patch<IArtikel>(`${this.resourceUrl}/${getArtikelIdentifier(artikel) as number}`, artikel, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IArtikel>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IArtikel[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addArtikelToCollectionIfMissing(artikelCollection: IArtikel[], ...artikelsToCheck: (IArtikel | null | undefined)[]): IArtikel[] {
    const artikels: IArtikel[] = artikelsToCheck.filter(isPresent);
    if (artikels.length > 0) {
      const artikelCollectionIdentifiers = artikelCollection.map(artikelItem => getArtikelIdentifier(artikelItem)!);
      const artikelsToAdd = artikels.filter(artikelItem => {
        const artikelIdentifier = getArtikelIdentifier(artikelItem);
        if (artikelIdentifier == null || artikelCollectionIdentifiers.includes(artikelIdentifier)) {
          return false;
        }
        artikelCollectionIdentifiers.push(artikelIdentifier);
        return true;
      });
      return [...artikelsToAdd, ...artikelCollection];
    }
    return artikelCollection;
  }
}

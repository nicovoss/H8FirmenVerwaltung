import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IBauteilGruppe, getBauteilGruppeIdentifier } from '../bauteil-gruppe.model';

export type EntityResponseType = HttpResponse<IBauteilGruppe>;
export type EntityArrayResponseType = HttpResponse<IBauteilGruppe[]>;

@Injectable({ providedIn: 'root' })
export class BauteilGruppeService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/bauteil-gruppes');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(bauteilGruppe: IBauteilGruppe): Observable<EntityResponseType> {
    return this.http.post<IBauteilGruppe>(this.resourceUrl, bauteilGruppe, { observe: 'response' });
  }

  update(bauteilGruppe: IBauteilGruppe): Observable<EntityResponseType> {
    return this.http.put<IBauteilGruppe>(`${this.resourceUrl}/${getBauteilGruppeIdentifier(bauteilGruppe) as number}`, bauteilGruppe, {
      observe: 'response',
    });
  }

  partialUpdate(bauteilGruppe: IBauteilGruppe): Observable<EntityResponseType> {
    return this.http.patch<IBauteilGruppe>(`${this.resourceUrl}/${getBauteilGruppeIdentifier(bauteilGruppe) as number}`, bauteilGruppe, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IBauteilGruppe>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IBauteilGruppe[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addBauteilGruppeToCollectionIfMissing(
    bauteilGruppeCollection: IBauteilGruppe[],
    ...bauteilGruppesToCheck: (IBauteilGruppe | null | undefined)[]
  ): IBauteilGruppe[] {
    const bauteilGruppes: IBauteilGruppe[] = bauteilGruppesToCheck.filter(isPresent);
    if (bauteilGruppes.length > 0) {
      const bauteilGruppeCollectionIdentifiers = bauteilGruppeCollection.map(
        bauteilGruppeItem => getBauteilGruppeIdentifier(bauteilGruppeItem)!
      );
      const bauteilGruppesToAdd = bauteilGruppes.filter(bauteilGruppeItem => {
        const bauteilGruppeIdentifier = getBauteilGruppeIdentifier(bauteilGruppeItem);
        if (bauteilGruppeIdentifier == null || bauteilGruppeCollectionIdentifiers.includes(bauteilGruppeIdentifier)) {
          return false;
        }
        bauteilGruppeCollectionIdentifiers.push(bauteilGruppeIdentifier);
        return true;
      });
      return [...bauteilGruppesToAdd, ...bauteilGruppeCollection];
    }
    return bauteilGruppeCollection;
  }
}

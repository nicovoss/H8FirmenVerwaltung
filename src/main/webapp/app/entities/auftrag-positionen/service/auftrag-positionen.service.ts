import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAuftragPositionen, getAuftragPositionenIdentifier } from '../auftrag-positionen.model';

export type EntityResponseType = HttpResponse<IAuftragPositionen>;
export type EntityArrayResponseType = HttpResponse<IAuftragPositionen[]>;

@Injectable({ providedIn: 'root' })
export class AuftragPositionenService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/auftrag-positionens');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(auftragPositionen: IAuftragPositionen): Observable<EntityResponseType> {
    return this.http.post<IAuftragPositionen>(this.resourceUrl, auftragPositionen, { observe: 'response' });
  }

  update(auftragPositionen: IAuftragPositionen): Observable<EntityResponseType> {
    return this.http.put<IAuftragPositionen>(
      `${this.resourceUrl}/${getAuftragPositionenIdentifier(auftragPositionen) as number}`,
      auftragPositionen,
      { observe: 'response' }
    );
  }

  partialUpdate(auftragPositionen: IAuftragPositionen): Observable<EntityResponseType> {
    return this.http.patch<IAuftragPositionen>(
      `${this.resourceUrl}/${getAuftragPositionenIdentifier(auftragPositionen) as number}`,
      auftragPositionen,
      { observe: 'response' }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IAuftragPositionen>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IAuftragPositionen[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addAuftragPositionenToCollectionIfMissing(
    auftragPositionenCollection: IAuftragPositionen[],
    ...auftragPositionensToCheck: (IAuftragPositionen | null | undefined)[]
  ): IAuftragPositionen[] {
    const auftragPositionens: IAuftragPositionen[] = auftragPositionensToCheck.filter(isPresent);
    if (auftragPositionens.length > 0) {
      const auftragPositionenCollectionIdentifiers = auftragPositionenCollection.map(
        auftragPositionenItem => getAuftragPositionenIdentifier(auftragPositionenItem)!
      );
      const auftragPositionensToAdd = auftragPositionens.filter(auftragPositionenItem => {
        const auftragPositionenIdentifier = getAuftragPositionenIdentifier(auftragPositionenItem);
        if (auftragPositionenIdentifier == null || auftragPositionenCollectionIdentifiers.includes(auftragPositionenIdentifier)) {
          return false;
        }
        auftragPositionenCollectionIdentifiers.push(auftragPositionenIdentifier);
        return true;
      });
      return [...auftragPositionensToAdd, ...auftragPositionenCollection];
    }
    return auftragPositionenCollection;
  }
}

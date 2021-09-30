import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IOrganistation, getOrganistationIdentifier } from '../organistation.model';

export type EntityResponseType = HttpResponse<IOrganistation>;
export type EntityArrayResponseType = HttpResponse<IOrganistation[]>;

@Injectable({ providedIn: 'root' })
export class OrganistationService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/organistations');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(organistation: IOrganistation): Observable<EntityResponseType> {
    return this.http.post<IOrganistation>(this.resourceUrl, organistation, { observe: 'response' });
  }

  update(organistation: IOrganistation): Observable<EntityResponseType> {
    return this.http.put<IOrganistation>(`${this.resourceUrl}/${getOrganistationIdentifier(organistation) as number}`, organistation, {
      observe: 'response',
    });
  }

  partialUpdate(organistation: IOrganistation): Observable<EntityResponseType> {
    return this.http.patch<IOrganistation>(`${this.resourceUrl}/${getOrganistationIdentifier(organistation) as number}`, organistation, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IOrganistation>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IOrganistation[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addOrganistationToCollectionIfMissing(
    organistationCollection: IOrganistation[],
    ...organistationsToCheck: (IOrganistation | null | undefined)[]
  ): IOrganistation[] {
    const organistations: IOrganistation[] = organistationsToCheck.filter(isPresent);
    if (organistations.length > 0) {
      const organistationCollectionIdentifiers = organistationCollection.map(
        organistationItem => getOrganistationIdentifier(organistationItem)!
      );
      const organistationsToAdd = organistations.filter(organistationItem => {
        const organistationIdentifier = getOrganistationIdentifier(organistationItem);
        if (organistationIdentifier == null || organistationCollectionIdentifiers.includes(organistationIdentifier)) {
          return false;
        }
        organistationCollectionIdentifiers.push(organistationIdentifier);
        return true;
      });
      return [...organistationsToAdd, ...organistationCollection];
    }
    return organistationCollection;
  }
}

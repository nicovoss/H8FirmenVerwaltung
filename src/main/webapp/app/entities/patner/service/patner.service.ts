import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IPatner, getPatnerIdentifier } from '../patner.model';

export type EntityResponseType = HttpResponse<IPatner>;
export type EntityArrayResponseType = HttpResponse<IPatner[]>;

@Injectable({ providedIn: 'root' })
export class PatnerService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/patners');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(patner: IPatner): Observable<EntityResponseType> {
    return this.http.post<IPatner>(this.resourceUrl, patner, { observe: 'response' });
  }

  update(patner: IPatner): Observable<EntityResponseType> {
    return this.http.put<IPatner>(`${this.resourceUrl}/${getPatnerIdentifier(patner) as number}`, patner, { observe: 'response' });
  }

  partialUpdate(patner: IPatner): Observable<EntityResponseType> {
    return this.http.patch<IPatner>(`${this.resourceUrl}/${getPatnerIdentifier(patner) as number}`, patner, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IPatner>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IPatner[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addPatnerToCollectionIfMissing(patnerCollection: IPatner[], ...patnersToCheck: (IPatner | null | undefined)[]): IPatner[] {
    const patners: IPatner[] = patnersToCheck.filter(isPresent);
    if (patners.length > 0) {
      const patnerCollectionIdentifiers = patnerCollection.map(patnerItem => getPatnerIdentifier(patnerItem)!);
      const patnersToAdd = patners.filter(patnerItem => {
        const patnerIdentifier = getPatnerIdentifier(patnerItem);
        if (patnerIdentifier == null || patnerCollectionIdentifiers.includes(patnerIdentifier)) {
          return false;
        }
        patnerCollectionIdentifiers.push(patnerIdentifier);
        return true;
      });
      return [...patnersToAdd, ...patnerCollection];
    }
    return patnerCollection;
  }
}

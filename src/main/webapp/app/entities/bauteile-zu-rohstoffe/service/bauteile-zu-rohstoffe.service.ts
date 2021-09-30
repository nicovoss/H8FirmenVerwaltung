import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IBauteileZuRohstoffe, getBauteileZuRohstoffeIdentifier } from '../bauteile-zu-rohstoffe.model';

export type EntityResponseType = HttpResponse<IBauteileZuRohstoffe>;
export type EntityArrayResponseType = HttpResponse<IBauteileZuRohstoffe[]>;

@Injectable({ providedIn: 'root' })
export class BauteileZuRohstoffeService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/bauteile-zu-rohstoffes');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(bauteileZuRohstoffe: IBauteileZuRohstoffe): Observable<EntityResponseType> {
    return this.http.post<IBauteileZuRohstoffe>(this.resourceUrl, bauteileZuRohstoffe, { observe: 'response' });
  }

  update(bauteileZuRohstoffe: IBauteileZuRohstoffe): Observable<EntityResponseType> {
    return this.http.put<IBauteileZuRohstoffe>(
      `${this.resourceUrl}/${getBauteileZuRohstoffeIdentifier(bauteileZuRohstoffe) as number}`,
      bauteileZuRohstoffe,
      { observe: 'response' }
    );
  }

  partialUpdate(bauteileZuRohstoffe: IBauteileZuRohstoffe): Observable<EntityResponseType> {
    return this.http.patch<IBauteileZuRohstoffe>(
      `${this.resourceUrl}/${getBauteileZuRohstoffeIdentifier(bauteileZuRohstoffe) as number}`,
      bauteileZuRohstoffe,
      { observe: 'response' }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IBauteileZuRohstoffe>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IBauteileZuRohstoffe[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addBauteileZuRohstoffeToCollectionIfMissing(
    bauteileZuRohstoffeCollection: IBauteileZuRohstoffe[],
    ...bauteileZuRohstoffesToCheck: (IBauteileZuRohstoffe | null | undefined)[]
  ): IBauteileZuRohstoffe[] {
    const bauteileZuRohstoffes: IBauteileZuRohstoffe[] = bauteileZuRohstoffesToCheck.filter(isPresent);
    if (bauteileZuRohstoffes.length > 0) {
      const bauteileZuRohstoffeCollectionIdentifiers = bauteileZuRohstoffeCollection.map(
        bauteileZuRohstoffeItem => getBauteileZuRohstoffeIdentifier(bauteileZuRohstoffeItem)!
      );
      const bauteileZuRohstoffesToAdd = bauteileZuRohstoffes.filter(bauteileZuRohstoffeItem => {
        const bauteileZuRohstoffeIdentifier = getBauteileZuRohstoffeIdentifier(bauteileZuRohstoffeItem);
        if (bauteileZuRohstoffeIdentifier == null || bauteileZuRohstoffeCollectionIdentifiers.includes(bauteileZuRohstoffeIdentifier)) {
          return false;
        }
        bauteileZuRohstoffeCollectionIdentifiers.push(bauteileZuRohstoffeIdentifier);
        return true;
      });
      return [...bauteileZuRohstoffesToAdd, ...bauteileZuRohstoffeCollection];
    }
    return bauteileZuRohstoffeCollection;
  }
}

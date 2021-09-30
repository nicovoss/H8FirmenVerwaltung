import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAuftrag, getAuftragIdentifier } from '../auftrag.model';

export type EntityResponseType = HttpResponse<IAuftrag>;
export type EntityArrayResponseType = HttpResponse<IAuftrag[]>;

@Injectable({ providedIn: 'root' })
export class AuftragService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/auftrags');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(auftrag: IAuftrag): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(auftrag);
    return this.http
      .post<IAuftrag>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(auftrag: IAuftrag): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(auftrag);
    return this.http
      .put<IAuftrag>(`${this.resourceUrl}/${getAuftragIdentifier(auftrag) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(auftrag: IAuftrag): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(auftrag);
    return this.http
      .patch<IAuftrag>(`${this.resourceUrl}/${getAuftragIdentifier(auftrag) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IAuftrag>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IAuftrag[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addAuftragToCollectionIfMissing(auftragCollection: IAuftrag[], ...auftragsToCheck: (IAuftrag | null | undefined)[]): IAuftrag[] {
    const auftrags: IAuftrag[] = auftragsToCheck.filter(isPresent);
    if (auftrags.length > 0) {
      const auftragCollectionIdentifiers = auftragCollection.map(auftragItem => getAuftragIdentifier(auftragItem)!);
      const auftragsToAdd = auftrags.filter(auftragItem => {
        const auftragIdentifier = getAuftragIdentifier(auftragItem);
        if (auftragIdentifier == null || auftragCollectionIdentifiers.includes(auftragIdentifier)) {
          return false;
        }
        auftragCollectionIdentifiers.push(auftragIdentifier);
        return true;
      });
      return [...auftragsToAdd, ...auftragCollection];
    }
    return auftragCollection;
  }

  protected convertDateFromClient(auftrag: IAuftrag): IAuftrag {
    return Object.assign({}, auftrag, {
      erfasstAm: auftrag.erfasstAm?.isValid() ? auftrag.erfasstAm.toJSON() : undefined,
      faelligAm: auftrag.faelligAm?.isValid() ? auftrag.faelligAm.toJSON() : undefined,
      bezahltAm: auftrag.bezahltAm?.isValid() ? auftrag.bezahltAm.toJSON() : undefined,
      abgeschlossenAm: auftrag.abgeschlossenAm?.isValid() ? auftrag.abgeschlossenAm.toJSON() : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.erfasstAm = res.body.erfasstAm ? dayjs(res.body.erfasstAm) : undefined;
      res.body.faelligAm = res.body.faelligAm ? dayjs(res.body.faelligAm) : undefined;
      res.body.bezahltAm = res.body.bezahltAm ? dayjs(res.body.bezahltAm) : undefined;
      res.body.abgeschlossenAm = res.body.abgeschlossenAm ? dayjs(res.body.abgeschlossenAm) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((auftrag: IAuftrag) => {
        auftrag.erfasstAm = auftrag.erfasstAm ? dayjs(auftrag.erfasstAm) : undefined;
        auftrag.faelligAm = auftrag.faelligAm ? dayjs(auftrag.faelligAm) : undefined;
        auftrag.bezahltAm = auftrag.bezahltAm ? dayjs(auftrag.bezahltAm) : undefined;
        auftrag.abgeschlossenAm = auftrag.abgeschlossenAm ? dayjs(auftrag.abgeschlossenAm) : undefined;
      });
    }
    return res;
  }
}

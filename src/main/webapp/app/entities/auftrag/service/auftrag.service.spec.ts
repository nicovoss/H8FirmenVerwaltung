import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IAuftrag, Auftrag } from '../auftrag.model';

import { AuftragService } from './auftrag.service';

describe('Service Tests', () => {
  describe('Auftrag Service', () => {
    let service: AuftragService;
    let httpMock: HttpTestingController;
    let elemDefault: IAuftrag;
    let expectedResult: IAuftrag | IAuftrag[] | boolean | null;
    let currentDate: dayjs.Dayjs;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(AuftragService);
      httpMock = TestBed.inject(HttpTestingController);
      currentDate = dayjs();

      elemDefault = {
        id: 0,
        erfasstAm: currentDate,
        faelligAm: currentDate,
        bezahl: false,
        bezahltAm: currentDate,
        abgeschlossenAm: currentDate,
        kommentar: 'AAAAAAA',
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign(
          {
            erfasstAm: currentDate.format(DATE_TIME_FORMAT),
            faelligAm: currentDate.format(DATE_TIME_FORMAT),
            bezahltAm: currentDate.format(DATE_TIME_FORMAT),
            abgeschlossenAm: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a Auftrag', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
            erfasstAm: currentDate.format(DATE_TIME_FORMAT),
            faelligAm: currentDate.format(DATE_TIME_FORMAT),
            bezahltAm: currentDate.format(DATE_TIME_FORMAT),
            abgeschlossenAm: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            erfasstAm: currentDate,
            faelligAm: currentDate,
            bezahltAm: currentDate,
            abgeschlossenAm: currentDate,
          },
          returnedFromService
        );

        service.create(new Auftrag()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Auftrag', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            erfasstAm: currentDate.format(DATE_TIME_FORMAT),
            faelligAm: currentDate.format(DATE_TIME_FORMAT),
            bezahl: true,
            bezahltAm: currentDate.format(DATE_TIME_FORMAT),
            abgeschlossenAm: currentDate.format(DATE_TIME_FORMAT),
            kommentar: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            erfasstAm: currentDate,
            faelligAm: currentDate,
            bezahltAm: currentDate,
            abgeschlossenAm: currentDate,
          },
          returnedFromService
        );

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Auftrag', () => {
        const patchObject = Object.assign({}, new Auftrag());

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign(
          {
            erfasstAm: currentDate,
            faelligAm: currentDate,
            bezahltAm: currentDate,
            abgeschlossenAm: currentDate,
          },
          returnedFromService
        );

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Auftrag', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            erfasstAm: currentDate.format(DATE_TIME_FORMAT),
            faelligAm: currentDate.format(DATE_TIME_FORMAT),
            bezahl: true,
            bezahltAm: currentDate.format(DATE_TIME_FORMAT),
            abgeschlossenAm: currentDate.format(DATE_TIME_FORMAT),
            kommentar: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            erfasstAm: currentDate,
            faelligAm: currentDate,
            bezahltAm: currentDate,
            abgeschlossenAm: currentDate,
          },
          returnedFromService
        );

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a Auftrag', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addAuftragToCollectionIfMissing', () => {
        it('should add a Auftrag to an empty array', () => {
          const auftrag: IAuftrag = { id: 123 };
          expectedResult = service.addAuftragToCollectionIfMissing([], auftrag);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(auftrag);
        });

        it('should not add a Auftrag to an array that contains it', () => {
          const auftrag: IAuftrag = { id: 123 };
          const auftragCollection: IAuftrag[] = [
            {
              ...auftrag,
            },
            { id: 456 },
          ];
          expectedResult = service.addAuftragToCollectionIfMissing(auftragCollection, auftrag);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Auftrag to an array that doesn't contain it", () => {
          const auftrag: IAuftrag = { id: 123 };
          const auftragCollection: IAuftrag[] = [{ id: 456 }];
          expectedResult = service.addAuftragToCollectionIfMissing(auftragCollection, auftrag);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(auftrag);
        });

        it('should add only unique Auftrag to an array', () => {
          const auftragArray: IAuftrag[] = [{ id: 123 }, { id: 456 }, { id: 84653 }];
          const auftragCollection: IAuftrag[] = [{ id: 123 }];
          expectedResult = service.addAuftragToCollectionIfMissing(auftragCollection, ...auftragArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const auftrag: IAuftrag = { id: 123 };
          const auftrag2: IAuftrag = { id: 456 };
          expectedResult = service.addAuftragToCollectionIfMissing([], auftrag, auftrag2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(auftrag);
          expect(expectedResult).toContain(auftrag2);
        });

        it('should accept null and undefined values', () => {
          const auftrag: IAuftrag = { id: 123 };
          expectedResult = service.addAuftragToCollectionIfMissing([], null, auftrag, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(auftrag);
        });

        it('should return initial array if no Auftrag is added', () => {
          const auftragCollection: IAuftrag[] = [{ id: 123 }];
          expectedResult = service.addAuftragToCollectionIfMissing(auftragCollection, undefined, null);
          expect(expectedResult).toEqual(auftragCollection);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});

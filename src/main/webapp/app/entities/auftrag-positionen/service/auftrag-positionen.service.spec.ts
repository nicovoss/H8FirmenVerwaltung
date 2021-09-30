import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IAuftragPositionen, AuftragPositionen } from '../auftrag-positionen.model';

import { AuftragPositionenService } from './auftrag-positionen.service';

describe('Service Tests', () => {
  describe('AuftragPositionen Service', () => {
    let service: AuftragPositionenService;
    let httpMock: HttpTestingController;
    let elemDefault: IAuftragPositionen;
    let expectedResult: IAuftragPositionen | IAuftragPositionen[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(AuftragPositionenService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
        menge: 0,
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign({}, elemDefault);

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a AuftragPositionen', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new AuftragPositionen()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a AuftragPositionen', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            menge: 1,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a AuftragPositionen', () => {
        const patchObject = Object.assign(
          {
            menge: 1,
          },
          new AuftragPositionen()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of AuftragPositionen', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            menge: 1,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a AuftragPositionen', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addAuftragPositionenToCollectionIfMissing', () => {
        it('should add a AuftragPositionen to an empty array', () => {
          const auftragPositionen: IAuftragPositionen = { id: 123 };
          expectedResult = service.addAuftragPositionenToCollectionIfMissing([], auftragPositionen);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(auftragPositionen);
        });

        it('should not add a AuftragPositionen to an array that contains it', () => {
          const auftragPositionen: IAuftragPositionen = { id: 123 };
          const auftragPositionenCollection: IAuftragPositionen[] = [
            {
              ...auftragPositionen,
            },
            { id: 456 },
          ];
          expectedResult = service.addAuftragPositionenToCollectionIfMissing(auftragPositionenCollection, auftragPositionen);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a AuftragPositionen to an array that doesn't contain it", () => {
          const auftragPositionen: IAuftragPositionen = { id: 123 };
          const auftragPositionenCollection: IAuftragPositionen[] = [{ id: 456 }];
          expectedResult = service.addAuftragPositionenToCollectionIfMissing(auftragPositionenCollection, auftragPositionen);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(auftragPositionen);
        });

        it('should add only unique AuftragPositionen to an array', () => {
          const auftragPositionenArray: IAuftragPositionen[] = [{ id: 123 }, { id: 456 }, { id: 79593 }];
          const auftragPositionenCollection: IAuftragPositionen[] = [{ id: 123 }];
          expectedResult = service.addAuftragPositionenToCollectionIfMissing(auftragPositionenCollection, ...auftragPositionenArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const auftragPositionen: IAuftragPositionen = { id: 123 };
          const auftragPositionen2: IAuftragPositionen = { id: 456 };
          expectedResult = service.addAuftragPositionenToCollectionIfMissing([], auftragPositionen, auftragPositionen2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(auftragPositionen);
          expect(expectedResult).toContain(auftragPositionen2);
        });

        it('should accept null and undefined values', () => {
          const auftragPositionen: IAuftragPositionen = { id: 123 };
          expectedResult = service.addAuftragPositionenToCollectionIfMissing([], null, auftragPositionen, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(auftragPositionen);
        });

        it('should return initial array if no AuftragPositionen is added', () => {
          const auftragPositionenCollection: IAuftragPositionen[] = [{ id: 123 }];
          expectedResult = service.addAuftragPositionenToCollectionIfMissing(auftragPositionenCollection, undefined, null);
          expect(expectedResult).toEqual(auftragPositionenCollection);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});

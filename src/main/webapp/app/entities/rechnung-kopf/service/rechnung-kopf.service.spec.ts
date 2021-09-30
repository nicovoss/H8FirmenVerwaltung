import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IRechnungKopf, RechnungKopf } from '../rechnung-kopf.model';

import { RechnungKopfService } from './rechnung-kopf.service';

describe('Service Tests', () => {
  describe('RechnungKopf Service', () => {
    let service: RechnungKopfService;
    let httpMock: HttpTestingController;
    let elemDefault: IRechnungKopf;
    let expectedResult: IRechnungKopf | IRechnungKopf[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(RechnungKopfService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
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

      it('should create a RechnungKopf', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new RechnungKopf()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a RechnungKopf', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a RechnungKopf', () => {
        const patchObject = Object.assign({}, new RechnungKopf());

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of RechnungKopf', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
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

      it('should delete a RechnungKopf', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addRechnungKopfToCollectionIfMissing', () => {
        it('should add a RechnungKopf to an empty array', () => {
          const rechnungKopf: IRechnungKopf = { id: 123 };
          expectedResult = service.addRechnungKopfToCollectionIfMissing([], rechnungKopf);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(rechnungKopf);
        });

        it('should not add a RechnungKopf to an array that contains it', () => {
          const rechnungKopf: IRechnungKopf = { id: 123 };
          const rechnungKopfCollection: IRechnungKopf[] = [
            {
              ...rechnungKopf,
            },
            { id: 456 },
          ];
          expectedResult = service.addRechnungKopfToCollectionIfMissing(rechnungKopfCollection, rechnungKopf);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a RechnungKopf to an array that doesn't contain it", () => {
          const rechnungKopf: IRechnungKopf = { id: 123 };
          const rechnungKopfCollection: IRechnungKopf[] = [{ id: 456 }];
          expectedResult = service.addRechnungKopfToCollectionIfMissing(rechnungKopfCollection, rechnungKopf);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(rechnungKopf);
        });

        it('should add only unique RechnungKopf to an array', () => {
          const rechnungKopfArray: IRechnungKopf[] = [{ id: 123 }, { id: 456 }, { id: 52819 }];
          const rechnungKopfCollection: IRechnungKopf[] = [{ id: 123 }];
          expectedResult = service.addRechnungKopfToCollectionIfMissing(rechnungKopfCollection, ...rechnungKopfArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const rechnungKopf: IRechnungKopf = { id: 123 };
          const rechnungKopf2: IRechnungKopf = { id: 456 };
          expectedResult = service.addRechnungKopfToCollectionIfMissing([], rechnungKopf, rechnungKopf2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(rechnungKopf);
          expect(expectedResult).toContain(rechnungKopf2);
        });

        it('should accept null and undefined values', () => {
          const rechnungKopf: IRechnungKopf = { id: 123 };
          expectedResult = service.addRechnungKopfToCollectionIfMissing([], null, rechnungKopf, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(rechnungKopf);
        });

        it('should return initial array if no RechnungKopf is added', () => {
          const rechnungKopfCollection: IRechnungKopf[] = [{ id: 123 }];
          expectedResult = service.addRechnungKopfToCollectionIfMissing(rechnungKopfCollection, undefined, null);
          expect(expectedResult).toEqual(rechnungKopfCollection);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});

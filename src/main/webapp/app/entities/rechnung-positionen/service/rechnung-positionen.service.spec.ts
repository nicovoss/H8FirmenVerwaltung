import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IRechnungPositionen, RechnungPositionen } from '../rechnung-positionen.model';

import { RechnungPositionenService } from './rechnung-positionen.service';

describe('Service Tests', () => {
  describe('RechnungPositionen Service', () => {
    let service: RechnungPositionenService;
    let httpMock: HttpTestingController;
    let elemDefault: IRechnungPositionen;
    let expectedResult: IRechnungPositionen | IRechnungPositionen[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(RechnungPositionenService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
        artikelName: 'AAAAAAA',
        artikelBeschreibung: 'AAAAAAA',
        artikelPreis: 0,
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

      it('should create a RechnungPositionen', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new RechnungPositionen()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a RechnungPositionen', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            artikelName: 'BBBBBB',
            artikelBeschreibung: 'BBBBBB',
            artikelPreis: 1,
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

      it('should partial update a RechnungPositionen', () => {
        const patchObject = Object.assign(
          {
            artikelName: 'BBBBBB',
            menge: 1,
          },
          new RechnungPositionen()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of RechnungPositionen', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            artikelName: 'BBBBBB',
            artikelBeschreibung: 'BBBBBB',
            artikelPreis: 1,
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

      it('should delete a RechnungPositionen', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addRechnungPositionenToCollectionIfMissing', () => {
        it('should add a RechnungPositionen to an empty array', () => {
          const rechnungPositionen: IRechnungPositionen = { id: 123 };
          expectedResult = service.addRechnungPositionenToCollectionIfMissing([], rechnungPositionen);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(rechnungPositionen);
        });

        it('should not add a RechnungPositionen to an array that contains it', () => {
          const rechnungPositionen: IRechnungPositionen = { id: 123 };
          const rechnungPositionenCollection: IRechnungPositionen[] = [
            {
              ...rechnungPositionen,
            },
            { id: 456 },
          ];
          expectedResult = service.addRechnungPositionenToCollectionIfMissing(rechnungPositionenCollection, rechnungPositionen);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a RechnungPositionen to an array that doesn't contain it", () => {
          const rechnungPositionen: IRechnungPositionen = { id: 123 };
          const rechnungPositionenCollection: IRechnungPositionen[] = [{ id: 456 }];
          expectedResult = service.addRechnungPositionenToCollectionIfMissing(rechnungPositionenCollection, rechnungPositionen);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(rechnungPositionen);
        });

        it('should add only unique RechnungPositionen to an array', () => {
          const rechnungPositionenArray: IRechnungPositionen[] = [{ id: 123 }, { id: 456 }, { id: 23064 }];
          const rechnungPositionenCollection: IRechnungPositionen[] = [{ id: 123 }];
          expectedResult = service.addRechnungPositionenToCollectionIfMissing(rechnungPositionenCollection, ...rechnungPositionenArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const rechnungPositionen: IRechnungPositionen = { id: 123 };
          const rechnungPositionen2: IRechnungPositionen = { id: 456 };
          expectedResult = service.addRechnungPositionenToCollectionIfMissing([], rechnungPositionen, rechnungPositionen2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(rechnungPositionen);
          expect(expectedResult).toContain(rechnungPositionen2);
        });

        it('should accept null and undefined values', () => {
          const rechnungPositionen: IRechnungPositionen = { id: 123 };
          expectedResult = service.addRechnungPositionenToCollectionIfMissing([], null, rechnungPositionen, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(rechnungPositionen);
        });

        it('should return initial array if no RechnungPositionen is added', () => {
          const rechnungPositionenCollection: IRechnungPositionen[] = [{ id: 123 }];
          expectedResult = service.addRechnungPositionenToCollectionIfMissing(rechnungPositionenCollection, undefined, null);
          expect(expectedResult).toEqual(rechnungPositionenCollection);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});

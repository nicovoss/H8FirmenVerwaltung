import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IArtikelZuBauteilmenge, ArtikelZuBauteilmenge } from '../artikel-zu-bauteilmenge.model';

import { ArtikelZuBauteilmengeService } from './artikel-zu-bauteilmenge.service';

describe('Service Tests', () => {
  describe('ArtikelZuBauteilmenge Service', () => {
    let service: ArtikelZuBauteilmengeService;
    let httpMock: HttpTestingController;
    let elemDefault: IArtikelZuBauteilmenge;
    let expectedResult: IArtikelZuBauteilmenge | IArtikelZuBauteilmenge[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(ArtikelZuBauteilmengeService);
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

      it('should create a ArtikelZuBauteilmenge', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new ArtikelZuBauteilmenge()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a ArtikelZuBauteilmenge', () => {
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

      it('should partial update a ArtikelZuBauteilmenge', () => {
        const patchObject = Object.assign(
          {
            menge: 1,
          },
          new ArtikelZuBauteilmenge()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of ArtikelZuBauteilmenge', () => {
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

      it('should delete a ArtikelZuBauteilmenge', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addArtikelZuBauteilmengeToCollectionIfMissing', () => {
        it('should add a ArtikelZuBauteilmenge to an empty array', () => {
          const artikelZuBauteilmenge: IArtikelZuBauteilmenge = { id: 123 };
          expectedResult = service.addArtikelZuBauteilmengeToCollectionIfMissing([], artikelZuBauteilmenge);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(artikelZuBauteilmenge);
        });

        it('should not add a ArtikelZuBauteilmenge to an array that contains it', () => {
          const artikelZuBauteilmenge: IArtikelZuBauteilmenge = { id: 123 };
          const artikelZuBauteilmengeCollection: IArtikelZuBauteilmenge[] = [
            {
              ...artikelZuBauteilmenge,
            },
            { id: 456 },
          ];
          expectedResult = service.addArtikelZuBauteilmengeToCollectionIfMissing(artikelZuBauteilmengeCollection, artikelZuBauteilmenge);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a ArtikelZuBauteilmenge to an array that doesn't contain it", () => {
          const artikelZuBauteilmenge: IArtikelZuBauteilmenge = { id: 123 };
          const artikelZuBauteilmengeCollection: IArtikelZuBauteilmenge[] = [{ id: 456 }];
          expectedResult = service.addArtikelZuBauteilmengeToCollectionIfMissing(artikelZuBauteilmengeCollection, artikelZuBauteilmenge);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(artikelZuBauteilmenge);
        });

        it('should add only unique ArtikelZuBauteilmenge to an array', () => {
          const artikelZuBauteilmengeArray: IArtikelZuBauteilmenge[] = [{ id: 123 }, { id: 456 }, { id: 39649 }];
          const artikelZuBauteilmengeCollection: IArtikelZuBauteilmenge[] = [{ id: 123 }];
          expectedResult = service.addArtikelZuBauteilmengeToCollectionIfMissing(
            artikelZuBauteilmengeCollection,
            ...artikelZuBauteilmengeArray
          );
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const artikelZuBauteilmenge: IArtikelZuBauteilmenge = { id: 123 };
          const artikelZuBauteilmenge2: IArtikelZuBauteilmenge = { id: 456 };
          expectedResult = service.addArtikelZuBauteilmengeToCollectionIfMissing([], artikelZuBauteilmenge, artikelZuBauteilmenge2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(artikelZuBauteilmenge);
          expect(expectedResult).toContain(artikelZuBauteilmenge2);
        });

        it('should accept null and undefined values', () => {
          const artikelZuBauteilmenge: IArtikelZuBauteilmenge = { id: 123 };
          expectedResult = service.addArtikelZuBauteilmengeToCollectionIfMissing([], null, artikelZuBauteilmenge, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(artikelZuBauteilmenge);
        });

        it('should return initial array if no ArtikelZuBauteilmenge is added', () => {
          const artikelZuBauteilmengeCollection: IArtikelZuBauteilmenge[] = [{ id: 123 }];
          expectedResult = service.addArtikelZuBauteilmengeToCollectionIfMissing(artikelZuBauteilmengeCollection, undefined, null);
          expect(expectedResult).toEqual(artikelZuBauteilmengeCollection);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});

import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IArtikelTyp, ArtikelTyp } from '../artikel-typ.model';

import { ArtikelTypService } from './artikel-typ.service';

describe('Service Tests', () => {
  describe('ArtikelTyp Service', () => {
    let service: ArtikelTypService;
    let httpMock: HttpTestingController;
    let elemDefault: IArtikelTyp;
    let expectedResult: IArtikelTyp | IArtikelTyp[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(ArtikelTypService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
        name: 'AAAAAAA',
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

      it('should create a ArtikelTyp', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new ArtikelTyp()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a ArtikelTyp', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            name: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a ArtikelTyp', () => {
        const patchObject = Object.assign({}, new ArtikelTyp());

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of ArtikelTyp', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            name: 'BBBBBB',
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

      it('should delete a ArtikelTyp', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addArtikelTypToCollectionIfMissing', () => {
        it('should add a ArtikelTyp to an empty array', () => {
          const artikelTyp: IArtikelTyp = { id: 123 };
          expectedResult = service.addArtikelTypToCollectionIfMissing([], artikelTyp);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(artikelTyp);
        });

        it('should not add a ArtikelTyp to an array that contains it', () => {
          const artikelTyp: IArtikelTyp = { id: 123 };
          const artikelTypCollection: IArtikelTyp[] = [
            {
              ...artikelTyp,
            },
            { id: 456 },
          ];
          expectedResult = service.addArtikelTypToCollectionIfMissing(artikelTypCollection, artikelTyp);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a ArtikelTyp to an array that doesn't contain it", () => {
          const artikelTyp: IArtikelTyp = { id: 123 };
          const artikelTypCollection: IArtikelTyp[] = [{ id: 456 }];
          expectedResult = service.addArtikelTypToCollectionIfMissing(artikelTypCollection, artikelTyp);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(artikelTyp);
        });

        it('should add only unique ArtikelTyp to an array', () => {
          const artikelTypArray: IArtikelTyp[] = [{ id: 123 }, { id: 456 }, { id: 91317 }];
          const artikelTypCollection: IArtikelTyp[] = [{ id: 123 }];
          expectedResult = service.addArtikelTypToCollectionIfMissing(artikelTypCollection, ...artikelTypArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const artikelTyp: IArtikelTyp = { id: 123 };
          const artikelTyp2: IArtikelTyp = { id: 456 };
          expectedResult = service.addArtikelTypToCollectionIfMissing([], artikelTyp, artikelTyp2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(artikelTyp);
          expect(expectedResult).toContain(artikelTyp2);
        });

        it('should accept null and undefined values', () => {
          const artikelTyp: IArtikelTyp = { id: 123 };
          expectedResult = service.addArtikelTypToCollectionIfMissing([], null, artikelTyp, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(artikelTyp);
        });

        it('should return initial array if no ArtikelTyp is added', () => {
          const artikelTypCollection: IArtikelTyp[] = [{ id: 123 }];
          expectedResult = service.addArtikelTypToCollectionIfMissing(artikelTypCollection, undefined, null);
          expect(expectedResult).toEqual(artikelTypCollection);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});

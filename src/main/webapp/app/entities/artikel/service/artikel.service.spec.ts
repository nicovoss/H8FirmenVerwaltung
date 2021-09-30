import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IArtikel, Artikel } from '../artikel.model';

import { ArtikelService } from './artikel.service';

describe('Service Tests', () => {
  describe('Artikel Service', () => {
    let service: ArtikelService;
    let httpMock: HttpTestingController;
    let elemDefault: IArtikel;
    let expectedResult: IArtikel | IArtikel[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(ArtikelService);
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

      it('should create a Artikel', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new Artikel()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Artikel', () => {
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

      it('should partial update a Artikel', () => {
        const patchObject = Object.assign(
          {
            name: 'BBBBBB',
          },
          new Artikel()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Artikel', () => {
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

      it('should delete a Artikel', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addArtikelToCollectionIfMissing', () => {
        it('should add a Artikel to an empty array', () => {
          const artikel: IArtikel = { id: 123 };
          expectedResult = service.addArtikelToCollectionIfMissing([], artikel);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(artikel);
        });

        it('should not add a Artikel to an array that contains it', () => {
          const artikel: IArtikel = { id: 123 };
          const artikelCollection: IArtikel[] = [
            {
              ...artikel,
            },
            { id: 456 },
          ];
          expectedResult = service.addArtikelToCollectionIfMissing(artikelCollection, artikel);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Artikel to an array that doesn't contain it", () => {
          const artikel: IArtikel = { id: 123 };
          const artikelCollection: IArtikel[] = [{ id: 456 }];
          expectedResult = service.addArtikelToCollectionIfMissing(artikelCollection, artikel);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(artikel);
        });

        it('should add only unique Artikel to an array', () => {
          const artikelArray: IArtikel[] = [{ id: 123 }, { id: 456 }, { id: 93417 }];
          const artikelCollection: IArtikel[] = [{ id: 123 }];
          expectedResult = service.addArtikelToCollectionIfMissing(artikelCollection, ...artikelArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const artikel: IArtikel = { id: 123 };
          const artikel2: IArtikel = { id: 456 };
          expectedResult = service.addArtikelToCollectionIfMissing([], artikel, artikel2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(artikel);
          expect(expectedResult).toContain(artikel2);
        });

        it('should accept null and undefined values', () => {
          const artikel: IArtikel = { id: 123 };
          expectedResult = service.addArtikelToCollectionIfMissing([], null, artikel, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(artikel);
        });

        it('should return initial array if no Artikel is added', () => {
          const artikelCollection: IArtikel[] = [{ id: 123 }];
          expectedResult = service.addArtikelToCollectionIfMissing(artikelCollection, undefined, null);
          expect(expectedResult).toEqual(artikelCollection);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});

import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IBauteil, Bauteil } from '../bauteil.model';

import { BauteilService } from './bauteil.service';

describe('Service Tests', () => {
  describe('Bauteil Service', () => {
    let service: BauteilService;
    let httpMock: HttpTestingController;
    let elemDefault: IBauteil;
    let expectedResult: IBauteil | IBauteil[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(BauteilService);
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

      it('should create a Bauteil', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new Bauteil()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Bauteil', () => {
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

      it('should partial update a Bauteil', () => {
        const patchObject = Object.assign(
          {
            name: 'BBBBBB',
          },
          new Bauteil()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Bauteil', () => {
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

      it('should delete a Bauteil', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addBauteilToCollectionIfMissing', () => {
        it('should add a Bauteil to an empty array', () => {
          const bauteil: IBauteil = { id: 123 };
          expectedResult = service.addBauteilToCollectionIfMissing([], bauteil);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(bauteil);
        });

        it('should not add a Bauteil to an array that contains it', () => {
          const bauteil: IBauteil = { id: 123 };
          const bauteilCollection: IBauteil[] = [
            {
              ...bauteil,
            },
            { id: 456 },
          ];
          expectedResult = service.addBauteilToCollectionIfMissing(bauteilCollection, bauteil);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Bauteil to an array that doesn't contain it", () => {
          const bauteil: IBauteil = { id: 123 };
          const bauteilCollection: IBauteil[] = [{ id: 456 }];
          expectedResult = service.addBauteilToCollectionIfMissing(bauteilCollection, bauteil);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(bauteil);
        });

        it('should add only unique Bauteil to an array', () => {
          const bauteilArray: IBauteil[] = [{ id: 123 }, { id: 456 }, { id: 1553 }];
          const bauteilCollection: IBauteil[] = [{ id: 123 }];
          expectedResult = service.addBauteilToCollectionIfMissing(bauteilCollection, ...bauteilArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const bauteil: IBauteil = { id: 123 };
          const bauteil2: IBauteil = { id: 456 };
          expectedResult = service.addBauteilToCollectionIfMissing([], bauteil, bauteil2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(bauteil);
          expect(expectedResult).toContain(bauteil2);
        });

        it('should accept null and undefined values', () => {
          const bauteil: IBauteil = { id: 123 };
          expectedResult = service.addBauteilToCollectionIfMissing([], null, bauteil, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(bauteil);
        });

        it('should return initial array if no Bauteil is added', () => {
          const bauteilCollection: IBauteil[] = [{ id: 123 }];
          expectedResult = service.addBauteilToCollectionIfMissing(bauteilCollection, undefined, null);
          expect(expectedResult).toEqual(bauteilCollection);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});

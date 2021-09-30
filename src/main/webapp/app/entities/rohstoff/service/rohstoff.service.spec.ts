import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IRohstoff, Rohstoff } from '../rohstoff.model';

import { RohstoffService } from './rohstoff.service';

describe('Service Tests', () => {
  describe('Rohstoff Service', () => {
    let service: RohstoffService;
    let httpMock: HttpTestingController;
    let elemDefault: IRohstoff;
    let expectedResult: IRohstoff | IRohstoff[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(RohstoffService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
        name: 'AAAAAAA',
        preis: 0,
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

      it('should create a Rohstoff', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new Rohstoff()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Rohstoff', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            name: 'BBBBBB',
            preis: 1,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Rohstoff', () => {
        const patchObject = Object.assign(
          {
            preis: 1,
          },
          new Rohstoff()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Rohstoff', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            name: 'BBBBBB',
            preis: 1,
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

      it('should delete a Rohstoff', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addRohstoffToCollectionIfMissing', () => {
        it('should add a Rohstoff to an empty array', () => {
          const rohstoff: IRohstoff = { id: 123 };
          expectedResult = service.addRohstoffToCollectionIfMissing([], rohstoff);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(rohstoff);
        });

        it('should not add a Rohstoff to an array that contains it', () => {
          const rohstoff: IRohstoff = { id: 123 };
          const rohstoffCollection: IRohstoff[] = [
            {
              ...rohstoff,
            },
            { id: 456 },
          ];
          expectedResult = service.addRohstoffToCollectionIfMissing(rohstoffCollection, rohstoff);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Rohstoff to an array that doesn't contain it", () => {
          const rohstoff: IRohstoff = { id: 123 };
          const rohstoffCollection: IRohstoff[] = [{ id: 456 }];
          expectedResult = service.addRohstoffToCollectionIfMissing(rohstoffCollection, rohstoff);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(rohstoff);
        });

        it('should add only unique Rohstoff to an array', () => {
          const rohstoffArray: IRohstoff[] = [{ id: 123 }, { id: 456 }, { id: 99399 }];
          const rohstoffCollection: IRohstoff[] = [{ id: 123 }];
          expectedResult = service.addRohstoffToCollectionIfMissing(rohstoffCollection, ...rohstoffArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const rohstoff: IRohstoff = { id: 123 };
          const rohstoff2: IRohstoff = { id: 456 };
          expectedResult = service.addRohstoffToCollectionIfMissing([], rohstoff, rohstoff2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(rohstoff);
          expect(expectedResult).toContain(rohstoff2);
        });

        it('should accept null and undefined values', () => {
          const rohstoff: IRohstoff = { id: 123 };
          expectedResult = service.addRohstoffToCollectionIfMissing([], null, rohstoff, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(rohstoff);
        });

        it('should return initial array if no Rohstoff is added', () => {
          const rohstoffCollection: IRohstoff[] = [{ id: 123 }];
          expectedResult = service.addRohstoffToCollectionIfMissing(rohstoffCollection, undefined, null);
          expect(expectedResult).toEqual(rohstoffCollection);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});

import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IBauteileZuRohstoffe, BauteileZuRohstoffe } from '../bauteile-zu-rohstoffe.model';

import { BauteileZuRohstoffeService } from './bauteile-zu-rohstoffe.service';

describe('Service Tests', () => {
  describe('BauteileZuRohstoffe Service', () => {
    let service: BauteileZuRohstoffeService;
    let httpMock: HttpTestingController;
    let elemDefault: IBauteileZuRohstoffe;
    let expectedResult: IBauteileZuRohstoffe | IBauteileZuRohstoffe[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(BauteileZuRohstoffeService);
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

      it('should create a BauteileZuRohstoffe', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new BauteileZuRohstoffe()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a BauteileZuRohstoffe', () => {
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

      it('should partial update a BauteileZuRohstoffe', () => {
        const patchObject = Object.assign(
          {
            menge: 1,
          },
          new BauteileZuRohstoffe()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of BauteileZuRohstoffe', () => {
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

      it('should delete a BauteileZuRohstoffe', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addBauteileZuRohstoffeToCollectionIfMissing', () => {
        it('should add a BauteileZuRohstoffe to an empty array', () => {
          const bauteileZuRohstoffe: IBauteileZuRohstoffe = { id: 123 };
          expectedResult = service.addBauteileZuRohstoffeToCollectionIfMissing([], bauteileZuRohstoffe);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(bauteileZuRohstoffe);
        });

        it('should not add a BauteileZuRohstoffe to an array that contains it', () => {
          const bauteileZuRohstoffe: IBauteileZuRohstoffe = { id: 123 };
          const bauteileZuRohstoffeCollection: IBauteileZuRohstoffe[] = [
            {
              ...bauteileZuRohstoffe,
            },
            { id: 456 },
          ];
          expectedResult = service.addBauteileZuRohstoffeToCollectionIfMissing(bauteileZuRohstoffeCollection, bauteileZuRohstoffe);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a BauteileZuRohstoffe to an array that doesn't contain it", () => {
          const bauteileZuRohstoffe: IBauteileZuRohstoffe = { id: 123 };
          const bauteileZuRohstoffeCollection: IBauteileZuRohstoffe[] = [{ id: 456 }];
          expectedResult = service.addBauteileZuRohstoffeToCollectionIfMissing(bauteileZuRohstoffeCollection, bauteileZuRohstoffe);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(bauteileZuRohstoffe);
        });

        it('should add only unique BauteileZuRohstoffe to an array', () => {
          const bauteileZuRohstoffeArray: IBauteileZuRohstoffe[] = [{ id: 123 }, { id: 456 }, { id: 25749 }];
          const bauteileZuRohstoffeCollection: IBauteileZuRohstoffe[] = [{ id: 123 }];
          expectedResult = service.addBauteileZuRohstoffeToCollectionIfMissing(bauteileZuRohstoffeCollection, ...bauteileZuRohstoffeArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const bauteileZuRohstoffe: IBauteileZuRohstoffe = { id: 123 };
          const bauteileZuRohstoffe2: IBauteileZuRohstoffe = { id: 456 };
          expectedResult = service.addBauteileZuRohstoffeToCollectionIfMissing([], bauteileZuRohstoffe, bauteileZuRohstoffe2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(bauteileZuRohstoffe);
          expect(expectedResult).toContain(bauteileZuRohstoffe2);
        });

        it('should accept null and undefined values', () => {
          const bauteileZuRohstoffe: IBauteileZuRohstoffe = { id: 123 };
          expectedResult = service.addBauteileZuRohstoffeToCollectionIfMissing([], null, bauteileZuRohstoffe, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(bauteileZuRohstoffe);
        });

        it('should return initial array if no BauteileZuRohstoffe is added', () => {
          const bauteileZuRohstoffeCollection: IBauteileZuRohstoffe[] = [{ id: 123 }];
          expectedResult = service.addBauteileZuRohstoffeToCollectionIfMissing(bauteileZuRohstoffeCollection, undefined, null);
          expect(expectedResult).toEqual(bauteileZuRohstoffeCollection);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});

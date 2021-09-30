import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IBediener, Bediener } from '../bediener.model';

import { BedienerService } from './bediener.service';

describe('Service Tests', () => {
  describe('Bediener Service', () => {
    let service: BedienerService;
    let httpMock: HttpTestingController;
    let elemDefault: IBediener;
    let expectedResult: IBediener | IBediener[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(BedienerService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
        vname: 'AAAAAAA',
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

      it('should create a Bediener', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new Bediener()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Bediener', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            vname: 'BBBBBB',
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

      it('should partial update a Bediener', () => {
        const patchObject = Object.assign(
          {
            vname: 'BBBBBB',
            name: 'BBBBBB',
          },
          new Bediener()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Bediener', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            vname: 'BBBBBB',
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

      it('should delete a Bediener', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addBedienerToCollectionIfMissing', () => {
        it('should add a Bediener to an empty array', () => {
          const bediener: IBediener = { id: 123 };
          expectedResult = service.addBedienerToCollectionIfMissing([], bediener);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(bediener);
        });

        it('should not add a Bediener to an array that contains it', () => {
          const bediener: IBediener = { id: 123 };
          const bedienerCollection: IBediener[] = [
            {
              ...bediener,
            },
            { id: 456 },
          ];
          expectedResult = service.addBedienerToCollectionIfMissing(bedienerCollection, bediener);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Bediener to an array that doesn't contain it", () => {
          const bediener: IBediener = { id: 123 };
          const bedienerCollection: IBediener[] = [{ id: 456 }];
          expectedResult = service.addBedienerToCollectionIfMissing(bedienerCollection, bediener);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(bediener);
        });

        it('should add only unique Bediener to an array', () => {
          const bedienerArray: IBediener[] = [{ id: 123 }, { id: 456 }, { id: 6957 }];
          const bedienerCollection: IBediener[] = [{ id: 123 }];
          expectedResult = service.addBedienerToCollectionIfMissing(bedienerCollection, ...bedienerArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const bediener: IBediener = { id: 123 };
          const bediener2: IBediener = { id: 456 };
          expectedResult = service.addBedienerToCollectionIfMissing([], bediener, bediener2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(bediener);
          expect(expectedResult).toContain(bediener2);
        });

        it('should accept null and undefined values', () => {
          const bediener: IBediener = { id: 123 };
          expectedResult = service.addBedienerToCollectionIfMissing([], null, bediener, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(bediener);
        });

        it('should return initial array if no Bediener is added', () => {
          const bedienerCollection: IBediener[] = [{ id: 123 }];
          expectedResult = service.addBedienerToCollectionIfMissing(bedienerCollection, undefined, null);
          expect(expectedResult).toEqual(bedienerCollection);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});

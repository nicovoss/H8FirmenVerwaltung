import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IPatner, Patner } from '../patner.model';

import { PatnerService } from './patner.service';

describe('Service Tests', () => {
  describe('Patner Service', () => {
    let service: PatnerService;
    let httpMock: HttpTestingController;
    let elemDefault: IPatner;
    let expectedResult: IPatner | IPatner[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(PatnerService);
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

      it('should create a Patner', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new Patner()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Patner', () => {
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

      it('should partial update a Patner', () => {
        const patchObject = Object.assign({}, new Patner());

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Patner', () => {
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

      it('should delete a Patner', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addPatnerToCollectionIfMissing', () => {
        it('should add a Patner to an empty array', () => {
          const patner: IPatner = { id: 123 };
          expectedResult = service.addPatnerToCollectionIfMissing([], patner);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(patner);
        });

        it('should not add a Patner to an array that contains it', () => {
          const patner: IPatner = { id: 123 };
          const patnerCollection: IPatner[] = [
            {
              ...patner,
            },
            { id: 456 },
          ];
          expectedResult = service.addPatnerToCollectionIfMissing(patnerCollection, patner);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Patner to an array that doesn't contain it", () => {
          const patner: IPatner = { id: 123 };
          const patnerCollection: IPatner[] = [{ id: 456 }];
          expectedResult = service.addPatnerToCollectionIfMissing(patnerCollection, patner);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(patner);
        });

        it('should add only unique Patner to an array', () => {
          const patnerArray: IPatner[] = [{ id: 123 }, { id: 456 }, { id: 77990 }];
          const patnerCollection: IPatner[] = [{ id: 123 }];
          expectedResult = service.addPatnerToCollectionIfMissing(patnerCollection, ...patnerArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const patner: IPatner = { id: 123 };
          const patner2: IPatner = { id: 456 };
          expectedResult = service.addPatnerToCollectionIfMissing([], patner, patner2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(patner);
          expect(expectedResult).toContain(patner2);
        });

        it('should accept null and undefined values', () => {
          const patner: IPatner = { id: 123 };
          expectedResult = service.addPatnerToCollectionIfMissing([], null, patner, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(patner);
        });

        it('should return initial array if no Patner is added', () => {
          const patnerCollection: IPatner[] = [{ id: 123 }];
          expectedResult = service.addPatnerToCollectionIfMissing(patnerCollection, undefined, null);
          expect(expectedResult).toEqual(patnerCollection);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});

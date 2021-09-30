import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IBauteilGruppe, BauteilGruppe } from '../bauteil-gruppe.model';

import { BauteilGruppeService } from './bauteil-gruppe.service';

describe('Service Tests', () => {
  describe('BauteilGruppe Service', () => {
    let service: BauteilGruppeService;
    let httpMock: HttpTestingController;
    let elemDefault: IBauteilGruppe;
    let expectedResult: IBauteilGruppe | IBauteilGruppe[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(BauteilGruppeService);
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

      it('should create a BauteilGruppe', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new BauteilGruppe()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a BauteilGruppe', () => {
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

      it('should partial update a BauteilGruppe', () => {
        const patchObject = Object.assign({}, new BauteilGruppe());

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of BauteilGruppe', () => {
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

      it('should delete a BauteilGruppe', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addBauteilGruppeToCollectionIfMissing', () => {
        it('should add a BauteilGruppe to an empty array', () => {
          const bauteilGruppe: IBauteilGruppe = { id: 123 };
          expectedResult = service.addBauteilGruppeToCollectionIfMissing([], bauteilGruppe);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(bauteilGruppe);
        });

        it('should not add a BauteilGruppe to an array that contains it', () => {
          const bauteilGruppe: IBauteilGruppe = { id: 123 };
          const bauteilGruppeCollection: IBauteilGruppe[] = [
            {
              ...bauteilGruppe,
            },
            { id: 456 },
          ];
          expectedResult = service.addBauteilGruppeToCollectionIfMissing(bauteilGruppeCollection, bauteilGruppe);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a BauteilGruppe to an array that doesn't contain it", () => {
          const bauteilGruppe: IBauteilGruppe = { id: 123 };
          const bauteilGruppeCollection: IBauteilGruppe[] = [{ id: 456 }];
          expectedResult = service.addBauteilGruppeToCollectionIfMissing(bauteilGruppeCollection, bauteilGruppe);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(bauteilGruppe);
        });

        it('should add only unique BauteilGruppe to an array', () => {
          const bauteilGruppeArray: IBauteilGruppe[] = [{ id: 123 }, { id: 456 }, { id: 11776 }];
          const bauteilGruppeCollection: IBauteilGruppe[] = [{ id: 123 }];
          expectedResult = service.addBauteilGruppeToCollectionIfMissing(bauteilGruppeCollection, ...bauteilGruppeArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const bauteilGruppe: IBauteilGruppe = { id: 123 };
          const bauteilGruppe2: IBauteilGruppe = { id: 456 };
          expectedResult = service.addBauteilGruppeToCollectionIfMissing([], bauteilGruppe, bauteilGruppe2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(bauteilGruppe);
          expect(expectedResult).toContain(bauteilGruppe2);
        });

        it('should accept null and undefined values', () => {
          const bauteilGruppe: IBauteilGruppe = { id: 123 };
          expectedResult = service.addBauteilGruppeToCollectionIfMissing([], null, bauteilGruppe, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(bauteilGruppe);
        });

        it('should return initial array if no BauteilGruppe is added', () => {
          const bauteilGruppeCollection: IBauteilGruppe[] = [{ id: 123 }];
          expectedResult = service.addBauteilGruppeToCollectionIfMissing(bauteilGruppeCollection, undefined, null);
          expect(expectedResult).toEqual(bauteilGruppeCollection);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});

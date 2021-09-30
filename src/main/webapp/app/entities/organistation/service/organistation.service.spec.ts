import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IOrganistation, Organistation } from '../organistation.model';

import { OrganistationService } from './organistation.service';

describe('Service Tests', () => {
  describe('Organistation Service', () => {
    let service: OrganistationService;
    let httpMock: HttpTestingController;
    let elemDefault: IOrganistation;
    let expectedResult: IOrganistation | IOrganistation[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(OrganistationService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
        orgaId: 0,
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

      it('should create a Organistation', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new Organistation()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Organistation', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            orgaId: 1,
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

      it('should partial update a Organistation', () => {
        const patchObject = Object.assign(
          {
            name: 'BBBBBB',
          },
          new Organistation()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Organistation', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            orgaId: 1,
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

      it('should delete a Organistation', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addOrganistationToCollectionIfMissing', () => {
        it('should add a Organistation to an empty array', () => {
          const organistation: IOrganistation = { id: 123 };
          expectedResult = service.addOrganistationToCollectionIfMissing([], organistation);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(organistation);
        });

        it('should not add a Organistation to an array that contains it', () => {
          const organistation: IOrganistation = { id: 123 };
          const organistationCollection: IOrganistation[] = [
            {
              ...organistation,
            },
            { id: 456 },
          ];
          expectedResult = service.addOrganistationToCollectionIfMissing(organistationCollection, organistation);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Organistation to an array that doesn't contain it", () => {
          const organistation: IOrganistation = { id: 123 };
          const organistationCollection: IOrganistation[] = [{ id: 456 }];
          expectedResult = service.addOrganistationToCollectionIfMissing(organistationCollection, organistation);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(organistation);
        });

        it('should add only unique Organistation to an array', () => {
          const organistationArray: IOrganistation[] = [{ id: 123 }, { id: 456 }, { id: 4697 }];
          const organistationCollection: IOrganistation[] = [{ id: 123 }];
          expectedResult = service.addOrganistationToCollectionIfMissing(organistationCollection, ...organistationArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const organistation: IOrganistation = { id: 123 };
          const organistation2: IOrganistation = { id: 456 };
          expectedResult = service.addOrganistationToCollectionIfMissing([], organistation, organistation2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(organistation);
          expect(expectedResult).toContain(organistation2);
        });

        it('should accept null and undefined values', () => {
          const organistation: IOrganistation = { id: 123 };
          expectedResult = service.addOrganistationToCollectionIfMissing([], null, organistation, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(organistation);
        });

        it('should return initial array if no Organistation is added', () => {
          const organistationCollection: IOrganistation[] = [{ id: 123 }];
          expectedResult = service.addOrganistationToCollectionIfMissing(organistationCollection, undefined, null);
          expect(expectedResult).toEqual(organistationCollection);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});

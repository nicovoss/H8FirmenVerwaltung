jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IRechnungKopf, RechnungKopf } from '../rechnung-kopf.model';
import { RechnungKopfService } from '../service/rechnung-kopf.service';

import { RechnungKopfRoutingResolveService } from './rechnung-kopf-routing-resolve.service';

describe('Service Tests', () => {
  describe('RechnungKopf routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: RechnungKopfRoutingResolveService;
    let service: RechnungKopfService;
    let resultRechnungKopf: IRechnungKopf | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(RechnungKopfRoutingResolveService);
      service = TestBed.inject(RechnungKopfService);
      resultRechnungKopf = undefined;
    });

    describe('resolve', () => {
      it('should return IRechnungKopf returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultRechnungKopf = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultRechnungKopf).toEqual({ id: 123 });
      });

      it('should return new IRechnungKopf if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultRechnungKopf = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultRechnungKopf).toEqual(new RechnungKopf());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as RechnungKopf })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultRechnungKopf = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultRechnungKopf).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});

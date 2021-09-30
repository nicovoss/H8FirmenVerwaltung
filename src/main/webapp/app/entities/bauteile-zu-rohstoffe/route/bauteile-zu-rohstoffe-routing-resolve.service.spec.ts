jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IBauteileZuRohstoffe, BauteileZuRohstoffe } from '../bauteile-zu-rohstoffe.model';
import { BauteileZuRohstoffeService } from '../service/bauteile-zu-rohstoffe.service';

import { BauteileZuRohstoffeRoutingResolveService } from './bauteile-zu-rohstoffe-routing-resolve.service';

describe('Service Tests', () => {
  describe('BauteileZuRohstoffe routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: BauteileZuRohstoffeRoutingResolveService;
    let service: BauteileZuRohstoffeService;
    let resultBauteileZuRohstoffe: IBauteileZuRohstoffe | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(BauteileZuRohstoffeRoutingResolveService);
      service = TestBed.inject(BauteileZuRohstoffeService);
      resultBauteileZuRohstoffe = undefined;
    });

    describe('resolve', () => {
      it('should return IBauteileZuRohstoffe returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultBauteileZuRohstoffe = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultBauteileZuRohstoffe).toEqual({ id: 123 });
      });

      it('should return new IBauteileZuRohstoffe if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultBauteileZuRohstoffe = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultBauteileZuRohstoffe).toEqual(new BauteileZuRohstoffe());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as BauteileZuRohstoffe })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultBauteileZuRohstoffe = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultBauteileZuRohstoffe).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});

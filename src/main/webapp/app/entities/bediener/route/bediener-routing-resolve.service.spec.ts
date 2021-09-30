jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IBediener, Bediener } from '../bediener.model';
import { BedienerService } from '../service/bediener.service';

import { BedienerRoutingResolveService } from './bediener-routing-resolve.service';

describe('Service Tests', () => {
  describe('Bediener routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: BedienerRoutingResolveService;
    let service: BedienerService;
    let resultBediener: IBediener | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(BedienerRoutingResolveService);
      service = TestBed.inject(BedienerService);
      resultBediener = undefined;
    });

    describe('resolve', () => {
      it('should return IBediener returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultBediener = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultBediener).toEqual({ id: 123 });
      });

      it('should return new IBediener if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultBediener = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultBediener).toEqual(new Bediener());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as Bediener })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultBediener = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultBediener).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});

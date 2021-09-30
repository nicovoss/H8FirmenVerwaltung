jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IBauteil, Bauteil } from '../bauteil.model';
import { BauteilService } from '../service/bauteil.service';

import { BauteilRoutingResolveService } from './bauteil-routing-resolve.service';

describe('Service Tests', () => {
  describe('Bauteil routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: BauteilRoutingResolveService;
    let service: BauteilService;
    let resultBauteil: IBauteil | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(BauteilRoutingResolveService);
      service = TestBed.inject(BauteilService);
      resultBauteil = undefined;
    });

    describe('resolve', () => {
      it('should return IBauteil returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultBauteil = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultBauteil).toEqual({ id: 123 });
      });

      it('should return new IBauteil if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultBauteil = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultBauteil).toEqual(new Bauteil());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as Bauteil })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultBauteil = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultBauteil).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});

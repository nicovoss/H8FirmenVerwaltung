jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IRohstoff, Rohstoff } from '../rohstoff.model';
import { RohstoffService } from '../service/rohstoff.service';

import { RohstoffRoutingResolveService } from './rohstoff-routing-resolve.service';

describe('Service Tests', () => {
  describe('Rohstoff routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: RohstoffRoutingResolveService;
    let service: RohstoffService;
    let resultRohstoff: IRohstoff | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(RohstoffRoutingResolveService);
      service = TestBed.inject(RohstoffService);
      resultRohstoff = undefined;
    });

    describe('resolve', () => {
      it('should return IRohstoff returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultRohstoff = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultRohstoff).toEqual({ id: 123 });
      });

      it('should return new IRohstoff if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultRohstoff = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultRohstoff).toEqual(new Rohstoff());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as Rohstoff })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultRohstoff = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultRohstoff).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});

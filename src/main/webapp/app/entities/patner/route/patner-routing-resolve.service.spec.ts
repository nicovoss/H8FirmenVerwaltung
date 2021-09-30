jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IPatner, Patner } from '../patner.model';
import { PatnerService } from '../service/patner.service';

import { PatnerRoutingResolveService } from './patner-routing-resolve.service';

describe('Service Tests', () => {
  describe('Patner routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: PatnerRoutingResolveService;
    let service: PatnerService;
    let resultPatner: IPatner | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(PatnerRoutingResolveService);
      service = TestBed.inject(PatnerService);
      resultPatner = undefined;
    });

    describe('resolve', () => {
      it('should return IPatner returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultPatner = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultPatner).toEqual({ id: 123 });
      });

      it('should return new IPatner if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultPatner = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultPatner).toEqual(new Patner());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as Patner })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultPatner = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultPatner).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});

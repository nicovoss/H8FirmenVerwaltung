jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IArtikelZuBauteilmenge, ArtikelZuBauteilmenge } from '../artikel-zu-bauteilmenge.model';
import { ArtikelZuBauteilmengeService } from '../service/artikel-zu-bauteilmenge.service';

import { ArtikelZuBauteilmengeRoutingResolveService } from './artikel-zu-bauteilmenge-routing-resolve.service';

describe('Service Tests', () => {
  describe('ArtikelZuBauteilmenge routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: ArtikelZuBauteilmengeRoutingResolveService;
    let service: ArtikelZuBauteilmengeService;
    let resultArtikelZuBauteilmenge: IArtikelZuBauteilmenge | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(ArtikelZuBauteilmengeRoutingResolveService);
      service = TestBed.inject(ArtikelZuBauteilmengeService);
      resultArtikelZuBauteilmenge = undefined;
    });

    describe('resolve', () => {
      it('should return IArtikelZuBauteilmenge returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultArtikelZuBauteilmenge = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultArtikelZuBauteilmenge).toEqual({ id: 123 });
      });

      it('should return new IArtikelZuBauteilmenge if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultArtikelZuBauteilmenge = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultArtikelZuBauteilmenge).toEqual(new ArtikelZuBauteilmenge());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as ArtikelZuBauteilmenge })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultArtikelZuBauteilmenge = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultArtikelZuBauteilmenge).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});

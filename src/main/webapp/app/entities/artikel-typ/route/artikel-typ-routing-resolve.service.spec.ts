jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IArtikelTyp, ArtikelTyp } from '../artikel-typ.model';
import { ArtikelTypService } from '../service/artikel-typ.service';

import { ArtikelTypRoutingResolveService } from './artikel-typ-routing-resolve.service';

describe('Service Tests', () => {
  describe('ArtikelTyp routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: ArtikelTypRoutingResolveService;
    let service: ArtikelTypService;
    let resultArtikelTyp: IArtikelTyp | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(ArtikelTypRoutingResolveService);
      service = TestBed.inject(ArtikelTypService);
      resultArtikelTyp = undefined;
    });

    describe('resolve', () => {
      it('should return IArtikelTyp returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultArtikelTyp = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultArtikelTyp).toEqual({ id: 123 });
      });

      it('should return new IArtikelTyp if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultArtikelTyp = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultArtikelTyp).toEqual(new ArtikelTyp());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as ArtikelTyp })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultArtikelTyp = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultArtikelTyp).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});

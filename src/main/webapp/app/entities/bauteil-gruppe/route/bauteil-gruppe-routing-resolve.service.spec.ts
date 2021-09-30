jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IBauteilGruppe, BauteilGruppe } from '../bauteil-gruppe.model';
import { BauteilGruppeService } from '../service/bauteil-gruppe.service';

import { BauteilGruppeRoutingResolveService } from './bauteil-gruppe-routing-resolve.service';

describe('Service Tests', () => {
  describe('BauteilGruppe routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: BauteilGruppeRoutingResolveService;
    let service: BauteilGruppeService;
    let resultBauteilGruppe: IBauteilGruppe | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(BauteilGruppeRoutingResolveService);
      service = TestBed.inject(BauteilGruppeService);
      resultBauteilGruppe = undefined;
    });

    describe('resolve', () => {
      it('should return IBauteilGruppe returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultBauteilGruppe = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultBauteilGruppe).toEqual({ id: 123 });
      });

      it('should return new IBauteilGruppe if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultBauteilGruppe = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultBauteilGruppe).toEqual(new BauteilGruppe());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as BauteilGruppe })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultBauteilGruppe = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultBauteilGruppe).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});

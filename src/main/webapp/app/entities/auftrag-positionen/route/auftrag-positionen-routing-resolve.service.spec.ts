jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IAuftragPositionen, AuftragPositionen } from '../auftrag-positionen.model';
import { AuftragPositionenService } from '../service/auftrag-positionen.service';

import { AuftragPositionenRoutingResolveService } from './auftrag-positionen-routing-resolve.service';

describe('Service Tests', () => {
  describe('AuftragPositionen routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: AuftragPositionenRoutingResolveService;
    let service: AuftragPositionenService;
    let resultAuftragPositionen: IAuftragPositionen | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(AuftragPositionenRoutingResolveService);
      service = TestBed.inject(AuftragPositionenService);
      resultAuftragPositionen = undefined;
    });

    describe('resolve', () => {
      it('should return IAuftragPositionen returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultAuftragPositionen = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultAuftragPositionen).toEqual({ id: 123 });
      });

      it('should return new IAuftragPositionen if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultAuftragPositionen = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultAuftragPositionen).toEqual(new AuftragPositionen());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as AuftragPositionen })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultAuftragPositionen = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultAuftragPositionen).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});

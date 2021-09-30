jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IAuftrag, Auftrag } from '../auftrag.model';
import { AuftragService } from '../service/auftrag.service';

import { AuftragRoutingResolveService } from './auftrag-routing-resolve.service';

describe('Service Tests', () => {
  describe('Auftrag routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: AuftragRoutingResolveService;
    let service: AuftragService;
    let resultAuftrag: IAuftrag | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(AuftragRoutingResolveService);
      service = TestBed.inject(AuftragService);
      resultAuftrag = undefined;
    });

    describe('resolve', () => {
      it('should return IAuftrag returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultAuftrag = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultAuftrag).toEqual({ id: 123 });
      });

      it('should return new IAuftrag if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultAuftrag = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultAuftrag).toEqual(new Auftrag());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as Auftrag })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultAuftrag = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultAuftrag).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});

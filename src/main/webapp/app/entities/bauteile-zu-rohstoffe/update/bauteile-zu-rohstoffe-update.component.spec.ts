jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { BauteileZuRohstoffeService } from '../service/bauteile-zu-rohstoffe.service';
import { IBauteileZuRohstoffe, BauteileZuRohstoffe } from '../bauteile-zu-rohstoffe.model';
import { IBauteil } from 'app/entities/bauteil/bauteil.model';
import { BauteilService } from 'app/entities/bauteil/service/bauteil.service';
import { IRohstoff } from 'app/entities/rohstoff/rohstoff.model';
import { RohstoffService } from 'app/entities/rohstoff/service/rohstoff.service';

import { BauteileZuRohstoffeUpdateComponent } from './bauteile-zu-rohstoffe-update.component';

describe('Component Tests', () => {
  describe('BauteileZuRohstoffe Management Update Component', () => {
    let comp: BauteileZuRohstoffeUpdateComponent;
    let fixture: ComponentFixture<BauteileZuRohstoffeUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let bauteileZuRohstoffeService: BauteileZuRohstoffeService;
    let bauteilService: BauteilService;
    let rohstoffService: RohstoffService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [BauteileZuRohstoffeUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(BauteileZuRohstoffeUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(BauteileZuRohstoffeUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      bauteileZuRohstoffeService = TestBed.inject(BauteileZuRohstoffeService);
      bauteilService = TestBed.inject(BauteilService);
      rohstoffService = TestBed.inject(RohstoffService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Bauteil query and add missing value', () => {
        const bauteileZuRohstoffe: IBauteileZuRohstoffe = { id: 456 };
        const bauteil: IBauteil = { id: 16011 };
        bauteileZuRohstoffe.bauteil = bauteil;

        const bauteilCollection: IBauteil[] = [{ id: 92815 }];
        jest.spyOn(bauteilService, 'query').mockReturnValue(of(new HttpResponse({ body: bauteilCollection })));
        const additionalBauteils = [bauteil];
        const expectedCollection: IBauteil[] = [...additionalBauteils, ...bauteilCollection];
        jest.spyOn(bauteilService, 'addBauteilToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ bauteileZuRohstoffe });
        comp.ngOnInit();

        expect(bauteilService.query).toHaveBeenCalled();
        expect(bauteilService.addBauteilToCollectionIfMissing).toHaveBeenCalledWith(bauteilCollection, ...additionalBauteils);
        expect(comp.bauteilsSharedCollection).toEqual(expectedCollection);
      });

      it('Should call Rohstoff query and add missing value', () => {
        const bauteileZuRohstoffe: IBauteileZuRohstoffe = { id: 456 };
        const rohstoff: IRohstoff = { id: 71430 };
        bauteileZuRohstoffe.rohstoff = rohstoff;

        const rohstoffCollection: IRohstoff[] = [{ id: 70874 }];
        jest.spyOn(rohstoffService, 'query').mockReturnValue(of(new HttpResponse({ body: rohstoffCollection })));
        const additionalRohstoffs = [rohstoff];
        const expectedCollection: IRohstoff[] = [...additionalRohstoffs, ...rohstoffCollection];
        jest.spyOn(rohstoffService, 'addRohstoffToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ bauteileZuRohstoffe });
        comp.ngOnInit();

        expect(rohstoffService.query).toHaveBeenCalled();
        expect(rohstoffService.addRohstoffToCollectionIfMissing).toHaveBeenCalledWith(rohstoffCollection, ...additionalRohstoffs);
        expect(comp.rohstoffsSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const bauteileZuRohstoffe: IBauteileZuRohstoffe = { id: 456 };
        const bauteil: IBauteil = { id: 31852 };
        bauteileZuRohstoffe.bauteil = bauteil;
        const rohstoff: IRohstoff = { id: 88140 };
        bauteileZuRohstoffe.rohstoff = rohstoff;

        activatedRoute.data = of({ bauteileZuRohstoffe });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(bauteileZuRohstoffe));
        expect(comp.bauteilsSharedCollection).toContain(bauteil);
        expect(comp.rohstoffsSharedCollection).toContain(rohstoff);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<BauteileZuRohstoffe>>();
        const bauteileZuRohstoffe = { id: 123 };
        jest.spyOn(bauteileZuRohstoffeService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ bauteileZuRohstoffe });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: bauteileZuRohstoffe }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(bauteileZuRohstoffeService.update).toHaveBeenCalledWith(bauteileZuRohstoffe);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<BauteileZuRohstoffe>>();
        const bauteileZuRohstoffe = new BauteileZuRohstoffe();
        jest.spyOn(bauteileZuRohstoffeService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ bauteileZuRohstoffe });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: bauteileZuRohstoffe }));
        saveSubject.complete();

        // THEN
        expect(bauteileZuRohstoffeService.create).toHaveBeenCalledWith(bauteileZuRohstoffe);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<BauteileZuRohstoffe>>();
        const bauteileZuRohstoffe = { id: 123 };
        jest.spyOn(bauteileZuRohstoffeService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ bauteileZuRohstoffe });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(bauteileZuRohstoffeService.update).toHaveBeenCalledWith(bauteileZuRohstoffe);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackBauteilById', () => {
        it('Should return tracked Bauteil primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackBauteilById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });

      describe('trackRohstoffById', () => {
        it('Should return tracked Rohstoff primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackRohstoffById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});

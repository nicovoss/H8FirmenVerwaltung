jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { BedienerService } from '../service/bediener.service';
import { IBediener, Bediener } from '../bediener.model';

import { BedienerUpdateComponent } from './bediener-update.component';

describe('Component Tests', () => {
  describe('Bediener Management Update Component', () => {
    let comp: BedienerUpdateComponent;
    let fixture: ComponentFixture<BedienerUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let bedienerService: BedienerService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [BedienerUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(BedienerUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(BedienerUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      bedienerService = TestBed.inject(BedienerService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should update editForm', () => {
        const bediener: IBediener = { id: 456 };

        activatedRoute.data = of({ bediener });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(bediener));
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Bediener>>();
        const bediener = { id: 123 };
        jest.spyOn(bedienerService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ bediener });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: bediener }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(bedienerService.update).toHaveBeenCalledWith(bediener);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Bediener>>();
        const bediener = new Bediener();
        jest.spyOn(bedienerService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ bediener });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: bediener }));
        saveSubject.complete();

        // THEN
        expect(bedienerService.create).toHaveBeenCalledWith(bediener);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Bediener>>();
        const bediener = { id: 123 };
        jest.spyOn(bedienerService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ bediener });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(bedienerService.update).toHaveBeenCalledWith(bediener);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });
  });
});

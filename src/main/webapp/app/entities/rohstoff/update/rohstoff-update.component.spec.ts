jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { RohstoffService } from '../service/rohstoff.service';
import { IRohstoff, Rohstoff } from '../rohstoff.model';

import { RohstoffUpdateComponent } from './rohstoff-update.component';

describe('Component Tests', () => {
  describe('Rohstoff Management Update Component', () => {
    let comp: RohstoffUpdateComponent;
    let fixture: ComponentFixture<RohstoffUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let rohstoffService: RohstoffService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [RohstoffUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(RohstoffUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(RohstoffUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      rohstoffService = TestBed.inject(RohstoffService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should update editForm', () => {
        const rohstoff: IRohstoff = { id: 456 };

        activatedRoute.data = of({ rohstoff });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(rohstoff));
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Rohstoff>>();
        const rohstoff = { id: 123 };
        jest.spyOn(rohstoffService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ rohstoff });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: rohstoff }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(rohstoffService.update).toHaveBeenCalledWith(rohstoff);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Rohstoff>>();
        const rohstoff = new Rohstoff();
        jest.spyOn(rohstoffService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ rohstoff });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: rohstoff }));
        saveSubject.complete();

        // THEN
        expect(rohstoffService.create).toHaveBeenCalledWith(rohstoff);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Rohstoff>>();
        const rohstoff = { id: 123 };
        jest.spyOn(rohstoffService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ rohstoff });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(rohstoffService.update).toHaveBeenCalledWith(rohstoff);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });
  });
});

jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { ArtikelTypService } from '../service/artikel-typ.service';
import { IArtikelTyp, ArtikelTyp } from '../artikel-typ.model';

import { ArtikelTypUpdateComponent } from './artikel-typ-update.component';

describe('Component Tests', () => {
  describe('ArtikelTyp Management Update Component', () => {
    let comp: ArtikelTypUpdateComponent;
    let fixture: ComponentFixture<ArtikelTypUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let artikelTypService: ArtikelTypService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [ArtikelTypUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(ArtikelTypUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ArtikelTypUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      artikelTypService = TestBed.inject(ArtikelTypService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should update editForm', () => {
        const artikelTyp: IArtikelTyp = { id: 456 };

        activatedRoute.data = of({ artikelTyp });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(artikelTyp));
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<ArtikelTyp>>();
        const artikelTyp = { id: 123 };
        jest.spyOn(artikelTypService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ artikelTyp });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: artikelTyp }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(artikelTypService.update).toHaveBeenCalledWith(artikelTyp);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<ArtikelTyp>>();
        const artikelTyp = new ArtikelTyp();
        jest.spyOn(artikelTypService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ artikelTyp });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: artikelTyp }));
        saveSubject.complete();

        // THEN
        expect(artikelTypService.create).toHaveBeenCalledWith(artikelTyp);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<ArtikelTyp>>();
        const artikelTyp = { id: 123 };
        jest.spyOn(artikelTypService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ artikelTyp });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(artikelTypService.update).toHaveBeenCalledWith(artikelTyp);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });
  });
});

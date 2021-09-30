jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { BauteilService } from '../service/bauteil.service';
import { IBauteil, Bauteil } from '../bauteil.model';
import { IBauteilGruppe } from 'app/entities/bauteil-gruppe/bauteil-gruppe.model';
import { BauteilGruppeService } from 'app/entities/bauteil-gruppe/service/bauteil-gruppe.service';

import { BauteilUpdateComponent } from './bauteil-update.component';

describe('Component Tests', () => {
  describe('Bauteil Management Update Component', () => {
    let comp: BauteilUpdateComponent;
    let fixture: ComponentFixture<BauteilUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let bauteilService: BauteilService;
    let bauteilGruppeService: BauteilGruppeService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [BauteilUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(BauteilUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(BauteilUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      bauteilService = TestBed.inject(BauteilService);
      bauteilGruppeService = TestBed.inject(BauteilGruppeService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call BauteilGruppe query and add missing value', () => {
        const bauteil: IBauteil = { id: 456 };
        const bauteilgruppe: IBauteilGruppe = { id: 14690 };
        bauteil.bauteilgruppe = bauteilgruppe;

        const bauteilGruppeCollection: IBauteilGruppe[] = [{ id: 96420 }];
        jest.spyOn(bauteilGruppeService, 'query').mockReturnValue(of(new HttpResponse({ body: bauteilGruppeCollection })));
        const additionalBauteilGruppes = [bauteilgruppe];
        const expectedCollection: IBauteilGruppe[] = [...additionalBauteilGruppes, ...bauteilGruppeCollection];
        jest.spyOn(bauteilGruppeService, 'addBauteilGruppeToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ bauteil });
        comp.ngOnInit();

        expect(bauteilGruppeService.query).toHaveBeenCalled();
        expect(bauteilGruppeService.addBauteilGruppeToCollectionIfMissing).toHaveBeenCalledWith(
          bauteilGruppeCollection,
          ...additionalBauteilGruppes
        );
        expect(comp.bauteilGruppesSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const bauteil: IBauteil = { id: 456 };
        const bauteilgruppe: IBauteilGruppe = { id: 65113 };
        bauteil.bauteilgruppe = bauteilgruppe;

        activatedRoute.data = of({ bauteil });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(bauteil));
        expect(comp.bauteilGruppesSharedCollection).toContain(bauteilgruppe);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Bauteil>>();
        const bauteil = { id: 123 };
        jest.spyOn(bauteilService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ bauteil });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: bauteil }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(bauteilService.update).toHaveBeenCalledWith(bauteil);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Bauteil>>();
        const bauteil = new Bauteil();
        jest.spyOn(bauteilService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ bauteil });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: bauteil }));
        saveSubject.complete();

        // THEN
        expect(bauteilService.create).toHaveBeenCalledWith(bauteil);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Bauteil>>();
        const bauteil = { id: 123 };
        jest.spyOn(bauteilService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ bauteil });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(bauteilService.update).toHaveBeenCalledWith(bauteil);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackBauteilGruppeById', () => {
        it('Should return tracked BauteilGruppe primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackBauteilGruppeById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});

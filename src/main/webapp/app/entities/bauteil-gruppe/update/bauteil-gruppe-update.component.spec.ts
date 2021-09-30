jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { BauteilGruppeService } from '../service/bauteil-gruppe.service';
import { IBauteilGruppe, BauteilGruppe } from '../bauteil-gruppe.model';
import { IArtikelTyp } from 'app/entities/artikel-typ/artikel-typ.model';
import { ArtikelTypService } from 'app/entities/artikel-typ/service/artikel-typ.service';

import { BauteilGruppeUpdateComponent } from './bauteil-gruppe-update.component';

describe('Component Tests', () => {
  describe('BauteilGruppe Management Update Component', () => {
    let comp: BauteilGruppeUpdateComponent;
    let fixture: ComponentFixture<BauteilGruppeUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let bauteilGruppeService: BauteilGruppeService;
    let artikelTypService: ArtikelTypService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [BauteilGruppeUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(BauteilGruppeUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(BauteilGruppeUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      bauteilGruppeService = TestBed.inject(BauteilGruppeService);
      artikelTypService = TestBed.inject(ArtikelTypService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call ArtikelTyp query and add missing value', () => {
        const bauteilGruppe: IBauteilGruppe = { id: 456 };
        const artikelTyp: IArtikelTyp = { id: 10718 };
        bauteilGruppe.artikelTyp = artikelTyp;

        const artikelTypCollection: IArtikelTyp[] = [{ id: 41098 }];
        jest.spyOn(artikelTypService, 'query').mockReturnValue(of(new HttpResponse({ body: artikelTypCollection })));
        const additionalArtikelTyps = [artikelTyp];
        const expectedCollection: IArtikelTyp[] = [...additionalArtikelTyps, ...artikelTypCollection];
        jest.spyOn(artikelTypService, 'addArtikelTypToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ bauteilGruppe });
        comp.ngOnInit();

        expect(artikelTypService.query).toHaveBeenCalled();
        expect(artikelTypService.addArtikelTypToCollectionIfMissing).toHaveBeenCalledWith(artikelTypCollection, ...additionalArtikelTyps);
        expect(comp.artikelTypsSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const bauteilGruppe: IBauteilGruppe = { id: 456 };
        const artikelTyp: IArtikelTyp = { id: 89469 };
        bauteilGruppe.artikelTyp = artikelTyp;

        activatedRoute.data = of({ bauteilGruppe });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(bauteilGruppe));
        expect(comp.artikelTypsSharedCollection).toContain(artikelTyp);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<BauteilGruppe>>();
        const bauteilGruppe = { id: 123 };
        jest.spyOn(bauteilGruppeService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ bauteilGruppe });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: bauteilGruppe }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(bauteilGruppeService.update).toHaveBeenCalledWith(bauteilGruppe);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<BauteilGruppe>>();
        const bauteilGruppe = new BauteilGruppe();
        jest.spyOn(bauteilGruppeService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ bauteilGruppe });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: bauteilGruppe }));
        saveSubject.complete();

        // THEN
        expect(bauteilGruppeService.create).toHaveBeenCalledWith(bauteilGruppe);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<BauteilGruppe>>();
        const bauteilGruppe = { id: 123 };
        jest.spyOn(bauteilGruppeService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ bauteilGruppe });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(bauteilGruppeService.update).toHaveBeenCalledWith(bauteilGruppe);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackArtikelTypById', () => {
        it('Should return tracked ArtikelTyp primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackArtikelTypById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});

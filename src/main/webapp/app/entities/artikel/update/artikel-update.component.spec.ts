jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { ArtikelService } from '../service/artikel.service';
import { IArtikel, Artikel } from '../artikel.model';
import { IArtikelTyp } from 'app/entities/artikel-typ/artikel-typ.model';
import { ArtikelTypService } from 'app/entities/artikel-typ/service/artikel-typ.service';

import { ArtikelUpdateComponent } from './artikel-update.component';

describe('Component Tests', () => {
  describe('Artikel Management Update Component', () => {
    let comp: ArtikelUpdateComponent;
    let fixture: ComponentFixture<ArtikelUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let artikelService: ArtikelService;
    let artikelTypService: ArtikelTypService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [ArtikelUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(ArtikelUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ArtikelUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      artikelService = TestBed.inject(ArtikelService);
      artikelTypService = TestBed.inject(ArtikelTypService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call ArtikelTyp query and add missing value', () => {
        const artikel: IArtikel = { id: 456 };
        const artikelTyp: IArtikelTyp = { id: 39756 };
        artikel.artikelTyp = artikelTyp;

        const artikelTypCollection: IArtikelTyp[] = [{ id: 21195 }];
        jest.spyOn(artikelTypService, 'query').mockReturnValue(of(new HttpResponse({ body: artikelTypCollection })));
        const additionalArtikelTyps = [artikelTyp];
        const expectedCollection: IArtikelTyp[] = [...additionalArtikelTyps, ...artikelTypCollection];
        jest.spyOn(artikelTypService, 'addArtikelTypToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ artikel });
        comp.ngOnInit();

        expect(artikelTypService.query).toHaveBeenCalled();
        expect(artikelTypService.addArtikelTypToCollectionIfMissing).toHaveBeenCalledWith(artikelTypCollection, ...additionalArtikelTyps);
        expect(comp.artikelTypsSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const artikel: IArtikel = { id: 456 };
        const artikelTyp: IArtikelTyp = { id: 13086 };
        artikel.artikelTyp = artikelTyp;

        activatedRoute.data = of({ artikel });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(artikel));
        expect(comp.artikelTypsSharedCollection).toContain(artikelTyp);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Artikel>>();
        const artikel = { id: 123 };
        jest.spyOn(artikelService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ artikel });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: artikel }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(artikelService.update).toHaveBeenCalledWith(artikel);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Artikel>>();
        const artikel = new Artikel();
        jest.spyOn(artikelService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ artikel });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: artikel }));
        saveSubject.complete();

        // THEN
        expect(artikelService.create).toHaveBeenCalledWith(artikel);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Artikel>>();
        const artikel = { id: 123 };
        jest.spyOn(artikelService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ artikel });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(artikelService.update).toHaveBeenCalledWith(artikel);
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

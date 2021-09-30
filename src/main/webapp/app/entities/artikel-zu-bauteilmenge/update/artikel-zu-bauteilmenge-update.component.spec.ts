jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { ArtikelZuBauteilmengeService } from '../service/artikel-zu-bauteilmenge.service';
import { IArtikelZuBauteilmenge, ArtikelZuBauteilmenge } from '../artikel-zu-bauteilmenge.model';
import { IBauteil } from 'app/entities/bauteil/bauteil.model';
import { BauteilService } from 'app/entities/bauteil/service/bauteil.service';
import { IArtikel } from 'app/entities/artikel/artikel.model';
import { ArtikelService } from 'app/entities/artikel/service/artikel.service';

import { ArtikelZuBauteilmengeUpdateComponent } from './artikel-zu-bauteilmenge-update.component';

describe('Component Tests', () => {
  describe('ArtikelZuBauteilmenge Management Update Component', () => {
    let comp: ArtikelZuBauteilmengeUpdateComponent;
    let fixture: ComponentFixture<ArtikelZuBauteilmengeUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let artikelZuBauteilmengeService: ArtikelZuBauteilmengeService;
    let bauteilService: BauteilService;
    let artikelService: ArtikelService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [ArtikelZuBauteilmengeUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(ArtikelZuBauteilmengeUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ArtikelZuBauteilmengeUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      artikelZuBauteilmengeService = TestBed.inject(ArtikelZuBauteilmengeService);
      bauteilService = TestBed.inject(BauteilService);
      artikelService = TestBed.inject(ArtikelService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Bauteil query and add missing value', () => {
        const artikelZuBauteilmenge: IArtikelZuBauteilmenge = { id: 456 };
        const bauteil: IBauteil = { id: 25368 };
        artikelZuBauteilmenge.bauteil = bauteil;

        const bauteilCollection: IBauteil[] = [{ id: 97633 }];
        jest.spyOn(bauteilService, 'query').mockReturnValue(of(new HttpResponse({ body: bauteilCollection })));
        const additionalBauteils = [bauteil];
        const expectedCollection: IBauteil[] = [...additionalBauteils, ...bauteilCollection];
        jest.spyOn(bauteilService, 'addBauteilToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ artikelZuBauteilmenge });
        comp.ngOnInit();

        expect(bauteilService.query).toHaveBeenCalled();
        expect(bauteilService.addBauteilToCollectionIfMissing).toHaveBeenCalledWith(bauteilCollection, ...additionalBauteils);
        expect(comp.bauteilsSharedCollection).toEqual(expectedCollection);
      });

      it('Should call Artikel query and add missing value', () => {
        const artikelZuBauteilmenge: IArtikelZuBauteilmenge = { id: 456 };
        const artikel: IArtikel = { id: 82393 };
        artikelZuBauteilmenge.artikel = artikel;

        const artikelCollection: IArtikel[] = [{ id: 54332 }];
        jest.spyOn(artikelService, 'query').mockReturnValue(of(new HttpResponse({ body: artikelCollection })));
        const additionalArtikels = [artikel];
        const expectedCollection: IArtikel[] = [...additionalArtikels, ...artikelCollection];
        jest.spyOn(artikelService, 'addArtikelToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ artikelZuBauteilmenge });
        comp.ngOnInit();

        expect(artikelService.query).toHaveBeenCalled();
        expect(artikelService.addArtikelToCollectionIfMissing).toHaveBeenCalledWith(artikelCollection, ...additionalArtikels);
        expect(comp.artikelsSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const artikelZuBauteilmenge: IArtikelZuBauteilmenge = { id: 456 };
        const bauteil: IBauteil = { id: 2894 };
        artikelZuBauteilmenge.bauteil = bauteil;
        const artikel: IArtikel = { id: 85212 };
        artikelZuBauteilmenge.artikel = artikel;

        activatedRoute.data = of({ artikelZuBauteilmenge });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(artikelZuBauteilmenge));
        expect(comp.bauteilsSharedCollection).toContain(bauteil);
        expect(comp.artikelsSharedCollection).toContain(artikel);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<ArtikelZuBauteilmenge>>();
        const artikelZuBauteilmenge = { id: 123 };
        jest.spyOn(artikelZuBauteilmengeService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ artikelZuBauteilmenge });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: artikelZuBauteilmenge }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(artikelZuBauteilmengeService.update).toHaveBeenCalledWith(artikelZuBauteilmenge);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<ArtikelZuBauteilmenge>>();
        const artikelZuBauteilmenge = new ArtikelZuBauteilmenge();
        jest.spyOn(artikelZuBauteilmengeService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ artikelZuBauteilmenge });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: artikelZuBauteilmenge }));
        saveSubject.complete();

        // THEN
        expect(artikelZuBauteilmengeService.create).toHaveBeenCalledWith(artikelZuBauteilmenge);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<ArtikelZuBauteilmenge>>();
        const artikelZuBauteilmenge = { id: 123 };
        jest.spyOn(artikelZuBauteilmengeService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ artikelZuBauteilmenge });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(artikelZuBauteilmengeService.update).toHaveBeenCalledWith(artikelZuBauteilmenge);
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

      describe('trackArtikelById', () => {
        it('Should return tracked Artikel primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackArtikelById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});

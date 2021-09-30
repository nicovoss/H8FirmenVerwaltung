jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { RechnungPositionenService } from '../service/rechnung-positionen.service';
import { IRechnungPositionen, RechnungPositionen } from '../rechnung-positionen.model';
import { IRechnungKopf } from 'app/entities/rechnung-kopf/rechnung-kopf.model';
import { RechnungKopfService } from 'app/entities/rechnung-kopf/service/rechnung-kopf.service';
import { IArtikel } from 'app/entities/artikel/artikel.model';
import { ArtikelService } from 'app/entities/artikel/service/artikel.service';

import { RechnungPositionenUpdateComponent } from './rechnung-positionen-update.component';

describe('Component Tests', () => {
  describe('RechnungPositionen Management Update Component', () => {
    let comp: RechnungPositionenUpdateComponent;
    let fixture: ComponentFixture<RechnungPositionenUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let rechnungPositionenService: RechnungPositionenService;
    let rechnungKopfService: RechnungKopfService;
    let artikelService: ArtikelService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [RechnungPositionenUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(RechnungPositionenUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(RechnungPositionenUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      rechnungPositionenService = TestBed.inject(RechnungPositionenService);
      rechnungKopfService = TestBed.inject(RechnungKopfService);
      artikelService = TestBed.inject(ArtikelService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call RechnungKopf query and add missing value', () => {
        const rechnungPositionen: IRechnungPositionen = { id: 456 };
        const rechnungskopf: IRechnungKopf = { id: 43769 };
        rechnungPositionen.rechnungskopf = rechnungskopf;

        const rechnungKopfCollection: IRechnungKopf[] = [{ id: 43967 }];
        jest.spyOn(rechnungKopfService, 'query').mockReturnValue(of(new HttpResponse({ body: rechnungKopfCollection })));
        const additionalRechnungKopfs = [rechnungskopf];
        const expectedCollection: IRechnungKopf[] = [...additionalRechnungKopfs, ...rechnungKopfCollection];
        jest.spyOn(rechnungKopfService, 'addRechnungKopfToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ rechnungPositionen });
        comp.ngOnInit();

        expect(rechnungKopfService.query).toHaveBeenCalled();
        expect(rechnungKopfService.addRechnungKopfToCollectionIfMissing).toHaveBeenCalledWith(
          rechnungKopfCollection,
          ...additionalRechnungKopfs
        );
        expect(comp.rechnungKopfsSharedCollection).toEqual(expectedCollection);
      });

      it('Should call Artikel query and add missing value', () => {
        const rechnungPositionen: IRechnungPositionen = { id: 456 };
        const artikel: IArtikel = { id: 35098 };
        rechnungPositionen.artikel = artikel;

        const artikelCollection: IArtikel[] = [{ id: 19080 }];
        jest.spyOn(artikelService, 'query').mockReturnValue(of(new HttpResponse({ body: artikelCollection })));
        const additionalArtikels = [artikel];
        const expectedCollection: IArtikel[] = [...additionalArtikels, ...artikelCollection];
        jest.spyOn(artikelService, 'addArtikelToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ rechnungPositionen });
        comp.ngOnInit();

        expect(artikelService.query).toHaveBeenCalled();
        expect(artikelService.addArtikelToCollectionIfMissing).toHaveBeenCalledWith(artikelCollection, ...additionalArtikels);
        expect(comp.artikelsSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const rechnungPositionen: IRechnungPositionen = { id: 456 };
        const rechnungskopf: IRechnungKopf = { id: 42456 };
        rechnungPositionen.rechnungskopf = rechnungskopf;
        const artikel: IArtikel = { id: 38757 };
        rechnungPositionen.artikel = artikel;

        activatedRoute.data = of({ rechnungPositionen });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(rechnungPositionen));
        expect(comp.rechnungKopfsSharedCollection).toContain(rechnungskopf);
        expect(comp.artikelsSharedCollection).toContain(artikel);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<RechnungPositionen>>();
        const rechnungPositionen = { id: 123 };
        jest.spyOn(rechnungPositionenService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ rechnungPositionen });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: rechnungPositionen }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(rechnungPositionenService.update).toHaveBeenCalledWith(rechnungPositionen);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<RechnungPositionen>>();
        const rechnungPositionen = new RechnungPositionen();
        jest.spyOn(rechnungPositionenService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ rechnungPositionen });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: rechnungPositionen }));
        saveSubject.complete();

        // THEN
        expect(rechnungPositionenService.create).toHaveBeenCalledWith(rechnungPositionen);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<RechnungPositionen>>();
        const rechnungPositionen = { id: 123 };
        jest.spyOn(rechnungPositionenService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ rechnungPositionen });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(rechnungPositionenService.update).toHaveBeenCalledWith(rechnungPositionen);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackRechnungKopfById', () => {
        it('Should return tracked RechnungKopf primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackRechnungKopfById(0, entity);
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

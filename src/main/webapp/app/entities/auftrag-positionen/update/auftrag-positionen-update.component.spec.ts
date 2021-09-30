jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { AuftragPositionenService } from '../service/auftrag-positionen.service';
import { IAuftragPositionen, AuftragPositionen } from '../auftrag-positionen.model';
import { IAuftrag } from 'app/entities/auftrag/auftrag.model';
import { AuftragService } from 'app/entities/auftrag/service/auftrag.service';
import { IArtikel } from 'app/entities/artikel/artikel.model';
import { ArtikelService } from 'app/entities/artikel/service/artikel.service';

import { AuftragPositionenUpdateComponent } from './auftrag-positionen-update.component';

describe('Component Tests', () => {
  describe('AuftragPositionen Management Update Component', () => {
    let comp: AuftragPositionenUpdateComponent;
    let fixture: ComponentFixture<AuftragPositionenUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let auftragPositionenService: AuftragPositionenService;
    let auftragService: AuftragService;
    let artikelService: ArtikelService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [AuftragPositionenUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(AuftragPositionenUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(AuftragPositionenUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      auftragPositionenService = TestBed.inject(AuftragPositionenService);
      auftragService = TestBed.inject(AuftragService);
      artikelService = TestBed.inject(ArtikelService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Auftrag query and add missing value', () => {
        const auftragPositionen: IAuftragPositionen = { id: 456 };
        const auftrag: IAuftrag = { id: 3966 };
        auftragPositionen.auftrag = auftrag;

        const auftragCollection: IAuftrag[] = [{ id: 93494 }];
        jest.spyOn(auftragService, 'query').mockReturnValue(of(new HttpResponse({ body: auftragCollection })));
        const additionalAuftrags = [auftrag];
        const expectedCollection: IAuftrag[] = [...additionalAuftrags, ...auftragCollection];
        jest.spyOn(auftragService, 'addAuftragToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ auftragPositionen });
        comp.ngOnInit();

        expect(auftragService.query).toHaveBeenCalled();
        expect(auftragService.addAuftragToCollectionIfMissing).toHaveBeenCalledWith(auftragCollection, ...additionalAuftrags);
        expect(comp.auftragsSharedCollection).toEqual(expectedCollection);
      });

      it('Should call Artikel query and add missing value', () => {
        const auftragPositionen: IAuftragPositionen = { id: 456 };
        const artikel: IArtikel = { id: 24612 };
        auftragPositionen.artikel = artikel;

        const artikelCollection: IArtikel[] = [{ id: 7571 }];
        jest.spyOn(artikelService, 'query').mockReturnValue(of(new HttpResponse({ body: artikelCollection })));
        const additionalArtikels = [artikel];
        const expectedCollection: IArtikel[] = [...additionalArtikels, ...artikelCollection];
        jest.spyOn(artikelService, 'addArtikelToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ auftragPositionen });
        comp.ngOnInit();

        expect(artikelService.query).toHaveBeenCalled();
        expect(artikelService.addArtikelToCollectionIfMissing).toHaveBeenCalledWith(artikelCollection, ...additionalArtikels);
        expect(comp.artikelsSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const auftragPositionen: IAuftragPositionen = { id: 456 };
        const auftrag: IAuftrag = { id: 30301 };
        auftragPositionen.auftrag = auftrag;
        const artikel: IArtikel = { id: 90600 };
        auftragPositionen.artikel = artikel;

        activatedRoute.data = of({ auftragPositionen });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(auftragPositionen));
        expect(comp.auftragsSharedCollection).toContain(auftrag);
        expect(comp.artikelsSharedCollection).toContain(artikel);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<AuftragPositionen>>();
        const auftragPositionen = { id: 123 };
        jest.spyOn(auftragPositionenService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ auftragPositionen });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: auftragPositionen }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(auftragPositionenService.update).toHaveBeenCalledWith(auftragPositionen);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<AuftragPositionen>>();
        const auftragPositionen = new AuftragPositionen();
        jest.spyOn(auftragPositionenService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ auftragPositionen });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: auftragPositionen }));
        saveSubject.complete();

        // THEN
        expect(auftragPositionenService.create).toHaveBeenCalledWith(auftragPositionen);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<AuftragPositionen>>();
        const auftragPositionen = { id: 123 };
        jest.spyOn(auftragPositionenService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ auftragPositionen });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(auftragPositionenService.update).toHaveBeenCalledWith(auftragPositionen);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackAuftragById', () => {
        it('Should return tracked Auftrag primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackAuftragById(0, entity);
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

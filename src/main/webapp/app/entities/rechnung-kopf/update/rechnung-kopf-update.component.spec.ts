jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { RechnungKopfService } from '../service/rechnung-kopf.service';
import { IRechnungKopf, RechnungKopf } from '../rechnung-kopf.model';
import { IAuftrag } from 'app/entities/auftrag/auftrag.model';
import { AuftragService } from 'app/entities/auftrag/service/auftrag.service';
import { IBediener } from 'app/entities/bediener/bediener.model';
import { BedienerService } from 'app/entities/bediener/service/bediener.service';
import { IPatner } from 'app/entities/patner/patner.model';
import { PatnerService } from 'app/entities/patner/service/patner.service';
import { IStatus } from 'app/entities/status/status.model';
import { StatusService } from 'app/entities/status/service/status.service';

import { RechnungKopfUpdateComponent } from './rechnung-kopf-update.component';

describe('Component Tests', () => {
  describe('RechnungKopf Management Update Component', () => {
    let comp: RechnungKopfUpdateComponent;
    let fixture: ComponentFixture<RechnungKopfUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let rechnungKopfService: RechnungKopfService;
    let auftragService: AuftragService;
    let bedienerService: BedienerService;
    let patnerService: PatnerService;
    let statusService: StatusService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [RechnungKopfUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(RechnungKopfUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(RechnungKopfUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      rechnungKopfService = TestBed.inject(RechnungKopfService);
      auftragService = TestBed.inject(AuftragService);
      bedienerService = TestBed.inject(BedienerService);
      patnerService = TestBed.inject(PatnerService);
      statusService = TestBed.inject(StatusService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Auftrag query and add missing value', () => {
        const rechnungKopf: IRechnungKopf = { id: 456 };
        const auftrag: IAuftrag = { id: 59719 };
        rechnungKopf.auftrag = auftrag;

        const auftragCollection: IAuftrag[] = [{ id: 48233 }];
        jest.spyOn(auftragService, 'query').mockReturnValue(of(new HttpResponse({ body: auftragCollection })));
        const additionalAuftrags = [auftrag];
        const expectedCollection: IAuftrag[] = [...additionalAuftrags, ...auftragCollection];
        jest.spyOn(auftragService, 'addAuftragToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ rechnungKopf });
        comp.ngOnInit();

        expect(auftragService.query).toHaveBeenCalled();
        expect(auftragService.addAuftragToCollectionIfMissing).toHaveBeenCalledWith(auftragCollection, ...additionalAuftrags);
        expect(comp.auftragsSharedCollection).toEqual(expectedCollection);
      });

      it('Should call Bediener query and add missing value', () => {
        const rechnungKopf: IRechnungKopf = { id: 456 };
        const bediner: IBediener = { id: 98013 };
        rechnungKopf.bediner = bediner;

        const bedienerCollection: IBediener[] = [{ id: 59383 }];
        jest.spyOn(bedienerService, 'query').mockReturnValue(of(new HttpResponse({ body: bedienerCollection })));
        const additionalBedieners = [bediner];
        const expectedCollection: IBediener[] = [...additionalBedieners, ...bedienerCollection];
        jest.spyOn(bedienerService, 'addBedienerToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ rechnungKopf });
        comp.ngOnInit();

        expect(bedienerService.query).toHaveBeenCalled();
        expect(bedienerService.addBedienerToCollectionIfMissing).toHaveBeenCalledWith(bedienerCollection, ...additionalBedieners);
        expect(comp.bedienersSharedCollection).toEqual(expectedCollection);
      });

      it('Should call Patner query and add missing value', () => {
        const rechnungKopf: IRechnungKopf = { id: 456 };
        const kunde: IPatner = { id: 51099 };
        rechnungKopf.kunde = kunde;

        const patnerCollection: IPatner[] = [{ id: 11447 }];
        jest.spyOn(patnerService, 'query').mockReturnValue(of(new HttpResponse({ body: patnerCollection })));
        const additionalPatners = [kunde];
        const expectedCollection: IPatner[] = [...additionalPatners, ...patnerCollection];
        jest.spyOn(patnerService, 'addPatnerToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ rechnungKopf });
        comp.ngOnInit();

        expect(patnerService.query).toHaveBeenCalled();
        expect(patnerService.addPatnerToCollectionIfMissing).toHaveBeenCalledWith(patnerCollection, ...additionalPatners);
        expect(comp.patnersSharedCollection).toEqual(expectedCollection);
      });

      it('Should call Status query and add missing value', () => {
        const rechnungKopf: IRechnungKopf = { id: 456 };
        const status: IStatus = { id: 43037 };
        rechnungKopf.status = status;

        const statusCollection: IStatus[] = [{ id: 1423 }];
        jest.spyOn(statusService, 'query').mockReturnValue(of(new HttpResponse({ body: statusCollection })));
        const additionalStatuses = [status];
        const expectedCollection: IStatus[] = [...additionalStatuses, ...statusCollection];
        jest.spyOn(statusService, 'addStatusToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ rechnungKopf });
        comp.ngOnInit();

        expect(statusService.query).toHaveBeenCalled();
        expect(statusService.addStatusToCollectionIfMissing).toHaveBeenCalledWith(statusCollection, ...additionalStatuses);
        expect(comp.statusesSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const rechnungKopf: IRechnungKopf = { id: 456 };
        const auftrag: IAuftrag = { id: 75658 };
        rechnungKopf.auftrag = auftrag;
        const bediner: IBediener = { id: 59670 };
        rechnungKopf.bediner = bediner;
        const kunde: IPatner = { id: 78027 };
        rechnungKopf.kunde = kunde;
        const status: IStatus = { id: 12788 };
        rechnungKopf.status = status;

        activatedRoute.data = of({ rechnungKopf });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(rechnungKopf));
        expect(comp.auftragsSharedCollection).toContain(auftrag);
        expect(comp.bedienersSharedCollection).toContain(bediner);
        expect(comp.patnersSharedCollection).toContain(kunde);
        expect(comp.statusesSharedCollection).toContain(status);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<RechnungKopf>>();
        const rechnungKopf = { id: 123 };
        jest.spyOn(rechnungKopfService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ rechnungKopf });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: rechnungKopf }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(rechnungKopfService.update).toHaveBeenCalledWith(rechnungKopf);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<RechnungKopf>>();
        const rechnungKopf = new RechnungKopf();
        jest.spyOn(rechnungKopfService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ rechnungKopf });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: rechnungKopf }));
        saveSubject.complete();

        // THEN
        expect(rechnungKopfService.create).toHaveBeenCalledWith(rechnungKopf);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<RechnungKopf>>();
        const rechnungKopf = { id: 123 };
        jest.spyOn(rechnungKopfService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ rechnungKopf });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(rechnungKopfService.update).toHaveBeenCalledWith(rechnungKopf);
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

      describe('trackBedienerById', () => {
        it('Should return tracked Bediener primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackBedienerById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });

      describe('trackPatnerById', () => {
        it('Should return tracked Patner primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackPatnerById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });

      describe('trackStatusById', () => {
        it('Should return tracked Status primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackStatusById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});

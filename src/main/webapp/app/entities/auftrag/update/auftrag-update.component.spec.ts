jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { AuftragService } from '../service/auftrag.service';
import { IAuftrag, Auftrag } from '../auftrag.model';
import { IStatus } from 'app/entities/status/status.model';
import { StatusService } from 'app/entities/status/service/status.service';
import { IPatner } from 'app/entities/patner/patner.model';
import { PatnerService } from 'app/entities/patner/service/patner.service';
import { IBediener } from 'app/entities/bediener/bediener.model';
import { BedienerService } from 'app/entities/bediener/service/bediener.service';

import { AuftragUpdateComponent } from './auftrag-update.component';

describe('Component Tests', () => {
  describe('Auftrag Management Update Component', () => {
    let comp: AuftragUpdateComponent;
    let fixture: ComponentFixture<AuftragUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let auftragService: AuftragService;
    let statusService: StatusService;
    let patnerService: PatnerService;
    let bedienerService: BedienerService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [AuftragUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(AuftragUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(AuftragUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      auftragService = TestBed.inject(AuftragService);
      statusService = TestBed.inject(StatusService);
      patnerService = TestBed.inject(PatnerService);
      bedienerService = TestBed.inject(BedienerService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Status query and add missing value', () => {
        const auftrag: IAuftrag = { id: 456 };
        const status: IStatus = { id: 92207 };
        auftrag.status = status;

        const statusCollection: IStatus[] = [{ id: 74454 }];
        jest.spyOn(statusService, 'query').mockReturnValue(of(new HttpResponse({ body: statusCollection })));
        const additionalStatuses = [status];
        const expectedCollection: IStatus[] = [...additionalStatuses, ...statusCollection];
        jest.spyOn(statusService, 'addStatusToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ auftrag });
        comp.ngOnInit();

        expect(statusService.query).toHaveBeenCalled();
        expect(statusService.addStatusToCollectionIfMissing).toHaveBeenCalledWith(statusCollection, ...additionalStatuses);
        expect(comp.statusesSharedCollection).toEqual(expectedCollection);
      });

      it('Should call Patner query and add missing value', () => {
        const auftrag: IAuftrag = { id: 456 };
        const kunde: IPatner = { id: 75476 };
        auftrag.kunde = kunde;

        const patnerCollection: IPatner[] = [{ id: 84579 }];
        jest.spyOn(patnerService, 'query').mockReturnValue(of(new HttpResponse({ body: patnerCollection })));
        const additionalPatners = [kunde];
        const expectedCollection: IPatner[] = [...additionalPatners, ...patnerCollection];
        jest.spyOn(patnerService, 'addPatnerToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ auftrag });
        comp.ngOnInit();

        expect(patnerService.query).toHaveBeenCalled();
        expect(patnerService.addPatnerToCollectionIfMissing).toHaveBeenCalledWith(patnerCollection, ...additionalPatners);
        expect(comp.patnersSharedCollection).toEqual(expectedCollection);
      });

      it('Should call Bediener query and add missing value', () => {
        const auftrag: IAuftrag = { id: 456 };
        const bediener: IBediener = { id: 62425 };
        auftrag.bediener = bediener;

        const bedienerCollection: IBediener[] = [{ id: 16305 }];
        jest.spyOn(bedienerService, 'query').mockReturnValue(of(new HttpResponse({ body: bedienerCollection })));
        const additionalBedieners = [bediener];
        const expectedCollection: IBediener[] = [...additionalBedieners, ...bedienerCollection];
        jest.spyOn(bedienerService, 'addBedienerToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ auftrag });
        comp.ngOnInit();

        expect(bedienerService.query).toHaveBeenCalled();
        expect(bedienerService.addBedienerToCollectionIfMissing).toHaveBeenCalledWith(bedienerCollection, ...additionalBedieners);
        expect(comp.bedienersSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const auftrag: IAuftrag = { id: 456 };
        const status: IStatus = { id: 60827 };
        auftrag.status = status;
        const kunde: IPatner = { id: 15343 };
        auftrag.kunde = kunde;
        const bediener: IBediener = { id: 41958 };
        auftrag.bediener = bediener;

        activatedRoute.data = of({ auftrag });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(auftrag));
        expect(comp.statusesSharedCollection).toContain(status);
        expect(comp.patnersSharedCollection).toContain(kunde);
        expect(comp.bedienersSharedCollection).toContain(bediener);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Auftrag>>();
        const auftrag = { id: 123 };
        jest.spyOn(auftragService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ auftrag });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: auftrag }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(auftragService.update).toHaveBeenCalledWith(auftrag);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Auftrag>>();
        const auftrag = new Auftrag();
        jest.spyOn(auftragService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ auftrag });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: auftrag }));
        saveSubject.complete();

        // THEN
        expect(auftragService.create).toHaveBeenCalledWith(auftrag);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Auftrag>>();
        const auftrag = { id: 123 };
        jest.spyOn(auftragService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ auftrag });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(auftragService.update).toHaveBeenCalledWith(auftrag);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackStatusById', () => {
        it('Should return tracked Status primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackStatusById(0, entity);
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

      describe('trackBedienerById', () => {
        it('Should return tracked Bediener primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackBedienerById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});

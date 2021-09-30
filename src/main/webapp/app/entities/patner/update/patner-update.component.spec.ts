jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { PatnerService } from '../service/patner.service';
import { IPatner, Patner } from '../patner.model';
import { IOrganistation } from 'app/entities/organistation/organistation.model';
import { OrganistationService } from 'app/entities/organistation/service/organistation.service';

import { PatnerUpdateComponent } from './patner-update.component';

describe('Component Tests', () => {
  describe('Patner Management Update Component', () => {
    let comp: PatnerUpdateComponent;
    let fixture: ComponentFixture<PatnerUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let patnerService: PatnerService;
    let organistationService: OrganistationService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [PatnerUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(PatnerUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(PatnerUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      patnerService = TestBed.inject(PatnerService);
      organistationService = TestBed.inject(OrganistationService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Organistation query and add missing value', () => {
        const patner: IPatner = { id: 456 };
        const organistation: IOrganistation = { id: 42984 };
        patner.organistation = organistation;

        const organistationCollection: IOrganistation[] = [{ id: 1103 }];
        jest.spyOn(organistationService, 'query').mockReturnValue(of(new HttpResponse({ body: organistationCollection })));
        const additionalOrganistations = [organistation];
        const expectedCollection: IOrganistation[] = [...additionalOrganistations, ...organistationCollection];
        jest.spyOn(organistationService, 'addOrganistationToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ patner });
        comp.ngOnInit();

        expect(organistationService.query).toHaveBeenCalled();
        expect(organistationService.addOrganistationToCollectionIfMissing).toHaveBeenCalledWith(
          organistationCollection,
          ...additionalOrganistations
        );
        expect(comp.organistationsSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const patner: IPatner = { id: 456 };
        const organistation: IOrganistation = { id: 64959 };
        patner.organistation = organistation;

        activatedRoute.data = of({ patner });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(patner));
        expect(comp.organistationsSharedCollection).toContain(organistation);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Patner>>();
        const patner = { id: 123 };
        jest.spyOn(patnerService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ patner });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: patner }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(patnerService.update).toHaveBeenCalledWith(patner);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Patner>>();
        const patner = new Patner();
        jest.spyOn(patnerService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ patner });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: patner }));
        saveSubject.complete();

        // THEN
        expect(patnerService.create).toHaveBeenCalledWith(patner);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Patner>>();
        const patner = { id: 123 };
        jest.spyOn(patnerService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ patner });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(patnerService.update).toHaveBeenCalledWith(patner);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackOrganistationById', () => {
        it('Should return tracked Organistation primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackOrganistationById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});

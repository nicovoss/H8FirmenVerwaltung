jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { OrganistationService } from '../service/organistation.service';
import { IOrganistation, Organistation } from '../organistation.model';

import { OrganistationUpdateComponent } from './organistation-update.component';

describe('Component Tests', () => {
  describe('Organistation Management Update Component', () => {
    let comp: OrganistationUpdateComponent;
    let fixture: ComponentFixture<OrganistationUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let organistationService: OrganistationService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [OrganistationUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(OrganistationUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(OrganistationUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      organistationService = TestBed.inject(OrganistationService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should update editForm', () => {
        const organistation: IOrganistation = { id: 456 };

        activatedRoute.data = of({ organistation });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(organistation));
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Organistation>>();
        const organistation = { id: 123 };
        jest.spyOn(organistationService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ organistation });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: organistation }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(organistationService.update).toHaveBeenCalledWith(organistation);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Organistation>>();
        const organistation = new Organistation();
        jest.spyOn(organistationService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ organistation });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: organistation }));
        saveSubject.complete();

        // THEN
        expect(organistationService.create).toHaveBeenCalledWith(organistation);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Organistation>>();
        const organistation = { id: 123 };
        jest.spyOn(organistationService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ organistation });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(organistationService.update).toHaveBeenCalledWith(organistation);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { OrganistationDetailComponent } from './organistation-detail.component';

describe('Component Tests', () => {
  describe('Organistation Management Detail Component', () => {
    let comp: OrganistationDetailComponent;
    let fixture: ComponentFixture<OrganistationDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [OrganistationDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ organistation: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(OrganistationDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(OrganistationDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load organistation on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.organistation).toEqual(expect.objectContaining({ id: 123 }));
      });
    });
  });
});

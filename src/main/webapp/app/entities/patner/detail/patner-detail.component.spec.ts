import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { PatnerDetailComponent } from './patner-detail.component';

describe('Component Tests', () => {
  describe('Patner Management Detail Component', () => {
    let comp: PatnerDetailComponent;
    let fixture: ComponentFixture<PatnerDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [PatnerDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ patner: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(PatnerDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(PatnerDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load patner on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.patner).toEqual(expect.objectContaining({ id: 123 }));
      });
    });
  });
});

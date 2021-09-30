import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { BedienerDetailComponent } from './bediener-detail.component';

describe('Component Tests', () => {
  describe('Bediener Management Detail Component', () => {
    let comp: BedienerDetailComponent;
    let fixture: ComponentFixture<BedienerDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [BedienerDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ bediener: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(BedienerDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(BedienerDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load bediener on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.bediener).toEqual(expect.objectContaining({ id: 123 }));
      });
    });
  });
});

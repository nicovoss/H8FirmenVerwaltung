import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { BauteilDetailComponent } from './bauteil-detail.component';

describe('Component Tests', () => {
  describe('Bauteil Management Detail Component', () => {
    let comp: BauteilDetailComponent;
    let fixture: ComponentFixture<BauteilDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [BauteilDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ bauteil: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(BauteilDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(BauteilDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load bauteil on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.bauteil).toEqual(expect.objectContaining({ id: 123 }));
      });
    });
  });
});

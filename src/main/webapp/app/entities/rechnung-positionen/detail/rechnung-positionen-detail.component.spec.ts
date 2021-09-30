import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { RechnungPositionenDetailComponent } from './rechnung-positionen-detail.component';

describe('Component Tests', () => {
  describe('RechnungPositionen Management Detail Component', () => {
    let comp: RechnungPositionenDetailComponent;
    let fixture: ComponentFixture<RechnungPositionenDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [RechnungPositionenDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ rechnungPositionen: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(RechnungPositionenDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(RechnungPositionenDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load rechnungPositionen on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.rechnungPositionen).toEqual(expect.objectContaining({ id: 123 }));
      });
    });
  });
});

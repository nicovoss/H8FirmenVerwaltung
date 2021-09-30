import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { RechnungKopfDetailComponent } from './rechnung-kopf-detail.component';

describe('Component Tests', () => {
  describe('RechnungKopf Management Detail Component', () => {
    let comp: RechnungKopfDetailComponent;
    let fixture: ComponentFixture<RechnungKopfDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [RechnungKopfDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ rechnungKopf: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(RechnungKopfDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(RechnungKopfDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load rechnungKopf on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.rechnungKopf).toEqual(expect.objectContaining({ id: 123 }));
      });
    });
  });
});

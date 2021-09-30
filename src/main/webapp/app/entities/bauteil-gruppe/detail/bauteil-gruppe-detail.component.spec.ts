import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { BauteilGruppeDetailComponent } from './bauteil-gruppe-detail.component';

describe('Component Tests', () => {
  describe('BauteilGruppe Management Detail Component', () => {
    let comp: BauteilGruppeDetailComponent;
    let fixture: ComponentFixture<BauteilGruppeDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [BauteilGruppeDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ bauteilGruppe: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(BauteilGruppeDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(BauteilGruppeDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load bauteilGruppe on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.bauteilGruppe).toEqual(expect.objectContaining({ id: 123 }));
      });
    });
  });
});

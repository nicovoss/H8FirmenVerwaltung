import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ArtikelTypDetailComponent } from './artikel-typ-detail.component';

describe('Component Tests', () => {
  describe('ArtikelTyp Management Detail Component', () => {
    let comp: ArtikelTypDetailComponent;
    let fixture: ComponentFixture<ArtikelTypDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [ArtikelTypDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ artikelTyp: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(ArtikelTypDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(ArtikelTypDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load artikelTyp on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.artikelTyp).toEqual(expect.objectContaining({ id: 123 }));
      });
    });
  });
});

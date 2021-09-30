import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ArtikelZuBauteilmengeDetailComponent } from './artikel-zu-bauteilmenge-detail.component';

describe('Component Tests', () => {
  describe('ArtikelZuBauteilmenge Management Detail Component', () => {
    let comp: ArtikelZuBauteilmengeDetailComponent;
    let fixture: ComponentFixture<ArtikelZuBauteilmengeDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [ArtikelZuBauteilmengeDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ artikelZuBauteilmenge: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(ArtikelZuBauteilmengeDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(ArtikelZuBauteilmengeDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load artikelZuBauteilmenge on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.artikelZuBauteilmenge).toEqual(expect.objectContaining({ id: 123 }));
      });
    });
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ArtikelDetailComponent } from './artikel-detail.component';

describe('Component Tests', () => {
  describe('Artikel Management Detail Component', () => {
    let comp: ArtikelDetailComponent;
    let fixture: ComponentFixture<ArtikelDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [ArtikelDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ artikel: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(ArtikelDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(ArtikelDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load artikel on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.artikel).toEqual(expect.objectContaining({ id: 123 }));
      });
    });
  });
});

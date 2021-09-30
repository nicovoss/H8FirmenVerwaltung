import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { BauteileZuRohstoffeDetailComponent } from './bauteile-zu-rohstoffe-detail.component';

describe('Component Tests', () => {
  describe('BauteileZuRohstoffe Management Detail Component', () => {
    let comp: BauteileZuRohstoffeDetailComponent;
    let fixture: ComponentFixture<BauteileZuRohstoffeDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [BauteileZuRohstoffeDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ bauteileZuRohstoffe: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(BauteileZuRohstoffeDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(BauteileZuRohstoffeDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load bauteileZuRohstoffe on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.bauteileZuRohstoffe).toEqual(expect.objectContaining({ id: 123 }));
      });
    });
  });
});

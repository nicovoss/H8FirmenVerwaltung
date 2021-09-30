import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { RohstoffDetailComponent } from './rohstoff-detail.component';

describe('Component Tests', () => {
  describe('Rohstoff Management Detail Component', () => {
    let comp: RohstoffDetailComponent;
    let fixture: ComponentFixture<RohstoffDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [RohstoffDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ rohstoff: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(RohstoffDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(RohstoffDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load rohstoff on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.rohstoff).toEqual(expect.objectContaining({ id: 123 }));
      });
    });
  });
});

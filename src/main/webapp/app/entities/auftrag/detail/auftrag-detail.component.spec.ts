import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { AuftragDetailComponent } from './auftrag-detail.component';

describe('Component Tests', () => {
  describe('Auftrag Management Detail Component', () => {
    let comp: AuftragDetailComponent;
    let fixture: ComponentFixture<AuftragDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [AuftragDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ auftrag: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(AuftragDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(AuftragDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load auftrag on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.auftrag).toEqual(expect.objectContaining({ id: 123 }));
      });
    });
  });
});

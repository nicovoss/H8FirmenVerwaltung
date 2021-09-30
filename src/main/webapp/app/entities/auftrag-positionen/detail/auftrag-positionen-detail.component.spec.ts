import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { AuftragPositionenDetailComponent } from './auftrag-positionen-detail.component';

describe('Component Tests', () => {
  describe('AuftragPositionen Management Detail Component', () => {
    let comp: AuftragPositionenDetailComponent;
    let fixture: ComponentFixture<AuftragPositionenDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [AuftragPositionenDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ auftragPositionen: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(AuftragPositionenDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(AuftragPositionenDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load auftragPositionen on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.auftragPositionen).toEqual(expect.objectContaining({ id: 123 }));
      });
    });
  });
});

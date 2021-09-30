import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { RechnungPositionenService } from '../service/rechnung-positionen.service';

import { RechnungPositionenComponent } from './rechnung-positionen.component';

describe('Component Tests', () => {
  describe('RechnungPositionen Management Component', () => {
    let comp: RechnungPositionenComponent;
    let fixture: ComponentFixture<RechnungPositionenComponent>;
    let service: RechnungPositionenService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [RechnungPositionenComponent],
      })
        .overrideTemplate(RechnungPositionenComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(RechnungPositionenComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(RechnungPositionenService);

      const headers = new HttpHeaders().append('link', 'link;link');
      jest.spyOn(service, 'query').mockReturnValue(
        of(
          new HttpResponse({
            body: [{ id: 123 }],
            headers,
          })
        )
      );
    });

    it('Should call load all on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.rechnungPositionens?.[0]).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { RechnungKopfService } from '../service/rechnung-kopf.service';

import { RechnungKopfComponent } from './rechnung-kopf.component';

describe('Component Tests', () => {
  describe('RechnungKopf Management Component', () => {
    let comp: RechnungKopfComponent;
    let fixture: ComponentFixture<RechnungKopfComponent>;
    let service: RechnungKopfService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [RechnungKopfComponent],
      })
        .overrideTemplate(RechnungKopfComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(RechnungKopfComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(RechnungKopfService);

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
      expect(comp.rechnungKopfs?.[0]).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});

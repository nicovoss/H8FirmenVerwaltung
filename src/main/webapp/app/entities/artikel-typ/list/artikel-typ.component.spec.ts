import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { ArtikelTypService } from '../service/artikel-typ.service';

import { ArtikelTypComponent } from './artikel-typ.component';

describe('Component Tests', () => {
  describe('ArtikelTyp Management Component', () => {
    let comp: ArtikelTypComponent;
    let fixture: ComponentFixture<ArtikelTypComponent>;
    let service: ArtikelTypService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [ArtikelTypComponent],
      })
        .overrideTemplate(ArtikelTypComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ArtikelTypComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(ArtikelTypService);

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
      expect(comp.artikelTyps?.[0]).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});

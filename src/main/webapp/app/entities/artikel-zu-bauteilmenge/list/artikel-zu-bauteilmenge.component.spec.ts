import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { ArtikelZuBauteilmengeService } from '../service/artikel-zu-bauteilmenge.service';

import { ArtikelZuBauteilmengeComponent } from './artikel-zu-bauteilmenge.component';

describe('Component Tests', () => {
  describe('ArtikelZuBauteilmenge Management Component', () => {
    let comp: ArtikelZuBauteilmengeComponent;
    let fixture: ComponentFixture<ArtikelZuBauteilmengeComponent>;
    let service: ArtikelZuBauteilmengeService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [ArtikelZuBauteilmengeComponent],
      })
        .overrideTemplate(ArtikelZuBauteilmengeComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ArtikelZuBauteilmengeComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(ArtikelZuBauteilmengeService);

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
      expect(comp.artikelZuBauteilmenges?.[0]).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});

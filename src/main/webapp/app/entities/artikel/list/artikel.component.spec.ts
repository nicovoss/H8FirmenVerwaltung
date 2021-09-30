import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { ArtikelService } from '../service/artikel.service';

import { ArtikelComponent } from './artikel.component';

describe('Component Tests', () => {
  describe('Artikel Management Component', () => {
    let comp: ArtikelComponent;
    let fixture: ComponentFixture<ArtikelComponent>;
    let service: ArtikelService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [ArtikelComponent],
      })
        .overrideTemplate(ArtikelComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ArtikelComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(ArtikelService);

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
      expect(comp.artikels?.[0]).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});

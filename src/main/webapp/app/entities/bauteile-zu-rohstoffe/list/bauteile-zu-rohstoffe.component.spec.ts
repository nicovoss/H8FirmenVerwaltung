import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { BauteileZuRohstoffeService } from '../service/bauteile-zu-rohstoffe.service';

import { BauteileZuRohstoffeComponent } from './bauteile-zu-rohstoffe.component';

describe('Component Tests', () => {
  describe('BauteileZuRohstoffe Management Component', () => {
    let comp: BauteileZuRohstoffeComponent;
    let fixture: ComponentFixture<BauteileZuRohstoffeComponent>;
    let service: BauteileZuRohstoffeService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [BauteileZuRohstoffeComponent],
      })
        .overrideTemplate(BauteileZuRohstoffeComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(BauteileZuRohstoffeComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(BauteileZuRohstoffeService);

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
      expect(comp.bauteileZuRohstoffes?.[0]).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});

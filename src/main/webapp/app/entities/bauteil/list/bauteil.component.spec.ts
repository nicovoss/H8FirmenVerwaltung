import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { BauteilService } from '../service/bauteil.service';

import { BauteilComponent } from './bauteil.component';

describe('Component Tests', () => {
  describe('Bauteil Management Component', () => {
    let comp: BauteilComponent;
    let fixture: ComponentFixture<BauteilComponent>;
    let service: BauteilService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [BauteilComponent],
      })
        .overrideTemplate(BauteilComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(BauteilComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(BauteilService);

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
      expect(comp.bauteils?.[0]).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});

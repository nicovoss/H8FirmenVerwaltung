import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { RohstoffService } from '../service/rohstoff.service';

import { RohstoffComponent } from './rohstoff.component';

describe('Component Tests', () => {
  describe('Rohstoff Management Component', () => {
    let comp: RohstoffComponent;
    let fixture: ComponentFixture<RohstoffComponent>;
    let service: RohstoffService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [RohstoffComponent],
      })
        .overrideTemplate(RohstoffComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(RohstoffComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(RohstoffService);

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
      expect(comp.rohstoffs?.[0]).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});

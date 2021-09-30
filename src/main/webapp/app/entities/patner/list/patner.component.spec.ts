import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { PatnerService } from '../service/patner.service';

import { PatnerComponent } from './patner.component';

describe('Component Tests', () => {
  describe('Patner Management Component', () => {
    let comp: PatnerComponent;
    let fixture: ComponentFixture<PatnerComponent>;
    let service: PatnerService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [PatnerComponent],
      })
        .overrideTemplate(PatnerComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(PatnerComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(PatnerService);

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
      expect(comp.patners?.[0]).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});

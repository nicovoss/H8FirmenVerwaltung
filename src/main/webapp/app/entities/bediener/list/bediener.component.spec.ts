import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { BedienerService } from '../service/bediener.service';

import { BedienerComponent } from './bediener.component';

describe('Component Tests', () => {
  describe('Bediener Management Component', () => {
    let comp: BedienerComponent;
    let fixture: ComponentFixture<BedienerComponent>;
    let service: BedienerService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [BedienerComponent],
      })
        .overrideTemplate(BedienerComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(BedienerComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(BedienerService);

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
      expect(comp.bedieners?.[0]).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});

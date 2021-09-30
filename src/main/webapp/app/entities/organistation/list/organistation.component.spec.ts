import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { OrganistationService } from '../service/organistation.service';

import { OrganistationComponent } from './organistation.component';

describe('Component Tests', () => {
  describe('Organistation Management Component', () => {
    let comp: OrganistationComponent;
    let fixture: ComponentFixture<OrganistationComponent>;
    let service: OrganistationService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [OrganistationComponent],
      })
        .overrideTemplate(OrganistationComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(OrganistationComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(OrganistationService);

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
      expect(comp.organistations?.[0]).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});

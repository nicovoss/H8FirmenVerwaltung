import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { BauteilGruppeService } from '../service/bauteil-gruppe.service';

import { BauteilGruppeComponent } from './bauteil-gruppe.component';

describe('Component Tests', () => {
  describe('BauteilGruppe Management Component', () => {
    let comp: BauteilGruppeComponent;
    let fixture: ComponentFixture<BauteilGruppeComponent>;
    let service: BauteilGruppeService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [BauteilGruppeComponent],
      })
        .overrideTemplate(BauteilGruppeComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(BauteilGruppeComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(BauteilGruppeService);

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
      expect(comp.bauteilGruppes?.[0]).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});

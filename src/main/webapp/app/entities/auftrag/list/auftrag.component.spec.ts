import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { AuftragService } from '../service/auftrag.service';

import { AuftragComponent } from './auftrag.component';

describe('Component Tests', () => {
  describe('Auftrag Management Component', () => {
    let comp: AuftragComponent;
    let fixture: ComponentFixture<AuftragComponent>;
    let service: AuftragService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [AuftragComponent],
      })
        .overrideTemplate(AuftragComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(AuftragComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(AuftragService);

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
      expect(comp.auftrags?.[0]).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { AuftragPositionenService } from '../service/auftrag-positionen.service';

import { AuftragPositionenComponent } from './auftrag-positionen.component';

describe('Component Tests', () => {
  describe('AuftragPositionen Management Component', () => {
    let comp: AuftragPositionenComponent;
    let fixture: ComponentFixture<AuftragPositionenComponent>;
    let service: AuftragPositionenService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [AuftragPositionenComponent],
      })
        .overrideTemplate(AuftragPositionenComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(AuftragPositionenComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(AuftragPositionenService);

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
      expect(comp.auftragPositionens?.[0]).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});

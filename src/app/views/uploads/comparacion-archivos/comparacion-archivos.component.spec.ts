import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComparacionArchivosComponent } from './comparacion-archivos.component';

describe('ComparacionArchivosComponent', () => {
  let component: ComparacionArchivosComponent;
  let fixture: ComponentFixture<ComparacionArchivosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComparacionArchivosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComparacionArchivosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

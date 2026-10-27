import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeccionesAprendidasComponent } from './lecciones-aprendidas.component';

describe('LeccionesAprendidasComponent', () => {
  let component: LeccionesAprendidasComponent;
  let fixture: ComponentFixture<LeccionesAprendidasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeccionesAprendidasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeccionesAprendidasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultsSustitucionesComponent } from './results-sustituciones.component';

describe('ResultsSustitucionesComponent', () => {
  let component: ResultsSustitucionesComponent;
  let fixture: ComponentFixture<ResultsSustitucionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResultsSustitucionesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResultsSustitucionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

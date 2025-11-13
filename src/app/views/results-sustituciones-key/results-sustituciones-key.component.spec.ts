import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultsSustitucionesKeyComponent } from './results-sustituciones-key.component';

describe('ResultsSustitucionesKeyComponent', () => {
  let component: ResultsSustitucionesKeyComponent;
  let fixture: ComponentFixture<ResultsSustitucionesKeyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResultsSustitucionesKeyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResultsSustitucionesKeyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

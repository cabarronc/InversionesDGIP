import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultsDetalleComponent } from './results-detalle.component';

describe('ResultsDetalleComponent', () => {
  let component: ResultsDetalleComponent;
  let fixture: ComponentFixture<ResultsDetalleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResultsDetalleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResultsDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

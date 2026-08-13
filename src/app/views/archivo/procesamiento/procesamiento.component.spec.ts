import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcesamientoComponent } from './procesamiento.component';

describe('ProcesamientoComponent', () => {
  let component: ProcesamientoComponent;
  let fixture: ComponentFixture<ProcesamientoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProcesamientoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProcesamientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

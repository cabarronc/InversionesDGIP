import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdecuacionesComponent } from './adecuaciones.component';

describe('AdecuacionesComponent', () => {
  let component: AdecuacionesComponent;
  let fixture: ComponentFixture<AdecuacionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdecuacionesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdecuacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

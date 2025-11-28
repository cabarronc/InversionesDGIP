import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FabGlobalComponent } from './fab-global.component';

describe('FabGlobalComponent', () => {
  let component: FabGlobalComponent;
  let fixture: ComponentFixture<FabGlobalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FabGlobalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FabGlobalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

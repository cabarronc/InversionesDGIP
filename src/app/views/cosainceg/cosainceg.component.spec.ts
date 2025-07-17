import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CosaincegComponent } from './cosainceg.component';

describe('CosaincegComponent', () => {
  let component: CosaincegComponent;
  let fixture: ComponentFixture<CosaincegComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CosaincegComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CosaincegComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

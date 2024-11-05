import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CircularContentComponent } from './circular-content.component';

describe('CircularContentComponent', () => {
  let component: CircularContentComponent;
  let fixture: ComponentFixture<CircularContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CircularContentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CircularContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

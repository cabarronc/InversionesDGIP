import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AilaComponent } from './aila.component';

describe('AilaComponent', () => {
  let component: AilaComponent;
  let fixture: ComponentFixture<AilaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AilaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AilaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

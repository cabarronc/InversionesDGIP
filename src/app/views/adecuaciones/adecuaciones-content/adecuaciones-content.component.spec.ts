import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdecuacionesContentComponent } from './adecuaciones-content.component';

describe('AdecuacionesContentComponent', () => {
  let component: AdecuacionesContentComponent;
  let fixture: ComponentFixture<AdecuacionesContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdecuacionesContentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdecuacionesContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarAvatarComponent } from './navbar-avatar.component';

describe('NavbarAvatarComponent', () => {
  let component: NavbarAvatarComponent;
  let fixture: ComponentFixture<NavbarAvatarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarAvatarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavbarAvatarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

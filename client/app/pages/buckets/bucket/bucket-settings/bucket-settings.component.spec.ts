import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BucketSettingsComponent } from './bucket-settings.component';

describe('BucketSettingsComponent', () => {
  let component: BucketSettingsComponent;
  let fixture: ComponentFixture<BucketSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BucketSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BucketSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

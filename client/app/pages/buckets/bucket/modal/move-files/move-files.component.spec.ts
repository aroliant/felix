import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MoveFilesComponent } from './move-files.component';

describe('MoveFilesComponent', () => {
  let component: MoveFilesComponent;
  let fixture: ComponentFixture<MoveFilesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MoveFilesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MoveFilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

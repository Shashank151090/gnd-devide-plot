import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FileDataComponent } from './file-data.component';

describe('FileDataComponent', () => {
  let component: FileDataComponent;
  let fixture: ComponentFixture<FileDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FileDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

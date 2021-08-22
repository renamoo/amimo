import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RectangleEditorComponent } from './rectangle-editor.component';

describe('RectangleEditorComponent', () => {
  let component: RectangleEditorComponent;
  let fixture: ComponentFixture<RectangleEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RectangleEditorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RectangleEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StitchSelectorComponent } from './stitch-selector.component';

describe('StitchSelectorComponent', () => {
  let component: StitchSelectorComponent;
  let fixture: ComponentFixture<StitchSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StitchSelectorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StitchSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorClassifierComponent } from './color-classifier.component';

describe('ColorClassifierComponent', () => {
  let component: ColorClassifierComponent;
  let fixture: ComponentFixture<ColorClassifierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ColorClassifierComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ColorClassifierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalImageControlComponent } from './modal-image-control.component';

describe('ModalImageControlComponent', () => {
  let component: ModalImageControlComponent;
  let fixture: ComponentFixture<ModalImageControlComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalImageControlComponent]
    });
    fixture = TestBed.createComponent(ModalImageControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

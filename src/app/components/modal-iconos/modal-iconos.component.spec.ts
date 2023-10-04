import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalIconosComponent } from './modal-iconos.component';

describe('ModalIconosComponent', () => {
  let component: ModalIconosComponent;
  let fixture: ComponentFixture<ModalIconosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalIconosComponent]
    });
    fixture = TestBed.createComponent(ModalIconosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

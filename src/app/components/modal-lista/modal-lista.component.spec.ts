import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalListaComponent } from './modal-lista.component';

describe('ModalListaComponent', () => {
  let component: ModalListaComponent;
  let fixture: ComponentFixture<ModalListaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalListaComponent]
    });
    fixture = TestBed.createComponent(ModalListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

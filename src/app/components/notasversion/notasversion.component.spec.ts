import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotasversionComponent } from './notasversion.component';

describe('NotasversionComponent', () => {
  let component: NotasversionComponent;
  let fixture: ComponentFixture<NotasversionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NotasversionComponent]
    });
    fixture = TestBed.createComponent(NotasversionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

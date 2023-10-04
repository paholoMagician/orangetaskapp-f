import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InitchoiceComponent } from './initchoice.component';

describe('InitchoiceComponent', () => {
  let component: InitchoiceComponent;
  let fixture: ComponentFixture<InitchoiceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InitchoiceComponent]
    });
    fixture = TestBed.createComponent(InitchoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

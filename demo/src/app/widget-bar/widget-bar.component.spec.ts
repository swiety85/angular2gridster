import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetBarComponent } from './widget-bar.component';

describe('WidgetBarComponent', () => {
  let component: WidgetBarComponent;
  let fixture: ComponentFixture<WidgetBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WidgetBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GridsterConfiguratorComponent } from './gridster-configurator.component';

describe('GridsterConfiguratorComponent', () => {
  let component: GridsterConfiguratorComponent;
  let fixture: ComponentFixture<GridsterConfiguratorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GridsterConfiguratorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GridsterConfiguratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

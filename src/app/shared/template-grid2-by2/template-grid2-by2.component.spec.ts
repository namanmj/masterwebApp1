import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TemplateGrid2By2Component } from './template-grid2-by2.component';

describe('TemplateGrid2By2Component', () => {
  let component: TemplateGrid2By2Component;
  let fixture: ComponentFixture<TemplateGrid2By2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TemplateGrid2By2Component ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TemplateGrid2By2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

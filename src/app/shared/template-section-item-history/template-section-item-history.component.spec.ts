import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TemplateSectionItemHistoryComponent } from './template-section-item-history.component';

describe('TemplateSectionItemHistoryComponent', () => {
  let component: TemplateSectionItemHistoryComponent;
  let fixture: ComponentFixture<TemplateSectionItemHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TemplateSectionItemHistoryComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TemplateSectionItemHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

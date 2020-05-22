import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TemplateVerticalImageTextComponent } from './template-vertical-image-text.component';

describe('TemplateVerticalImageTextComponent', () => {
  let component: TemplateVerticalImageTextComponent;
  let fixture: ComponentFixture<TemplateVerticalImageTextComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TemplateVerticalImageTextComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TemplateVerticalImageTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

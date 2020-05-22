import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { GenericviewcontrollerComponent } from './genericviewcontroller.component';

describe('GenericviewcontrollerComponent', () => {
  let component: GenericviewcontrollerComponent;
  let fixture: ComponentFixture<GenericviewcontrollerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenericviewcontrollerComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(GenericviewcontrollerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

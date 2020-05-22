import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SquarecardComponent } from './squarecard.component';

describe('SquarecardComponent', () => {
  let component: SquarecardComponent;
  let fixture: ComponentFixture<SquarecardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SquarecardComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SquarecardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

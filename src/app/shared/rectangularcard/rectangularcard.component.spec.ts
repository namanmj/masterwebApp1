import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RectangularcardComponent } from './rectangularcard.component';

describe('RectangularcardComponent', () => {
  let component: RectangularcardComponent;
  let fixture: ComponentFixture<RectangularcardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RectangularcardComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RectangularcardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

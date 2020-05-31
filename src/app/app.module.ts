import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { WebIntent } from '@ionic-native/web-intent/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { Downloader } from '@ionic-native/downloader/ngx';



import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material';






import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SplashscreenComponent } from './splashscreen/splashscreen.component';
import { LoginscreenComponent } from './loginscreen/loginscreen.component';
import { HomeComponent } from './home/home.component';
import { RectangularcardComponent } from './shared/rectangularcard/rectangularcard.component';
import { TemplateStatsCardComponent } from './shared/template-stats-card/template-stats-card.component';
import { LocationComponent } from './location/location.component';
import { SquarecardComponent } from './shared/squarecard/squarecard.component';
import { TabbarComponent } from './shared/tabbar/tabbar.component';
import { TemplateGrid2By2Component } from './shared/template-grid2-by2/template-grid2-by2.component';
import { FeedviewComponent } from './feedview/feedview.component';
import { WebviewComponent } from './webviewcontroller/webviewcontroller.component';
import { GenericviewcontrollerComponent } from './genericviewcontroller/genericviewcontroller.component';
import { TemplateTwoComponent } from './shared/template-two/template-two.component';
import { TemplateTransactionComponent } from './shared/template-transaction/template-transaction.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TemplateVerticalImageTextComponent } from './shared/template-vertical-image-text/template-vertical-image-text.component';
import { TemplateCommonCardContentComponent } from './shared/template-common-card-content/template-common-card-content.component';
import { MyInterceptor } from './httpinspector';
import { PaymentComponent } from './payment/payment.component';
import { CardDetailPageComponent } from './card-detail-page/card-detail-page.component';
import { TemplateSectionItemHistoryComponent } from './shared/template-section-item-history/template-section-item-history.component';

@NgModule({
  declarations: [AppComponent,
    SplashscreenComponent,
    LoginscreenComponent,
    HomeComponent,
    SquarecardComponent,
    RectangularcardComponent,
    LocationComponent,
    TemplateStatsCardComponent,
    FeedviewComponent,
    TemplateGrid2By2Component,
    WebviewComponent,
    PaymentComponent,
    TabbarComponent,
    GenericviewcontrollerComponent,
    TemplateTwoComponent,
    CardDetailPageComponent,
    TemplateCommonCardContentComponent,
    TemplateVerticalImageTextComponent,
    TemplateSectionItemHistoryComponent,
    TemplateTransactionComponent],
  entryComponents: [],
  imports: [
    MatNativeDateModule,
    MatButtonModule,
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDatepickerModule,
    MatInputModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatRadioModule],
  providers: [
    StatusBar,
    SplashScreen,
    SocialSharing,
    Downloader,
    WebIntent,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MyInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { SplashscreenComponent } from './splashscreen/splashscreen.component';
import { LoginscreenComponent } from './loginscreen/loginscreen.component';
import { FeedviewComponent } from './feedview/feedview.component';
import { WebviewComponent } from './webviewcontroller/webviewcontroller.component';
import { GenericviewcontrollerComponent } from './genericviewcontroller/genericviewcontroller.component';
import { PaymentComponent } from './payment/payment.component';
import { CardDetailPageComponent } from './card-detail-page/card-detail-page.component';


const routes: Routes = [
  {path:'',redirectTo:'/splash',pathMatch:'full'},
  {path:'home',component:HomeComponent},
  {path:'splash',component:SplashscreenComponent},
  {path:'login',component:LoginscreenComponent},
  {path:"feedview",component:FeedviewComponent},
  {path:"webview",component:WebviewComponent},
  {path:"genericview",component:GenericviewcontrollerComponent},
  {path:"payment",component:PaymentComponent},
  {path:"detailPage",component:CardDetailPageComponent},
];


@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules ,useHash: true,onSameUrlNavigation: "reload"})
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

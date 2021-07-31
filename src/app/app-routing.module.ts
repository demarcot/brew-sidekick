import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CorrectionsComponent } from './corrections/corrections.component';
import { LandingComponent } from './landing/landing.component';
import { MiscComponent } from './misc/misc.component';
import { PostBrewComponent } from './post-brew/post-brew.component';
import { PreBrewComponent } from './pre-brew/pre-brew.component';

const appRoutes: Routes = [
    {path: '', component: PreBrewComponent, pathMatch: 'full'},
    {path: 'pre-brew', component: PreBrewComponent, pathMatch: 'full'},
    {path: 'post-brew', component: PostBrewComponent, pathMatch: 'full'},
    {path: 'corrections', component: CorrectionsComponent, pathMatch: 'full'},
    {path: 'misc', component: MiscComponent, pathMatch: 'full'},
];

@NgModule({
    imports: [
        RouterModule.forRoot(appRoutes)
    ],
    exports: [
        RouterModule
    ]
})
export class AppRoutingModule {

}
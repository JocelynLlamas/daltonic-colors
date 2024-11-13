import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

export const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    {
        path: 'home',
        loadComponent: () => import('./shared/pages/home/home.component').then((m) => m.HomeComponent),
    },
    {
        path: 'color',
        loadComponent: () => import('./color-classifier/color-classifier.component').then((m) => m.ColorClassifierComponent),
    },
];
@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRouterModule { }

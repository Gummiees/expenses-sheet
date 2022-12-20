import { NgModule } from '@angular/core';
import {
  canActivate,
  redirectLoggedInTo,
  redirectUnauthorizedTo
} from '@angular/fire/compat/auth-guard';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const redirectUnauthorizedToSignIn = () => redirectUnauthorizedTo(['sign-in']);
const redirectLoggedInToHome = () => redirectLoggedInTo(['/']);

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./components/main/main.module').then((m) => m.MainModule),
    ...canActivate(redirectUnauthorizedToSignIn)
  },
  {
    path: 'user',
    loadChildren: () => import('./components/user/user.module').then((m) => m.UserModule),
    ...canActivate(redirectUnauthorizedToSignIn)
  },
  {
    path: 'tag',
    loadChildren: () => import('./components/tag/tag.module').then((m) => m.TagModule),
    ...canActivate(redirectUnauthorizedToSignIn)
  },
  {
    path: 'entry',
    loadChildren: () => import('./components/entry/entry.module').then((m) => m.EntryModule),
    ...canActivate(redirectUnauthorizedToSignIn)
  },
  {
    path: 'category',
    loadChildren: () =>
      import('./components/category/category.module').then((m) => m.CategoryModule),
    ...canActivate(redirectUnauthorizedToSignIn)
  },
  {
    path: 'sign-in',
    loadChildren: () => import('./components/sign-in/sign-in.module').then((m) => m.SignInModule),
    ...canActivate(redirectLoggedInToHome)
  },
  { path: '**', redirectTo: 'main', pathMatch: 'full' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}

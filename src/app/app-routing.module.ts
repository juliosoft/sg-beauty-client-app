import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CadastroClienteComponent } from './pages/cliente/cadastro-cliente/cadastro-cliente.component';
import { ListaClientesComponent } from './pages/cliente/lista-clientes/lista-clientes.component';
import { HomeComponent } from './pages/home/home.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent},
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'cliente', component: ListaClientesComponent},
  { path: 'cliente/cadastro', component: CadastroClienteComponent},
  { path: 'cliente/cadastro/:id', component: CadastroClienteComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
exports: [RouterModule]
})
export class AppRoutingModule { }


// https://stackblitz.com/edit/material-sidenav-example?file=app%2Fsidenav-autosize-example.css

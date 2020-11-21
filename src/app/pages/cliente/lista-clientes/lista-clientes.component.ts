import { Component, OnInit, AfterViewInit, ViewChild, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { isNullOrUndefined } from 'util';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Cliente } from 'src/app/core/models/cliente.model';
import { ClienteService } from 'src/app/core/services/cliente.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/components/confirm-dialog/confirm-dialog.component';


@Component({
  selector: 'app-listagem-cliente',
  templateUrl: './lista-clientes.component.html',
  styleUrls: ['./lista-clientes.component.scss']
})
export class ListaClientesComponent  implements AfterViewInit, OnInit, OnDestroy {

    @Output() subTituloPagina = new EventEmitter<string>();

    prencherSubTitulo(){
      this.subTituloPagina.emit('Administrativo');
    }
    //--------------------------------------------------------------------------------------
    // declaração das variávies locais------------------------------------------------------
    //--------------------------------------------------------------------------------------
    @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: false}) sort: MatSort;
    @ViewChild(MatTable, {static: false}) table: MatTable<Cliente>;

    dataSource = new MatTableDataSource<Cliente>();
    subTitulo = 'Listagem de Usuários';
    titulo : string;
    mySubscription: any;
    displayedColumns = ['clienteId', 'nome', 'telefone', 'email', 'action'];
    selection = new SelectionModel<Cliente>(true, []);

    // -------------------------------------------------------------------------------------

    constructor(private router: Router,
                private activeRoute: ActivatedRoute,
                private clienteService: ClienteService,
                private dialog: MatDialog
                //,
                //private nfService: NotifyService
                ) {

      // tslint:disable-next-line: only-arrow-functions
      this.router.routeReuseStrategy.shouldReuseRoute = function () {
        return false;
      };

      this.mySubscription = this.router.events.subscribe((event) => {
        if (event instanceof NavigationEnd) {
          this.router.navigated = false;
        }
      });
    }

    ngOnInit() {
    this.titulo = "Listagem de Clientes";
    }

    ngAfterViewInit() {

      this.consultar();
    }

    consultar() : void {

      this.dataSource = new MatTableDataSource<Cliente>();
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.table.dataSource = this.dataSource;
      console.log('consultando registros');
      this.clienteService.getList('').subscribe((registros: Cliente[]) => {
        this.dataSource.data = registros;
      });
    }

    novo() {
      this.router.navigateByUrl('home/cliente/novo');
    }

    excluir(id : number)  {
      const confirmaExcluir = this.dialog.open(ConfirmDialogComponent, {
        width: '350px',
        data: 'Confirmar excluir o registro selecionado?'
      });

      confirmaExcluir.afterClosed().subscribe(result => {
        if(result) {
          this.clienteService.delete(id).subscribe(
            (resp) => {
            console.log('registro excluido');
            //this.nfService.sucesso('registro excluído com sucesso.');
            this.consultar();
          },
          (error) => {
            console.log(error);
            //this.nfService.erro(error.error);
          }
          );
        }
      });
    }

    ngOnDestroy() {
      if (this.mySubscription) {
        this.mySubscription.unsubscribe();
      }
    }

    excluirSelecionados() {
      const selecionados = this.dataSource.data.filter(row => this.selection.isSelected(row) === true);

      if(isNullOrUndefined(selecionados) === true || selecionados.length === 0) {
        //this.nfService.alerta('Nenhum registro foi selecionado.');
        return;
      }

      // const confirmaExcluir = this.dialog.open(ConfirmDialogComponent, {
      //   width: '350px',
      //   data: 'Confirmar excluir os registros selecionados?'
      // });

      // confirmaExcluir.afterClosed().subscribe(result => {
      //   if (result) {

      //     this.clienteService.excluirVarios(selecionados).subscribe(
      //       (resp) => {
      //       console.log('registros excluidos');
      //       this.nfService.sucesso('registros excluído com sucesso.');
      //       this.consultar();
      //     },
      //     (error) => {
      //       console.log(error);
      //       this.nfService.erro(error.error);
      //     }
      //     );
      //   }
      // });
    }

    filtrarGrid(event: Event) {
      const filterValue = (event.target as HTMLInputElement).value;
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }
}

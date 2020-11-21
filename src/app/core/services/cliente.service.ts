import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { Cliente } from '../models/cliente.model';

@Injectable({
  providedIn: 'root',
})
export class ClienteService {
  urlApi = 'https://localhost:44357/api/'; // api rest fake
  subUrl = 'cliente';

  // injetando o HttpClient
  constructor(private httpClient: HttpClient) {}

  // Headers
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  // consultar todos os clientes
  getList(filtro : string): Observable<Cliente[]> {
    return this.httpClient
      .get<Cliente[]>(this.urlApi + this.subUrl, this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }

  // Obtem por id
  getById(id: number): Observable<Cliente> {
    return this.httpClient
      .get<Cliente>(this.urlApi + this.subUrl + '/' + id)
      .pipe(retry(2), catchError(this.handleError));
  }

  // salvar cliente
  save(cliente: Cliente): Observable<Cliente> {
    return this.httpClient
      .post<Cliente>(
        this.urlApi + this.subUrl,
        JSON.stringify(cliente),
        this.httpOptions
      )
      .pipe(retry(2), catchError(this.handleError));
  }

  // utualizar
  update(cliente: Cliente): Observable<Cliente> {
    return this.httpClient
      .put<Cliente>(
        this.urlApi + this.subUrl + '/' + cliente.clienteId,
        JSON.stringify(cliente),
        this.httpOptions
      )
      .pipe(retry(1), catchError(this.handleError));
  }

  // deletar
  delete(id: number) {
    return this.httpClient
      .delete<Cliente>(
        this.urlApi + this.subUrl + +'/' + id,
        this.httpOptions
      )
      .pipe(retry(1), catchError(this.handleError));
  }

  // Manipulação de erros
  handleError(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Erro ocorreu no lado do client
      errorMessage = error.error.message;
    } else {
      // Erro ocorreu no lado do servidor
      errorMessage =
        `Código do erro: ${error.status}, ` + `menssagem: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  }
}

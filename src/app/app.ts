import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from "./components/navbar/navbar";
import { Loading } from './services/loading';
import { Notificacao } from './services/notificacao';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class App {
  private loadingService = inject(Loading)
  private notificacaoService = inject(Notificacao)

  protected readonly carregando = this.loadingService.loading
  protected readonly mensagem = this.notificacaoService.mensagem
}

import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Login } from '../../../shared/services/login';
import { UsuarioLogin } from '../../../shared/models/usuario-login';
import { Alert, AlertType } from '../../../shared/components/alert/alert';
import { environment } from '../../../../environments/environment';

@Component({
    selector: 'app-admin-login',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink, Alert],
    templateUrl: './admin-login.html',
    styleUrl: './admin-login.css'
})
export class AdminLogin {
    cpf = '';
    senha = '';
    carregando = false;
    mostrarSenha = false;
    alertType: AlertType = 'error';
    alertMessage = '';
    alertShow = false;
    version = environment.version;

    private usuarioLogin: UsuarioLogin = new UsuarioLogin();

    constructor(private router: Router, private login: Login, private cdr: ChangeDetectorRef) {}

    onSubmit(): void {
        if (this.carregando) {
            return;
        }

        this.carregando = true;

        setTimeout(() => {
            // this.router.navigate(['/admin/painel']);
            this.usuarioLogin = new UsuarioLogin();
            this.usuarioLogin.cpf = this.cpf.replace(/\D/g, '')
            this.usuarioLogin.senha = this.senha;

            this.login.login(this.usuarioLogin).subscribe({
                next: (res) =>{
                    if(res){
                        console.log("Res:", res);
                        sessionStorage.setItem('token', res.token);
                        this.router.navigate(['/admin/painel']);
                        this.carregando = false;
                        this.cdr.detectChanges();
                    }
                },
                error: (err) =>{
                    console.log("Erro:", err.error);
                    const errorMessage = err.error?.message || err.error?.error || 'CPF ou senha incorretos. Verifique suas credenciais e tente novamente.';
                    this.mostrarAlerta('error', errorMessage);
                    this.carregando = false;
                    this.cdr.detectChanges();
                }
            });
        }, 400);
    }

    onCpfInput(event: Event): void {
        const target = event.target as HTMLInputElement | null;
        if (!target) {
            return;
        }
        this.formatarCpf(target.value ?? '');
    }

    onCpfKeydown(event: KeyboardEvent): void {
        const teclasPermitidas = [
            'Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'Home', 'End'
        ];

        if (teclasPermitidas.includes(event.key) || event.ctrlKey || event.metaKey) {
            return;
        }

        if (!/\d/.test(event.key)) {
            event.preventDefault();
            return;
        }

        const target = event.target as HTMLInputElement | null;
        if (!target) {
            return;
        }

        const apenasNumeros = (target.value ?? '').replace(/\D/g, '');
        const selectionLength = target.selectionEnd !== null && target.selectionStart !== null
            ? target.selectionEnd - target.selectionStart
            : 0;

        if (apenasNumeros.length >= 11 && selectionLength === 0) {
            event.preventDefault();
        }
    }

    onCpfPaste(event: ClipboardEvent): void {
        const texto = event.clipboardData?.getData('text') ?? '';
        if (!/^\d+$/.test(texto)) {
            event.preventDefault();
            return;
        }

        const truncado = texto.slice(0, 11);
        const target = event.target as HTMLInputElement | null;
        if (!target) {
            return;
        }

        event.preventDefault();
        this.formatarCpf(truncado);
        target.value = this.cpf;
    }

    formatarCpf(valor: string): void {
        const apenasNumeros = valor.replace(/\D/g, '').slice(0, 11);
        let formatado = apenasNumeros;

        if (apenasNumeros.length > 9) {
            formatado = `${apenasNumeros.slice(0, 3)}.${apenasNumeros.slice(3, 6)}.${apenasNumeros.slice(6, 9)}-${apenasNumeros.slice(9, 11)}`;
        } else if (apenasNumeros.length > 6) {
            formatado = `${apenasNumeros.slice(0, 3)}.${apenasNumeros.slice(3, 6)}.${apenasNumeros.slice(6)}`;
        } else if (apenasNumeros.length > 3) {
            formatado = `${apenasNumeros.slice(0, 3)}.${apenasNumeros.slice(3)}`;
        }

        this.cpf = formatado;
    }

    alternarSenha(): void {
        this.mostrarSenha = !this.mostrarSenha;
    }

    mostrarAlerta(type: AlertType, message: string): void {
        this.alertType = type;
        this.alertMessage = message;
        this.alertShow = true;
        this.cdr.detectChanges();
    }

    onAlertClosed(): void {
        this.alertShow = false;
        this.cdr.detectChanges();
    }
}

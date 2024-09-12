import { IsEmail, IsNotEmpty, Matches } from 'class-validator';

export class CriarUsuarioDto {
    @IsEmail({}, { message: 'O email fornecido é inválido' })
    email!: string;

    @IsNotEmpty({ message: 'A senha não pode estar vazia' })
    @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/, {
        message: 'A senha deve ter pelo menos uma letra maiúscula, minúscula, um número e um caractere especial',
    })
    senha!: string;

    @IsNotEmpty({ message: 'O nome não pode estar vazio' })
    nome!: string;

    @IsNotEmpty({ message: 'A confirmação da senha não pode estar vazia' })
    confirmarSenha!: string;
}
# CONTEXTO MESTRE DO PROJETO: "SISTEMA NERVOSO DE TERRA ROXA"

Atue como um Arquiteto de Software Sênior e Engenheiro de Banco de Dados Especialista. Estamos iniciando o desenvolvimento de um sistema de engajamento cívico para a cidade de Terra Roxa/SP.

## 1. A Filosofia do Projeto (Restrições e Estilo)

- **Público-Alvo:** População com baixa literacia digital. A interface deve ser "invisível" e extremamente simples.
- **Plataforma:** Web App (PWA) leve. Nada de frameworks pesados que exijam download.
- **Core Business:** Gamificação Cívica Auditável. O sistema não é apenas um "reportador de problemas", é um jogo de status social.
- **Stack Tecnológica:** Banco de Dados Relacional (MySQL/MariaDB) robusto. O Backend será simples (PHP, Python ou Node - definiremos depois), mas o Banco é o coração.

## 2. A Lógica de Negócio (CRUCIAL)

O sistema de pontuação deve funcionar como um **LIVRO RAZÃO CONTÁBIL (LEDGER)**.

- **REGRA DE OURO:** Jamais armazene o "saldo atual" do usuário em uma coluna fixa na tabela de usuários. O saldo deve ser sempre calculado pela soma (`SUM`) das transações no histórico. Isso garante auditoria e evita bugs de sincronia.
- **Flexibilidade:** O sistema deve permitir que regras mudem (ex: hoje reportar buraco vale 10, amanhã vale 20) sem alterar o histórico de quem já ganhou os pontos.



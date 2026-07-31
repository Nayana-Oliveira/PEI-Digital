# Sistema de Plano Educacional Individualizado (PEI)

Sistema web desenvolvido para gerenciar o fluxo de criação, aprovação e arquivamento dos Planos Educacionais Individualizados (PEIs) da Escola Estadual Professor Eusébio de Paula Marcondes.

O sistema foi desenvolvido utilizando apenas tecnologias nativas do Google Workspace, com interface em HTML, CSS e JavaScript puro e backend em Google Apps Script.

---

## Funcionalidades

### Professor Curricular

- Login utilizando e-mail institucional
- Criação de novos PEIs
- Edição de PEIs devolvidos para correção
- Consulta do histórico de PEIs enviados
- Visualização do documento Google Docs
- Visualização do PDF gerado
- Barra de progresso do preenchimento do formulário

### Professor AEE / Colaborativo

- Visualização dos PEIs pendentes
- Aprovação dos PEIs
- Solicitação de correção
- Histórico de PEIs aprovados

### Coordenação

- Visualização dos PEIs encaminhados
- Aprovação dos PEIs
- Solicitação de correção
- Histórico de aprovações

### Vice-Direção

- Aprovação final dos PEIs
- Geração automática do documento final
- Geração do PDF
- Histórico de documentos finalizados

---

# Fluxo do Sistema

```
Professor
      │
      ▼
AEE / Colaborativo
      │
      ▼
Coordenação
      │
      ▼
Vice-Direção
      │
      ▼
Documento Final + PDF
```

Caso algum responsável solicite correção, o PEI retorna automaticamente ao professor responsável.

---

# Tecnologias Utilizadas

## Frontend

- HTML5
- CSS3
- JavaScript (ES6)

## Backend

- Google Apps Script

## Banco de Dados

- Google Sheets

## Armazenamento

- Google Drive

## Documentos

- Google Docs
- PDF

---

# Estrutura do Projeto

```
/
│
├── assets/
│
├── professor/
│   ├── index.html
│   ├── formulario.html
│   ├── professor.js
│   └── script.js
│
├── coordenacao/
│
├── direcao/
│
├── css/
│
├── js/
│   ├── api.js
│   ├── auth.js
│   ├── toast.js
│   ├── validation.js
│   └── utils.js
│
└── appscript/
    ├── Code.gs
    ├── Sheets.gs
    ├── PEIService.gs
    ├── WorkflowService.gs
    ├── DocumentService.gs
    ├── AuthService.gs
    ├── Config.gs
    └── Utils.gs
```

---

# Arquitetura

```
Frontend
     │
     ▼
Google Apps Script (API)
     │
     ├── Sheets
     ├── Google Docs
     ├── Google Drive
     └── Workflow
```

---

# Organização do Backend

## Code.gs

Responsável pelas requisições HTTP (`doGet` e `doPost`) e roteamento das ações.

---

## Sheets.gs

Responsável por toda manipulação das planilhas:

- leitura
- escrita
- busca
- atualização
- consultas

---

## PEIService.gs

Responsável pela regra de negócio do sistema.

Exemplos:

- criação de PEI
- aprovação
- correção
- atualização
- validações

---

## WorkflowService.gs

Responsável pelo fluxo de aprovação dos documentos.

---

## DocumentService.gs

Responsável por:

- geração do Google Docs
- inserção das assinaturas
- geração do PDF
- organização automática no Google Drive

---

## AuthService.gs

Responsável pela autenticação dos usuários.

---

# Estrutura da Planilha PEIs

| Campo |
|--------|
| ID |
| UUID |
| DataEnvio |
| Professor |
| Especializado |
| Colaborativo |
| Aluno |
| Turma |
| Disciplina |
| Bimestre |
| Conteudos |
| Estrategias |
| Avaliacao |
| Recursos |
| Status |
| EtapaAtual |
| ResponsavelAtual |
| DocumentoID |
| PDFID |
| ProfessorAssinatura |
| ProfessorDataAssinatura |
| AEEAssinatura |
| AEEDataAssinatura |
| CoordenacaoAssinatura |
| CoordenacaoResponsavel |
| CoordenacaoDataAssinatura |
| ViceAssinatura |
| ViceResponsavel |
| ViceDataAssinatura |
| DataFinalizacao |
| MotivoCorrecao |
| QuantidadeCorrecoes |

---

# Funcionalidades Implementadas

- Login institucional
- Controle por perfil de usuário
- Cadastro de PEIs
- Aprovação por etapas
- Solicitação de correções
- Histórico individual por responsável
- Assinaturas automáticas
- Geração automática de Google Docs
- Geração automática de PDF
- Organização automática no Google Drive
- Toasts de sucesso e erro
- Barra de progresso do formulário
- Visualização do documento e PDF
- Fluxo completo de aprovação

---

# Organização dos Arquivos no Google Drive

```
Ano
│
└── Aluno - Série
    │
    └── Bimestre
        │
        ├── Docs
        │     └── PEI.docx
        │
        └── PDF
              └── PEI.pdf
```

---

# Segurança

- Controle de acesso por perfil
- Validação dos dados no frontend
- Validação no backend
- Controle de responsáveis em cada etapa
- Identificação dos documentos por UUID

---

# Autor

**Nayana Heslley Barbosa Oliveira**

Projeto desenvolvido como solução para informatização do processo de elaboração e aprovação dos Planos Educacionais Individualizados da Escola Estadual Professor Eusébio de Paula Marcondes.
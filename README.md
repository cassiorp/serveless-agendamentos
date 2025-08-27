# Serveless Agendamentos — README

## Requisitos (local)

* Node.js 18+ (recomendado 20)
* npm 9+
* Serverless Framework:

  ```bash
  npm i -g serverless
  ```

## Como rodar local

```bash
npm install
sls offline
```

* **Agendas (GET)**: `http://localhost:3000/agendas`
* **Agendamento (POST)**: `http://localhost:3000/agendamento`
* **Swagger UI**: `http://localhost:3000/docs`
* **OpenAPI (spec)**: `http://localhost:3000/docs/openapi`

## Docs do deploy (AWS)

* **Swagger (deploy)**: [https://u382onlvxi.execute-api.us-east-1.amazonaws.com/docs](https://u382onlvxi.execute-api.us-east-1.amazonaws.com/docs)

## Regras de `/agendamento`

* ❌ Se faltar `id`, `medico`, `paciente` **ou** `dataHorario` → **throw** `"Payload inválido: id, medico, paciente e data_horario são obrigatórios."`
* ❌ Se `AgendaService.buscarPorId(id)` **não retornar agenda** → **throw** `"Médico não encontrado."`
* ❌ Se `dataHorario` **não** estiver em `medicoAgenda.horariosDisponiveis` → **throw** `"Horário indisponível para este médico."`
* ✅ Caso passe nas validações:

  * salva o agendamento (`repository.save`)
  * remove o horário da agenda (`agendaService.excluirHorario`)
  * retorna o DTO do agendamento criado.

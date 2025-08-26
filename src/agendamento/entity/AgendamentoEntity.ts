export class AgendamentoEntity {
  medico!: string;
  paciente!: string;
  dataHorario!: string;
  constructor(init?: Partial<AgendamentoEntity>) {
    Object.assign(this, init);
  }
}

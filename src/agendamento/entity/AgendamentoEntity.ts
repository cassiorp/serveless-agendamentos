export class AgendamentoEntity {
  id!: number;
  medico!: string;
  paciente!: string;
  dataHorario!: string;
  constructor(init?: Partial<AgendamentoEntity>) {
    Object.assign(this, init);
  }
}

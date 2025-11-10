export type ProjectStatus = 'Concluído' | 'Em Andamento' | 'Pendente' | 'Cancelado' | 'Atrasado';

export interface Project {
  id: string; // Combination of IDM and IDE
  idm: string;
  ide: string;
  name: string; // from ENTREGA
  status: ProjectStatus;
  executionPercentage: number;
  superintendencia: string;
  setor: string;
  interlocutor: string;
  secretariat: string; // e.g. SESAU
}

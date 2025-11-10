import { faker } from '@faker-js/faker';
import type { Project, ProjectStatus } from '../types';
import { SECRETARIATS } from './constants';

const PROJECT_STATUSES: ProjectStatus[] = ['Concluído', 'Em Andamento', 'Pendente', 'Cancelado', 'Atrasado'];

const SUPERINTENDENCIAS_MOCK = [
    'SRAS - Superintendência da Rede de Assistência a Saúde',
    'SUPRIS - Superintendência de Relações Institucionais de Saúde',
    'CRAE - Coordenadoria de Atenção Especializada',
    'CRAPS - Coordenadoria da Rede de Atenção Primária à Saúde',
    'CRAUE - Coordenadoria da Rede de Atenção às Urgências e Emergências'
];

const SETORES_MOCK = [
    'Ana Paula Resende',
    'Gloria de Araujo Pereira',
    'Ana Paula Cangussu Silva Rosa Pires',
    'Michely de Souza Nogueira',
    'Ana Paula de Souza Borges Bueno',
    'Andreia Souza Pinto da Silva'
];

export const generateMockData = (count: number): Project[] => {
  const projects: Project[] = [];
  for (let i = 0; i < count; i++) {
    projects.push({
      id: faker.string.uuid(),
      idm: `M${faker.number.int({ min: 1, max: 3 })}`,
      ide: `SAU.${faker.number.int({ min: 1, max: 3 })}.${faker.number.int({ min: 1, max: 9 })}${faker.helpers.arrayElement(['A', 'B', 'C', ''])}`,
      name: faker.lorem.sentence({ min: 5, max: 10 }),
      secretariat: faker.helpers.arrayElement(SECRETARIATS),
      status: faker.helpers.arrayElement(PROJECT_STATUSES),
      executionPercentage: faker.number.float({ min: 0, max: 100, precision: 0.01 }),
      superintendencia: faker.helpers.arrayElement(SUPERINTENDENCIAS_MOCK),
      setor: faker.helpers.arrayElement(SETORES_MOCK),
      interlocutor: faker.person.fullName(),
    });
  }
  return projects;
};

export const MOCK_PROJECTS = generateMockData(50);

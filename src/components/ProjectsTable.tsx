import React from 'react';
import { Project } from '../types';
import { StatusBadge } from './ui/StatusBadge';

interface ProjectsTableProps {
  projects: Project[];
}

export const ProjectsTable: React.FC<ProjectsTableProps> = ({ projects }) => {
  const recentProjects = projects.slice(0, 10);

  return (
    <div className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-xl p-6">
      <h3 className="text-lg font-semibold mb-4">Entregas Recentes</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-border/50 text-sm text-muted-foreground">
              <th className="py-3 px-4 font-medium">IDE</th>
              <th className="py-3 px-4 font-medium">Entrega</th>
              <th className="py-3 px-4 font-medium">Superintendência</th>
              <th className="py-3 px-4 font-medium">Status</th>
              <th className="py-3 px-4 font-medium text-right">% Exec.</th>
            </tr>
          </thead>
          <tbody>
            {recentProjects.map((project) => (
              <tr key={project.id} className="border-b border-border/30 hover:bg-muted/30 transition-colors">
                <td className="py-3 px-4 text-sm font-mono text-primary">{project.ide}</td>
                <td className="py-3 px-4 text-sm font-medium text-foreground">{project.name}</td>
                <td className="py-3 px-4 text-sm text-muted-foreground">{project.superintendencia}</td>
                <td className="py-3 px-4">
                  <StatusBadge status={project.status} />
                </td>
                <td className="py-3 px-4 text-sm text-muted-foreground font-bold text-right">{project.executionPercentage.toFixed(2)}%</td>
              </tr>
            ))}
             {recentProjects.length === 0 && (
                <tr>
                    <td colSpan={5} className="text-center py-8 text-muted-foreground">
                        Nenhum dado para exibir. Importe uma planilha para começar.
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

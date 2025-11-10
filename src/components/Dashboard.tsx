import React, { useMemo } from 'react';
import type { Project, ProjectStatus } from '../types';
import { KpiCard } from './ui/Card';
import BaseChart from './charts/BaseChart';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { FileText, CheckCircle, Clock, Percent, User } from 'lucide-react';
import { ProjectsTable } from './ProjectsTable';
import { ECOption } from 'echarts-for-react/lib/types';

interface DashboardProps {
  projects: Project[];
  selectedSecretariats: string[];
}

const CHART_COLORS = {
  primary: 'hsl(217.2, 91.2%, 59.8%)',
  foreground: 'hsl(210, 40%, 98%)',
  mutedForeground: 'hsl(215, 20.2%, 65.1%)',
  card: 'hsl(224, 71.4%, 4.1%)',
};

const STATUS_COLORS: Record<ProjectStatus, string> = {
  'Concluído': '#22c55e',
  'Em Andamento': '#3b82f6',
  'Pendente': '#f97316',
  'Atrasado': '#ef4444',
  'Cancelado': '#9ca3af',
};

const Dashboard: React.FC<DashboardProps> = ({ projects }) => {
  
  const totalProjects = projects.length;
  const averageExecution = projects.length > 0 ? projects.reduce((sum, p) => sum + p.executionPercentage, 0) / projects.length : 0;
  const completedProjects = projects.filter(p => p.status === 'Concluído').length;
  const ongoingProjects = projects.filter(p => p.status === 'Em Andamento').length;

  const executionBySuperintendencia = useMemo(() => {
    const bySuperintendencia: { [key: string]: { total: number; count: number } } = {};
    projects.forEach((project) => {
      const key = project.superintendencia.split(' - ')[0] || project.superintendencia;
      if (!bySuperintendencia[key]) {
        bySuperintendencia[key] = { total: 0, count: 0 };
      }
      bySuperintendencia[key].total += project.executionPercentage;
      bySuperintendencia[key].count++;
    });

    const sorted = Object.entries(bySuperintendencia).sort((a, b) => (b[1].total / b[1].count) - (a[1].total / a[1].count));
    const labels = sorted.map(item => item[0]);
    const data = sorted.map(item => parseFloat((item[1].total / item[1].count).toFixed(2)));
    
    return { labels, data };
  }, [projects]);

  const statusDistributionData = useMemo(() => {
    const statusOrder: ProjectStatus[] = ['Concluído', 'Em Andamento', 'Atrasado', 'Pendente', 'Cancelado'];
    const byStatus = projects.reduce((acc, project) => {
      acc[project.status] = (acc[project.status] || 0) + 1;
      return acc;
    }, {} as Record<ProjectStatus, number>);
    
    return statusOrder.map(status => ({
      value: byStatus[status] || 0,
      name: status,
      itemStyle: { color: STATUS_COLORS[status] }
    }));
  }, [projects]);

  const executionChartOption: ECOption = {
    title: { text: 'Execução Média por Superintendência', left: 'center', textStyle: { color: CHART_COLORS.foreground, fontSize: 16 } },
    tooltip: { trigger: 'axis', formatter: '{b}: {c}%' },
    xAxis: { type: 'category', data: executionBySuperintendencia.labels, axisLabel: { color: CHART_COLORS.mutedForeground, interval: 0, rotate: 20 } },
    yAxis: { type: 'value', axisLabel: { color: CHART_COLORS.mutedForeground, formatter: '{value}%' } },
    series: [{
      type: 'bar',
      data: executionBySuperintendencia.data,
      itemStyle: { color: CHART_COLORS.primary }
    }],
    grid: { bottom: 80 }
  };

  const statusDistributionChartOption: ECOption = {
    title: { text: 'Distribuição por Status', left: 'center', textStyle: { color: CHART_COLORS.foreground, fontSize: 16 } },
    tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
    legend: { show: false },
    series: [{
      type: 'pie',
      radius: ['50%', '75%'],
      avoidLabelOverlap: false,
      itemStyle: { borderRadius: 8, borderColor: CHART_COLORS.card, borderWidth: 4 },
      label: { show: false },
      emphasis: { label: { show: true, fontSize: '18', fontWeight: 'bold', color: CHART_COLORS.foreground } },
      data: statusDistributionData,
    }],
  };

  return (
      <main className="flex-1 p-6 space-y-6 overflow-y-auto">
        <div className="flex justify-between items-center h-[53px]">
            <div>
                <h2 className="text-3xl font-bold">Bem-vindo, Admin!</h2>
                <p className="text-muted-foreground">
                    {format(new Date(), "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR })}
                </p>
            </div>
            <div className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-muted rounded-full flex items-center justify-center ring-2 ring-primary/50">
                    <User className="h-6 w-6 text-muted-foreground" />
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <KpiCard title="Total de Entregas" value={totalProjects.toString()} icon={<FileText className="h-6 w-6 text-white"/>} gradient="bg-gradient-to-br from-blue-500 to-blue-600" />
          <KpiCard title="Execução Média" value={`${averageExecution.toFixed(1)}%`} icon={<Percent className="h-6 w-6 text-white"/>} gradient="bg-gradient-to-br from-purple-500 to-purple-600" />
          <KpiCard title="Entregas Concluídas" value={completedProjects.toString()} icon={<CheckCircle className="h-6 w-6 text-white"/>} gradient="bg-gradient-to-br from-green-500 to-green-600" />
          <KpiCard title="Em Andamento" value={ongoingProjects.toString()} icon={<Clock className="h-6 w-6 text-white"/>} gradient="bg-gradient-to-br from-orange-500 to-orange-600" />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3 bg-card/80 backdrop-blur-sm border border-border/50 rounded-xl p-4 h-[400px]">
            <BaseChart option={executionChartOption} />
          </div>
          <div className="lg:col-span-2 bg-card/80 backdrop-blur-sm border border-border/50 rounded-xl p-4 h-[400px]">
            <BaseChart option={statusDistributionChartOption} />
          </div>
        </div>

        <div className="grid grid-cols-1">
            <ProjectsTable projects={projects} />
        </div>
      </main>
  );
};

export default Dashboard;

import React from 'react';
import { ProjectStatus } from '../../types';
import { cn } from '../../lib/utils';
import { CheckCircle, Clock, XCircle, AlertTriangle, PauseCircle } from 'lucide-react';

interface StatusBadgeProps {
  status: ProjectStatus;
}

const statusConfig = {
  'Concluído': {
    label: 'Concluído',
    icon: <CheckCircle className="h-3 w-3" />,
    className: 'bg-green-500/20 text-green-400',
  },
  'Em Andamento': {
    label: 'Em Andamento',
    icon: <Clock className="h-3 w-3" />,
    className: 'bg-blue-500/20 text-blue-400',
  },
  'Pendente': {
    label: 'Pendente',
    icon: <PauseCircle className="h-3 w-3" />,
    className: 'bg-yellow-500/20 text-yellow-400',
  },
  'Atrasado': {
    label: 'Atrasado',
    icon: <AlertTriangle className="h-3 w-3" />,
    className: 'bg-orange-500/20 text-orange-400',
  },
  'Cancelado': {
    label: 'Cancelado',
    icon: <XCircle className="h-3 w-3" />,
    className: 'bg-red-500/20 text-red-400',
  },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const config = statusConfig[status] || statusConfig['Pendente'];

  return (
    <div className={cn('flex items-center gap-2 text-xs font-medium px-2.5 py-1 rounded-full', config.className)}>
      {config.icon}
      <span>{config.label}</span>
    </div>
  );
};

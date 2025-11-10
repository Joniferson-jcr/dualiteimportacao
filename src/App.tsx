import React, { useState, useMemo } from 'react';
import Dashboard from './components/Dashboard';
import Sidebar from './components/Sidebar';
import { MOCK_PROJECTS } from './lib/mockData';
import { Project } from './types';

function App() {
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedSecretariats, setSelectedSecretariats] = useState<string[]>([]);
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);

  const toggleSidebar = () => setSidebarCollapsed(!isSidebarCollapsed);

  const handleDataImported = (importedProjects: Project[]) => {
    setProjects(importedProjects);
    setSelectedSecretariats([]); // Limpa os filtros para exibir todos os novos dados
  };

  const filteredProjects = useMemo(() => {
    if (selectedSecretariats.length === 0) {
      return projects;
    }
    return projects.filter((p) => selectedSecretariats.includes(p.secretariat));
  }, [selectedSecretariats, projects]);

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      <Sidebar 
        isCollapsed={isSidebarCollapsed}
        toggleSidebar={toggleSidebar}
        selectedSecretariats={selectedSecretariats}
        setSelectedSecretariats={setSelectedSecretariats}
        clearFilters={() => setSelectedSecretariats([])}
        onDataImported={handleDataImported}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Dashboard projects={filteredProjects} selectedSecretariats={selectedSecretariats} />
      </div>
    </div>
  );
}

export default App;

import React, { useRef } from 'react';
import { ChevronsLeft, ChevronsRight, Landmark, LogOut, FileUp } from 'lucide-react';
import { SECRETARIATS } from '../lib/constants';
import { cn } from '../lib/utils';
import * as XLSX from 'xlsx';
import { Project, ProjectStatus } from '../types';

interface SidebarProps {
  isCollapsed: boolean;
  toggleSidebar: () => void;
  selectedSecretariats: string[];
  setSelectedSecretariats: React.Dispatch<React.SetStateAction<string[]>>;
  clearFilters: () => void;
  onDataImported: (data: Project[]) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, toggleSidebar, selectedSecretariats, setSelectedSecretariats, clearFilters, onDataImported }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'array', cellDates: true });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        
        const json = XLSX.utils.sheet_to_json<any>(worksheet, { header: 1 });
        if (json.length < 2) {
          throw new Error("A planilha está vazia ou em formato inválido.");
        }
        
        const headers: string[] = json[0];
        const dataRows = json.slice(1);

        const execHeader = headers.find(h => typeof h === 'string' && h.toLowerCase().startsWith('% exec'));
        if (!execHeader) {
          alert('Erro de importação: A coluna de percentual de execução (ex: "% EXEC AGOSTO") não foi encontrada.');
          return;
        }

        const importedProjects: Project[] = dataRows.map((rowArray: any[]) => {
          const rowData = headers.reduce((obj, header, index) => {
              if(header) obj[header] = rowArray[index];
              return obj;
          }, {} as Record<string, any>);

          const name = rowData['ENTREGA'];
          const statusStr = rowData['STATUS'];
          const percentageStr = rowData[execHeader];
          const superintendencia = rowData['SUPERINTENDÊNCIA'];
          const idm = rowData['IDM'];
          const ide = rowData['IDE'];
          const setor = rowData['SETOR'];
          const interlocutor = rowData['INTERLOCUTOR'];

          if (!name || !statusStr || !superintendencia || !ide) {
            console.warn('Linha ignorada por falta de dados essenciais (ENTREGA, STATUS, SUPERINTENDÊNCIA, IDE):', rowData);
            return null;
          }

          let status: ProjectStatus;
          const lowerStatus = String(statusStr).toLowerCase();
          if (lowerStatus.includes('andamento')) status = 'Em Andamento';
          else if (lowerStatus.includes('atrasad')) status = 'Atrasado';
          else if (lowerStatus.includes('concluído')) status = 'Concluído';
          else if (lowerStatus.includes('cancelado')) status = 'Cancelado';
          else status = 'Pendente';

          const executionPercentage = parseFloat(String(percentageStr || '0').replace('%', '').replace(',', '.')) || 0;
          
          // Adicionando a Secretaria principal. No futuro, isso pode ser selecionado pelo usuário.
          const mainSecretariat = SECRETARIATS.find(s => superintendencia.includes(s.split(' - ')[1])) || 'Secretaria Municipal de Saúde - SESAU';

          return {
            id: `${idm}-${ide}`,
            idm,
            ide,
            name,
            status,
            executionPercentage,
            superintendencia,
            setor,
            interlocutor,
            secretariat: mainSecretariat,
          };
        }).filter((p): p is Project => p !== null);

        onDataImported(importedProjects);
        alert(`${importedProjects.length} projetos importados com sucesso!`);

      } catch (error) {
        console.error("Erro ao importar a planilha:", error);
        alert(`Ocorreu um erro ao importar a planilha. Verifique o formato do arquivo e se os cabeçalhos esperados (IDM, IDE, ENTREGA, STATUS, % EXEC..., SUPERINTENDÊNCIA, etc.) estão corretos. Detalhe: ${error.message}`);
      }
    };
    reader.readAsArrayBuffer(file);
    event.target.value = '';
  };

  return (
    <aside className={cn(
      "bg-card/50 border-r border-border/50 backdrop-blur-lg flex flex-col transition-all duration-300 ease-in-out",
      isCollapsed ? "w-20" : "w-80"
    )}>
      <div className="flex items-center justify-between p-4 border-b border-border/50 h-[85px]">
        {!isCollapsed && (
          <div className="flex items-center space-x-3">
            <Landmark className="h-7 w-7 text-primary" />
            <h1 className="text-xl font-bold text-foreground">SEPPE</h1>
          </div>
        )}
        <button onClick={toggleSidebar} className="p-2 rounded-md hover:bg-muted">
          {isCollapsed ? <ChevronsRight className="h-5 w-5" /> : <ChevronsLeft className="h-5 w-5" />}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <h3 className={cn("text-sm font-semibold text-muted-foreground", isCollapsed ? "text-center" : "px-2")}>
          {isCollapsed ? "Filtros" : "Filtrar por Secretaria"}
        </h3>
        <div className="space-y-2">
          {SECRETARIATS.map((sec) => (
            <div key={sec} className={cn("flex items-center", isCollapsed && "justify-center")}>
              <input
                type="checkbox"
                id={`cb-${sec}`}
                checked={selectedSecretariats.includes(sec)}
                onChange={() => {
                  setSelectedSecretariats(
                    selectedSecretariats.includes(sec)
                      ? selectedSecretariats.filter((s) => s !== sec)
                      : [...selectedSecretariats, sec]
                  );
                }}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary shrink-0"
              />
              {!isCollapsed && (
                <label htmlFor={`cb-${sec}`} className="ml-3 text-sm text-muted-foreground cursor-pointer hover:text-foreground transition-colors">
                  {sec.split(' - ')[1] || sec}
                </label>
              )}
            </div>
          ))}
        </div>
      </div>
      
      <div className="p-4 border-t border-border/50 space-y-4">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept=".xlsx, .xls, .csv"
        />
        <button
          onClick={handleImportClick}
          className={cn(
            "w-full bg-green-600/90 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2",
            isCollapsed && "py-3"
          )}
        >
          <FileUp className="h-4 w-4" />
          {!isCollapsed && "Importar Planilha"}
        </button>
        <button
          onClick={clearFilters}
          className={cn(
            "w-full bg-primary/90 hover:bg-primary text-primary-foreground font-bold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2",
            isCollapsed && "py-3"
          )}
        >
          {!isCollapsed && "Limpar Filtros"}
        </button>
        <button className={cn(
          "w-full bg-muted hover:bg-accent text-muted-foreground font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2",
          isCollapsed && "py-3"
        )}>
          <LogOut className="h-4 w-4" />
          {!isCollapsed && "Sair"}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

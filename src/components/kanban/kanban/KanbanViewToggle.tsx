import React from 'react';
import { LayoutGrid, List } from 'lucide-react';
import Button from '@/components/ui/button/Button';

type Props = {
  viewMode: 'kanban' | 'table';
  setViewMode: (mode: 'kanban' | 'table') => void;
};

export function KanbanViewToggle({ viewMode, setViewMode }: Props) {
  return (
    <div className="flex gap-2">
      <Button
        size="sm"
        variant={viewMode === 'kanban' ? 'primary' : 'outline'}
        startIcon={<LayoutGrid size={16} />}
        onClick={() => setViewMode('kanban')}
        className="px-4 py-3"
      >
        Kanban
      </Button>
      <Button
        size="sm"
        variant={viewMode === 'table' ? 'primary' : 'outline'}
        startIcon={<List size={16} />}
        onClick={() => setViewMode('table')}
        className="px-4 py-3"
      >
        Table
      </Button>
    </div>
  );
}
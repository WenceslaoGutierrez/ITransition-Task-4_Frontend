import type { ChangeEvent } from 'react';
import { Button } from './button';
import { Input } from './input';
import { Lock, LockOpen, Trash } from 'lucide-react';

interface ActionsToolbarProps {
  onBlockClick?: () => void;
  onUnblockClick?: () => void;
  onDeleteClick?: () => void;
  filterValue?: string;
  onFilterChange?: (filterValue: string) => void;
  disableActions?: boolean;
}

export function ActionsToolbar({ onBlockClick, onUnblockClick, onDeleteClick, filterValue, onFilterChange, disableActions }: ActionsToolbarProps) {
  const handleFilterInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (onFilterChange) {
      onFilterChange(event.target.value);
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-center md:justify-between gap-4 py-4 bg-gray-50 px-4 rounded-t-md">
      <div className="flex items-center gap-2">
        <Button variant="outline" onClick={onBlockClick} className="border-blue-500 border-2 text-blue-500" aria-label="Block" disabled={disableActions}>
          <Lock className="mr-1 h-4 w-4 " /> Block
        </Button>
        <Button variant="outline" size="icon" onClick={onUnblockClick} className="border-blue-500 border-2 text-blue-500" aria-label="Unblock" disabled={disableActions}>
          <LockOpen className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={onDeleteClick} className="border-red-500 border-2 text-red-500" aria-label="Delete" disabled={disableActions}>
          <Trash className="h-4 w-4" />
        </Button>
      </div>
      <div>
        <Input type="text" placeholder="Filter users by email..." value={filterValue} onChange={handleFilterInputChange} className="max-w-sm bg-white" />
      </div>
    </div>
  );
}

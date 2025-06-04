import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/ui/NavBar';
import { UserTable, type UserData, columns as userTableColumnsDefinition } from '@/components/UserTable/UserTable';
import { ActionsToolbar } from '@/components/ui/ActionsToolbar';
import { useAuth } from '@/contexts/AuthContext';
import * as userService from '@/services/userService';
import { type RowSelectionState, type SortingState } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import Spinner from '@/components/ui/Spinner';
import { toast } from 'react-toastify';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';

export default function DashboardPage() {
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const [emailFilter, setEmailFilter] = useState('');
  const [users, setUsers] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isConfirmDeleteDialogOpen, setIsConfirmDeleteDialogOpen] = useState(false);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [sorting, setSorting] = useState<SortingState>([{ id: 'last_login_date', desc: true }]);

  const fetchUsers = useCallback(async () => {
    if (!token) {
      setError('Authentication required. Please log in.');
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const currentSortBy = sorting.length > 0 ? sorting[0].id : undefined;
      const currentSortOrder = sorting.length > 0 ? (sorting[0].desc ? 'DESC' : 'ASC') : undefined;
      const data = await userService.getAllUsers(token, currentSortBy, currentSortOrder);
      setUsers(data.users || []);
    } catch (err: any) {
      console.error('Failed to fetch users:', err);
      setError(err.message || 'Could not load user data.');
      if (err.message.toLowerCase().includes('unauthorized') || err.message.toLowerCase().includes('token') || err.status === 401 || err.status === 403) {
        logout();
        navigate('/auth');
      }
    } finally {
      setIsLoading(false);
    }
  }, [token, sorting, logout, navigate]);
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const selectedUserIds = useMemo(() => {
    return Object.keys(rowSelection)
      .filter((indexStr) => rowSelection[indexStr])
      .map((indexStr) => users[parseInt(indexStr)]?.id)
      .filter((id) => id !== undefined) as number[];
  }, [rowSelection, users]);

  const executeConfirmedDelete = async () => {
    if (!token || selectedUserIds.length === 0) {
      toast.warn('No users selected for deletion.');
      setIsConfirmDeleteDialogOpen(false);
      return;
    }
    setIsConfirmDeleteDialogOpen(false);
    setIsLoading(true);
    try {
      await userService.deleteMultipleUsers(token, selectedUserIds);
      toast.success(`Deleted ${selectedUserIds.length} user(s) successfully.`);
      setRowSelection({});
      fetchUsers();
    } catch (err: any) {
      console.error(`Error during delete action:`, err);
      const errorMessage = err.message || `Failed to delete users.`;
      setError(errorMessage);
      toast.error(`Error: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAction = async (actionType: 'block' | 'unblock' | 'delete') => {
    if (!token || selectedUserIds.length === 0) {
      toast.warn('Please select users to perform this action.');
      return;
    }

    let actionPromise;
    let successMessage = '';

    if (actionType === 'block') {
      actionPromise = userService.updateMultipleUsersStatus(token, selectedUserIds, 'blocked');
      successMessage = `Blocked ${selectedUserIds.length} user(s) successfully.`;
    } else if (actionType === 'unblock') {
      actionPromise = userService.updateMultipleUsersStatus(token, selectedUserIds, 'active');
      successMessage = `Unblocked ${selectedUserIds.length} user(s) successfully.`;
    } else if (actionType === 'delete') {
      if (actionType === 'delete') {
        setIsConfirmDeleteDialogOpen(true);
        return;
      }
    } else {
      return;
    }

    try {
      setIsLoading(true);
      await actionPromise;
      toast.success(successMessage);
      setRowSelection({});
      fetchUsers();
    } catch (err: any) {
      const errorMessage = err.message || 'An unexpected error occurred.';
      const lowerCaseErrorMessage = errorMessage.toLowerCase();
      if (
        lowerCaseErrorMessage.includes('unauthorized') ||
        lowerCaseErrorMessage.includes('token') ||
        lowerCaseErrorMessage.includes('forbidden') ||
        lowerCaseErrorMessage.includes('blocked')
      ) {
        toast.info('Redirecting to login page...');
        logout();
        navigate('/auth');
      } else {
        setError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && users.length === 0) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-grow container mx-auto flex items-center justify-center">
          <Spinner />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ActionsToolbar
          onBlockClick={() => handleAction('block')}
          onUnblockClick={() => handleAction('unblock')}
          onDeleteClick={() => handleAction('delete')}
          filterValue={emailFilter}
          onFilterChange={setEmailFilter}
          disableActions={selectedUserIds.length === 0}
        />
        {error && (
          <div className="my-4 p-4 bg-red-100 text-red-700 border border-red-400 rounded">
            <p>Error: {error}</p>
            <Button onClick={fetchUsers} variant="link" className="p-0 h-auto text-red-700">
              Try again
            </Button>
          </div>
        )}

        {!isLoading && users.length === 0 && !error && <p className="text-center py-10">No users found.</p>}

        {(!error || users.length > 0) && !isLoading && (
          <UserTable
            columns={userTableColumnsDefinition}
            data={users}
            rowSelection={rowSelection}
            setRowSelection={setRowSelection}
            sorting={sorting}
            setSorting={setSorting}
            emailFilterApplied={emailFilter}
          />
        )}
      </main>
      <AlertDialog open={isConfirmDeleteDialogOpen} onOpenChange={setIsConfirmDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the selected user(s) and remove their data from the servers. ({selectedUserIds.length} user(s) will be
              deleted)
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsConfirmDeleteDialogOpen(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={executeConfirmedDelete}>Yes, delete user(s)</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

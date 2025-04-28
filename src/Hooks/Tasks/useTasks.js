// ==========================================================================
//  useTasks  –  centralised task data / actions  (no circular deps)
// ==========================================================================

import { useCallback, useEffect, useState, useRef } from 'react';
import { useSnack } from '../../Providers/Utils/SnackbarProvider';
import { useMyUser } from '../../Providers/Users/UserProvider';
import useAxios from '../useAxios';

import {
  createTask,
  deleteTask,
  editTask,
  MyTasks,
  TaskById,
} from '../../Services/Tasks/tasksApiService';

import {

  addTaskToGroup
} from '../../Services/Groups/groupsApiService';

import normalizeTask from '../../Helpers/Tasks/normalizeTask';
import seedDatabase from '../../Helpers/General/seedDatabase';


export default function useTasks() {
  const snack = useSnack();       // <— THIS is the toast function
  const { user } = useMyUser();
  useAxios();                            // attach Axios interceptors

  /* ---------- state ---------- */
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isInitializing, setInitializing] = useState(false);
  const [error, setError] = useState(null);

  const loaderIdRef = useRef(null);

  /* ---------- fetch all ---------- */
  const getAllMyTasks = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const data = await MyTasks();
      setTasks(data ?? []);
      return data ?? [];
    } catch (e) { setError(e); return []; }
    finally { setLoading(false); }
  }, []);

  /* ---------- demo seeder ---------- */
  const initialiseTasks = useCallback(async () => {
    return seedDatabase({
      snack,
      user,
      setInitializing,
      setError,
      setLoading,
      loaderIdRef
    });
  }, [user, snack]);
  /* ---------- first load ---------- */
  useEffect(() => {
    if (user && user._id) {
      (async () => {
        if ((await getAllMyTasks()).length === 0) {
          await initialiseTasks();
          await getAllMyTasks();
        }
      })();
    }
  }, [getAllMyTasks, initialiseTasks,user]);

  /* ---------- CRUD wrappers ---------- */
  const getTaskById = useCallback(async (id) => {
    setLoading(true); setError(null);
    try {
      const data = await TaskById(id);
      setTask(data);
      return data;
    } catch (e) { setError(e); return null; }
    finally { setLoading(false); }
  }, []);

  const handleCreateCard = useCallback(
    async (input, groupId = null) => {
      setLoading(true);
      setError(null);
      try {
        const made = await createTask(normalizeTask(input));
        setTasks(prev => [...prev, made]);

        if (groupId) {
          try {
            await addTaskToGroup(groupId, made._id);
          } catch (linkErr) {
            console.error('🔗 addTaskToGroup failed:', linkErr);
            snack('error', 'Task created but failed to add to selected group');
          }
        }

        snack('success', 'Task created');
        return made;
      } catch (e) {
        setError(e);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [snack]
  );

  const handleUpdateCard = useCallback(
    async (id, input, options = {}) => {
      setLoading(true); setError(null);
      try {
        const upd = await editTask(id, normalizeTask(input));
        setTasks(prev => prev.map(t => (t._id === id ? upd : t)));
        if (task?._id === id) setTask(upd);
        if (!options.silent) snack('success', 'Task updated');
        return upd;
      } catch (e) {
        setError(e);
        throw e;    // <-- re-throw so onCheckboxChange can catch
      } finally {
        setLoading(false);
      }
    },
    [task, snack]
  );


  const handleDeleteCard = useCallback(async (id, skipConfirmation = false) => {
    const taskToDelete = tasks.find(t => t._id === id);
    if (taskToDelete?.isRoot) {
      snack('warning', 'The root task cannot be deleted.');
      console.warn(`[useTasks] Attempted to delete root task (ID: ${id}). Operation blocked.`);
      return false; // Prevent deletion
    }
    if (!skipConfirmation && !window.confirm('Delete this task?')) return false;
    setLoading(true); setError(null);
    try {
      await deleteTask(id);
      setTasks(prev => prev.filter(t => t._id !== id));
      snack('success', 'Task deleted');
      return true;
    } catch (e) { setError(e); return false; }
    finally { setLoading(false); }
  }, [snack, tasks]);

  /* ---------- public API ---------- */
  return {
    tasks, task, error,
    loading,
    isInitializing,          // show spinner/backdrop when true
    getAllMyTasks, getTaskById,
    handleCreateCard, handleUpdateCard, handleDeleteCard,
    initialiseTasks,
  };
}

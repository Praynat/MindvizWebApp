// ==========================================================================
//  useTasks  –  centralised task data / actions  (no circular deps)
// ==========================================================================

import { useCallback, useEffect, useState, useRef } from 'react';
import { useSnack }      from '../../Providers/Utils/SnackbarProvider';
import { useMyUser }     from '../../Providers/Users/UserProvider';
import useAxios          from '../useAxios';

import {
  createTask,
  deleteTask,
  editTask,
  MyTasks,
  TaskById,
} from '../../Services/Tasks/tasksApiService';

import {
  fetchMyGroups,
  createGroup,
  addTaskToGroup            // <- raw service (no React hook)
} from '../../Services/Groups/groupsApiService';

import normalizeTask   from '../../Helpers/Tasks/normalizeTask';
import initialTestData from '../../Data/MindMapping/initialTestModel.json';

/* ────────────────────────────────────────────────────────────────── */
/*  utilities                                                         */
/* ────────────────────────────────────────────────────────────────── */
const SEED_FLAG = 'mindviz:tasksSeeded';
const STALE_MS  = 30_000;

const readFlag = () => {
  const raw = localStorage.getItem(SEED_FLAG);
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return { state: raw }; }
};

const safeCreateTask = async (task) => {
  try {
    return await createTask(task);
  } catch (e) {
    if (e.response?.status === 500 &&
        /duplicate|primary key|pk_tasks/i.test(JSON.stringify(e.response.data))) {
      console.warn(`↪ ${task._id} already exists — skipping`);
      return null;
    }
    throw e;
  }
};

const safeLinkTask = async (groupId, taskId) => {
  const res = await addTaskToGroup(groupId, taskId);
  if (res.ok || res.status === 204) return;

  if (res.status === 409) return;                        // already linked
  if (res.status === 500) {
    const txt = await res.text();
    if (/duplicate|primary key|pk_groups_tasks/i.test(txt)) return;
  }
  throw new Error(`Link task failed ${res.status}: ${await res.text()}`);
};

const getOrCreatePersonalGroup = async (displayName) => {
  /* 1. look through the groups you already own */
  const groups = await fetchMyGroups();

  const existing = groups.find(g => g.name === displayName);
  if (existing) {
    // different back-end responses use different field names – be tolerant
    return existing.id ?? existing._id ?? existing.groupId;
  }

  /* 2. nothing found ⇒ create a fresh one */
  const g = await createGroup({
    name:        displayName,
    description: 'Your personal tasks',
  });

  // again: hand back *whichever* id field the API returned
  return g.id ?? g._id ?? g.groupId;
};

/* ────────────────────────────────────────────────────────────────── */
/*  main hook                                                         */
/* ────────────────────────────────────────────────────────────────── */
export default function useTasks() {
  const snack       = useSnack();       // <— THIS is the toast function
  const { user }    = useMyUser();
  useAxios();                            // attach Axios interceptors

  /* ---------- state ---------- */
  const [tasks, setTasks]         = useState([]);
  const [task,  setTask]          = useState(null);
  const [loading,      setLoading]      = useState(true);
  const [isInitializing, setInitializing] = useState(false);
  const [error,        setError]        = useState(null);

  const loaderIdRef = useRef(null);

  /* ---------- fetch all ---------- */
  const getAllMyTasks = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const data = await MyTasks();
      setTasks(data ?? []);
      return data ?? [];
    } catch (e) { setError(e); return []; }
    finally     { setLoading(false); }
  }, []);

  /* ---------- demo seeder ---------- */
  const initialiseTasks = useCallback(async () => {
    const flag = readFlag();
    const now  = Date.now();

    if (flag?.state === 'done' && (await MyTasks()).length) return;

    if (flag?.state === 'in-progress') {
      if (now - (flag.started ?? 0) < STALE_MS) {
        while (readFlag()?.state === 'in-progress') {
          await new Promise(r => setTimeout(r, 400));
        }
        return;
      }
      localStorage.removeItem(SEED_FLAG);
    }

    localStorage.setItem(SEED_FLAG, JSON.stringify({ state: 'in-progress', started: now }));

    try {
      setInitializing(true);
      loaderIdRef.current = snack('info', 'Setting up your workspace…', { persist: true });

      const display = user?.displayName || user?.name || 'My Tasks';
      const groupId = await getOrCreatePersonalGroup(display);

      const existingIds = new Set((await MyTasks()).map(t => t._id));
      const toInsert    = initialTestData.filter(t => !existingIds.has(t._id));

      const newIds = [];
      for (const raw of toInsert) {
        const made = await safeCreateTask(normalizeTask(raw));
        if (made) newIds.push(made._id);
      }

      for (const id of [...existingIds, ...newIds]) {
        await safeLinkTask(groupId, id);
      }

      snack(
        'success',
        newIds.length ? `${newIds.length} demo task(s) added` : 'Workspace ready',
        { dismiss: loaderIdRef.current }
      );
      localStorage.setItem(SEED_FLAG, JSON.stringify({ state: 'done' }));
    } catch (e) {
      setError(e);
      snack('error', 'Failed to initialise demo data', { dismiss: loaderIdRef.current });
      localStorage.removeItem(SEED_FLAG);
    } finally {
      setInitializing(false);
      setLoading(false);
    }
  }, [user, snack]);

  /* ---------- first load ---------- */
  useEffect(() => {
    (async () => {
      if ((await getAllMyTasks()).length === 0) {
        await initialiseTasks();
        await getAllMyTasks();
      }
    })();
  }, [getAllMyTasks, initialiseTasks]);

  /* ---------- CRUD wrappers ---------- */
  const getTaskById = useCallback(async (id) => {
    setLoading(true); setError(null);
    try {
      const data = await TaskById(id);
      setTask(data);
      return data;
    } catch (e) { setError(e); return null; }
    finally     { setLoading(false); }
  }, []);

  const handleCreateCard = useCallback(async (input) => {
    setLoading(true); setError(null);
    try {
      const made = await createTask(normalizeTask(input));
      setTasks(prev => [...prev, made]);
      snack('success', 'Task created');
      return made;
    } catch (e) { setError(e); return null; }
    finally     { setLoading(false); }
  }, [snack]);

  const handleUpdateCard = useCallback(async (id, input) => {
    setLoading(true); setError(null);
    try {
      const upd = await editTask(id, normalizeTask(input));
      setTasks(prev => prev.map(t => (t._id === id ? upd : t)));
      if (task?._id === id) setTask(upd);
      snack('success', 'Task updated');
      return upd;
    } catch (e) { setError(e); return null; }
    finally     { setLoading(false); }
  }, [task, snack]);

  const handleDeleteCard = useCallback(async (id) => {
    const taskToDelete = tasks.find(t => t._id === id);
    if (taskToDelete?.isRoot) {
      snack('warning', 'The root task cannot be deleted.');
      console.warn(`[useTasks] Attempted to delete root task (ID: ${id}). Operation blocked.`);
      return false; // Prevent deletion
    }
    if (!window.confirm('Delete this task?')) return false;
    setLoading(true); setError(null);
    try {
      await deleteTask(id);
      setTasks(prev => prev.filter(t => t._id !== id));
      snack('success', 'Task deleted');
      return true;
    } catch (e) { setError(e); return false; }
    finally     { setLoading(false); }
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

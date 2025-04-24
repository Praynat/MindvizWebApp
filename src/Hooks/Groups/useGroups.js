// ─────────────────────────────────────────────────────────────────────────────
//  src/Hooks/Groups/useGroups.js
//  Centralised hook that exposes groups, members and the *tasks that
//  belong to a group*, plus all related CRUD helpers.
// ─────────────────────────────────────────────────────────────────────────────
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSnack } from '../../Providers/Utils/SnackbarProvider'; // Import useSnack
import { useMyUser } from '../../Providers/Users/UserProvider';

import {
  fetchMyGroups,
  fetchGroupById, // <--- Import fetchGroupById
  createGroup as apiCreateGroup,
  updateGroup as apiUpdateGroup,
  deleteGroup as apiDeleteGroup,
  addMember as apiAddMember,
  removeMember as apiRemoveMember,
  updateMemberRole as apiUpdateMemberRole,
  addTaskToGroup as apiAddTask,
  removeTaskFromGroup as apiRemoveTask,
  assignTaskToMember as apiAssignTask,
  unassignTaskFromMember as apiUnassignTask
} from '../../Services/Groups/groupsApiService';

import useTasks from '../Tasks/useTasks';          // ← default export ✔
import normalizeTask from '../../Helpers/Tasks/normalizeTask';

/* ───────── helper ───────── */
const normalise = g => ({ ...g, id: String(g.id ?? g._id ?? g.groupId) });

/* ──────────────────────────────────────────────────────────────────────────── */
export function useGroups() {
  /* ------------------------------------------------------ user / tasks ---- */
  const { user } = useMyUser();
  const {
    tasks: allTasks, // <--- Get all tasks from useTasks
    handleCreateCard: createTask          // ← real POST from useTasks
  } = useTasks();
  const snack = useSnack(); // <--- Initialize useSnack

  /* --------------------------------------------------------- list state --- */
  const [groups, setGroups] = useState([]);
  const [listLoading, setListLoading] = useState(false);
  const [listError, setListError] = useState(null);

  /* ------------------------------------------------------ detail state ---- */
  const [selectedId, setSelectedId] = useState(null);
  const [members, setMembers] = useState([]);
  const [groupLinks, setGroupLinks] = useState([]);   // rows from GroupTask
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState(null);
  const [selectedGroupContainsRootTask, setSelectedGroupContainsRootTask] = useState(false); // <-- New state

  /* ---------------------------- derive TaskModel[] for currently selected */
  const tasks = useMemo(() => {
    if (!groupLinks?.length) return [];
    const ids = new Set(groupLinks.map(g => g.taskId));
    return allTasks.filter(t => ids.has(t._id));
  }, [groupLinks, allTasks]);
  /* ── does this group contain the root task? ── */
  useEffect(() => {
    setSelectedGroupContainsRootTask(tasks.some(t => t.isRoot));
  }, [tasks]);
  // --- Find the root task ID ---
  const rootTaskId = useMemo(() => {
    const rootTask = allTasks.find(t => t.isRoot);
    return rootTask?._id;
  }, [allTasks]);
  // ---

  /* ====================================================================== */
  /*  LIST – fetch every group that belongs to me                           */
  /* ====================================================================== */
  const fetchGroups = useCallback(async () => {
    setListLoading(true); setListError(null);
    try {
      const raw = await fetchMyGroups();
      const list =
        Array.isArray(raw) ? raw :
          Array.isArray(raw.$values) ? raw.$values :
            Array.isArray(raw.data?.$values) ? raw.data.$values :
              Array.isArray(raw.data) ? raw.data : [];
      setGroups(list.map(normalise));
    } catch (err) {
      setListError(err);
    } finally {
      setListLoading(false);
    }
  }, []);

  /* ====================================================================== */
  /*  DETAILS – whenever selectedId changes                                 */
  /* ====================================================================== */
  const fetchDetails = useCallback(async () => {
    if (!selectedId) {
      setMembers([]);
      setGroupLinks([]);
      setSelectedGroupContainsRootTask(false); // Reset when no group is selected
      return;
    }
    setDetailLoading(true);
    setDetailError(null);
    setSelectedGroupContainsRootTask(false); // Reset before fetching
    try {
      const raw = await fetchGroupById(selectedId);
      const group = normalise(raw);

      const currentMembers = Array.isArray(group.members) ? group.members : [];
      const currentLinks = Array.isArray(group.tasks) ? group.tasks : [];

      setMembers(currentMembers);
      setGroupLinks(currentLinks);

      // --- Check if fetched links contain the root task ---
      if (rootTaskId) {
        const containsRoot = currentLinks.some(link => link.taskId === rootTaskId);
        setSelectedGroupContainsRootTask(containsRoot);
        if (containsRoot) {
          console.log(`[useGroups] Selected group ${selectedId} contains the root task.`);
        }
      }
      // --- End check ---

    } catch (err) {
      setDetailError(err);
      setMembers([]); // Clear on error
      setGroupLinks([]);
      setSelectedGroupContainsRootTask(false); // Reset on error
    } finally {
      setDetailLoading(false);
    }
  }, [selectedId, rootTaskId]); // Add rootTaskId dependency

  /* ---------------------------------------------------- mount / selection */
  useEffect(() => { fetchGroups(); }, [fetchGroups]);
  useEffect(() => { fetchDetails(); }, [fetchDetails]);

  /* ====================================================================== */
  /*  GROUP CRUD                                                            */
  /* ====================================================================== */
  const createGroup = useCallback(async payload => {
    const g = normalise(await apiCreateGroup(payload));
    setGroups(p => [...p, g]);
    setSelectedId(g.id);
    return g;
  }, []);

  const updateGroup = useCallback(async (id, payload) => {
    const g = normalise(await apiUpdateGroup(id, payload));
    setGroups(p => p.map(x => (x.id === id ? g : x)));
    return g;
  }, []);

  const deleteGroup = useCallback(async id => {
    // --- Check if group contains the root task ---
    if (rootTaskId) {
      // This check remains important as a final safeguard before API call
      try {
        const groupDetails = await fetchGroupById(id);
        const groupTaskLinks = Array.isArray(groupDetails?.tasks) ? groupDetails.tasks : [];
        const containsRootTask = groupTaskLinks.some(link => link.taskId === rootTaskId);
        if (containsRootTask) {
          snack('warning', 'This group contains the root task and cannot be deleted.');
          return false;
        }
      } catch (error) {
        console.error(`[useGroups] Error fetching group details for delete check (ID: ${id}):`, error);
        snack('error', 'Could not verify group contents before deletion. Please try again.');
        return false;
      }
    }
    // --- End check ---

    try {
      // Optimistic UI update
      setGroups(p => p.filter(x => x.id !== id));
      if (selectedId === id) {
        setSelectedId(null); // This will trigger fetchDetails to clear state
      }

      await apiDeleteGroup(id);
      snack('success', 'Group deleted successfully');
      return true;
    } catch (error) {
      snack('error', `Failed to delete group: ${error.message || 'Server error'}`);
      fetchGroups();
      return false;
    }
  }, [selectedId, rootTaskId, snack, fetchGroups, groups]);

  /* ====================================================================== */
  /*  MEMBER OPS (auto-refresh)                                             */
  /* ====================================================================== */
  const addMember = useCallback((email, isAdmin) =>
    apiAddMember(selectedId, { email, isAdmin }).then(fetchDetails),
    [selectedId, fetchDetails]);

  const removeMember = useCallback(memberId =>
    apiRemoveMember(selectedId, memberId).then(fetchDetails),
    [selectedId, fetchDetails]);

  const updateRole = useCallback((memberId, isAdmin) =>
    apiUpdateMemberRole(selectedId, memberId, isAdmin).then(fetchDetails),
    [selectedId, fetchDetails]);

  /* ====================================================================== */
  /*  TASK OPS (auto-refresh)                                               */
  /* ====================================================================== */
  const addTask = useCallback(taskId =>
    apiAddTask(selectedId, taskId).then(fetchDetails),
    [selectedId, fetchDetails]);

  const removeTask = useCallback(taskId =>
    apiRemoveTask(selectedId, taskId).then(fetchDetails),
    [selectedId, fetchDetails]);

  const assignTask = useCallback((taskId, memberId) =>
    apiAssignTask(selectedId, taskId, memberId).then(fetchDetails),
    [selectedId, fetchDetails]);

  const unassignTask = useCallback((taskId, memberId) =>
    apiUnassignTask(selectedId, taskId, memberId).then(fetchDetails),
    [selectedId, fetchDetails]);

  /* ====================================================================== */
  /*  COMPOSITE – create group **with** root task                           */
  /* ====================================================================== */
  const createGroupWithRootTask = useCallback(async ({ name, description }) => {
    const group = await createGroup({ name, description });

    const rootTask = await createTask(
      normalizeTask({
        name,
        description: `Root task for ${name}`,
        type: 'Category',
        parentIds: [],
        childrenIds: []
      })
    );

    await apiAddTask(group.id, rootTask._id);
    await fetchDetails();
    return { group, rootTask };
  }, [createGroup, createTask, fetchDetails]);

  /* ====================================================================== */
  /*  ensure personal “My Tasks” group                                      */
  /* ====================================================================== */
  const ensurePersonalGroup = useCallback(async () => {
    const display = user?.displayName || user?.name || 'My Tasks';
    const existing = groups.find(g => g.name === display);
    if (existing) return existing.id;
    const g = await createGroup({ name: display, description: 'Your personal tasks' });
    return g.id;
  }, [groups, user, createGroup]);

  /* ====================================================================== */
  /*  HELPERS                                                                */
  /* ====================================================================== */
  const getGroupIdByTaskId = useCallback(async (taskId) => {
    for (const grp of groups) {
      try {
        const raw       = await fetchGroupById(grp.id);
        const taskLinks = Array.isArray(raw.tasks) ? raw.tasks : [];
        if (taskLinks.some(link => link.taskId === taskId)) {
          return grp.id;
        }
      } catch (err) {
        console.error(`[useGroups] error loading group ${grp.id}:`, err);
      }
    }
    return null;
  }, [groups]);

  /* ====================================================================== */
  /*  PUBLIC API                                                            */
  /* ====================================================================== */
  return {
    /* helpers */
    getGroupIdByTaskId,    // ← newly added

    /* list info */
    groups, listLoading, listError, fetchGroups,
    createGroup, updateGroup, deleteGroup,

    /* selection / details */
    selectedId, setSelectedId,
    members, tasks, detailLoading, detailError,
    selectedGroupContainsRootTask,

    /* member ops */
    addMember, removeMember, updateRole,

    /* task ops */
    addTask, removeTask, assignTask, unassignTask,

    /* composite */
    createGroupWithRootTask,
    ensurePersonalGroup
  };
}

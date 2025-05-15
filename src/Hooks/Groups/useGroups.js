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
  fetchGroupById,
  fetchGroupTasks,
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

import { getUserData } from '../../Services/Users/usersApiService';
import useTasks from '../Tasks/useTasks';
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
  const [selectedGroupContainsRootTask, setSelectedGroupContainsRootTask] = useState(false); 
  const [tasksInGroup, setTasksInGroup] = useState([]); // ← full TaskModel[]

  /* ── whenever selectedId changes, load the full TaskModel[] ── */
  useEffect(() => {
    if (!selectedId) {
      setTasksInGroup([]);
      return;
    }
    setDetailLoading(true);
    fetchGroupTasks(selectedId)
      .then(data => {
        setTasksInGroup(Array.isArray(data) ? data : []);
        setDetailError(null);
      })
      .catch(err => setDetailError(err))
      .finally(() => setDetailLoading(false));
  }, [selectedId]);

  /* ── track if the root task is in this group ── */
  useEffect(() => {
    setSelectedGroupContainsRootTask(
      tasksInGroup.some(t => t.isRoot)
    );
  }, [tasksInGroup]);

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

      list.sort((a, b) => {
        if (a.name === 'My Tasks') return -1;
        if (b.name === 'My Tasks') return 1;
        if (a.name === 'Development Team') return -1;
        if (b.name === 'Development Team') return 1;
        return a.name.localeCompare(b.name);
      });

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
   const getAllGroupTasksByGroupId = useCallback(async (groupId) => {

    try {
      const data = await fetchGroupTasks(groupId);
      return data;
    } catch (e) { }
  }, []);
  const fetchDetails = useCallback(async () => {
    if (!selectedId) {
      setMembers([]);
      setGroupLinks([]);
      setTasksInGroup([]);
      return;
    }
    setDetailLoading(true);
    try {
      const raw = await fetchGroupById(selectedId);
      const group = normalise(raw);

      const links = Array.isArray(group.tasks) ? group.tasks : [];
      const members = Array.isArray(group.members) ? group.members : [];

      // fetch each user’s full data
      const membersWithUser = await Promise.all(
        members.map(async m => {
          const user = await getUserData(m.userId);
          return { ...m, user };
        })
      );

      setGroupLinks(links);
      setMembers(membersWithUser);
      const tasks = await getAllGroupTasksByGroupId(selectedId);
      setTasksInGroup(tasks);

    } catch (err) {
      setDetailError(err);
      setMembers([]);
      setGroupLinks([]);
    } finally {
      setDetailLoading(false);
    }
  }, [selectedId, getAllGroupTasksByGroupId]);
  // ---------------------------------------------------- mount / selection */
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
  }, [selectedId, rootTaskId, snack, fetchGroups]);

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
 

  const addTask = useCallback(
    taskId => apiAddTask(selectedId, taskId)
      .then(() => fetchGroupTasks(selectedId))
      .then(setTasksInGroup),
    [selectedId]
  );

  const removeTask = useCallback(
    taskId => apiRemoveTask(selectedId, taskId)
      .then(() => fetchGroupTasks(selectedId))
      .then(setTasksInGroup),
    [selectedId]
  );

  const assignTask = useCallback(
    (taskId, memberId) => apiAssignTask(selectedId, taskId, memberId)
      .then(() => fetchGroupTasks(selectedId))
      .then(setTasksInGroup),
    [selectedId]
  );

  const unassignTask = useCallback(
    (taskId, memberId) => apiUnassignTask(selectedId, taskId, memberId)
      .then(() => fetchGroupTasks(selectedId))
      .then(setTasksInGroup),
    [selectedId]
  );

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
        const raw = await fetchGroupById(grp.id);
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
    getGroupIdByTaskId, 
    refreshGroupTasks: fetchDetails,

    /* list info */
    groups, listLoading, listError, fetchGroups,
    createGroup, updateGroup, deleteGroup,

    /* selection / details */
    selectedId, setSelectedId,
    members, groupLinks, tasks: tasksInGroup, detailLoading, detailError,
    selectedGroupContainsRootTask,

    /* member ops */
    addMember, removeMember, updateRole,

    /* task ops */
    getAllGroupTasksByGroupId,
    addTask, removeTask, assignTask, unassignTask,

    /* composite */
    createGroupWithRootTask,
    ensurePersonalGroup
  };
}

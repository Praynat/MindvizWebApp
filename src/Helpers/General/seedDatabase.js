import { signup } from '../../Services/Users/usersApiService';
import normalizeUser from '../../Helpers/Users/normalization/normalizeUser'; import {
  createTask,
  MyTasks
} from '../../Services/Tasks/tasksApiService';

import {
  fetchMyGroups,
  createGroup,
  addTaskToGroup
} from '../../Services/Groups/groupsApiService';

import normalizeTask from '../Tasks/normalizeTask';
import initialTestData from '../../Data/MindMapping/initialTestModel.json';

// Define constants that were previously in useTasks.js
const SEED_FLAG = 'mindviz:tasksSeeded';
const STALE_MS = 30_000;

// Include helper functions that were in useTasks.js
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
  try {
    await addTaskToGroup(groupId, taskId);
  } catch (e) {
    const status = e.response?.status;
    // already linked
    if (status === 409) return;
    // duplicate PK on 500
    if (status === 500 &&
      /duplicate|primary key|pk_groups_tasks/i.test(JSON.stringify(e.response.data))) {
      return;
    }
    throw e;
  }
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
    name: displayName,
    description: 'Your personal tasks',
  });

  // again: hand back *whichever* id field the API returned
  return g.id ?? g._id ?? g.groupId;
};

/**
 * Seeds the database with initial tasks, users, and groups
 * @param {Object} options - Configuration options
 * @param {Function} options.snack - Notification function
 * @param {Object} options.user - Current user
 * @param {Function} options.setInitializing - State setter for initialization flag
 * @param {Function} options.setError - State setter for error state
 * @param {Function} options.setLoading - State setter for loading state
 * @param {Object} options.loaderIdRef - Ref for loader ID
 * @returns {Promise<boolean>} Success indicator
 */
const seedDatabase = async ({
  snack,
  user,
  setInitializing,
  setError,
  setLoading,
  loaderIdRef
}) => {
  const flag = readFlag();
  const now = Date.now();

  if (flag?.state === 'done' && (await MyTasks()).length) return true;

  if (flag?.state === 'in-progress') {
    if (now - (flag.started ?? 0) < STALE_MS) {
      while (readFlag()?.state === 'in-progress') {
        await new Promise(r => setTimeout(r, 400));
      }
      return true;
    }
    localStorage.removeItem(SEED_FLAG);
  }

  localStorage.setItem(SEED_FLAG, JSON.stringify({ state: 'in-progress', started: now }));

  try {
    setInitializing(true);
    loaderIdRef.current = snack(
      "info",
      "Setting up your workspace…",
      {
        persist: true,
        anchorOrigin: { vertical: "bottom", horizontal: "right" },
        autoHideDuration: null   // stay open until dismissed
      }
    );

    // 1. Create the current user's personal group
    const display = user?.displayName || user?.name || 'My Tasks';
    const personalGroupId = await getOrCreatePersonalGroup(display);

    // 2. Create seed users
    const seedUsers = [
      {
        first: "Alice",
        middle: "",
        last: "Johnson",
        phone: "050-123-4567",
        email: "alice@example.com",
        password: "Password1!",
        url: "https://randomuser.me/api/portraits/women/42.jpg",
        alt: "Alice profile",
        state: "CA",
        country: "USA",
        city: "San Francisco",
        street: "Tech Avenue",
        houseNumber: 101,
        zip: 94105,
        isBusiness: true
      },
      {
        first: "Bob",
        middle: "",
        last: "Smith",
        phone: "050-765-4321",
        email: "bob@example.com",
        password: "Password1!",
        url: "https://randomuser.me/api/portraits/men/42.jpg",
        alt: "Bob profile",
        state: "WA",
        country: "USA",
        city: "Seattle",
        street: "Cloud Street",
        houseNumber: 202,
        zip: 98101,
        isBusiness: false
      },
      {
        first: "Carol",
        middle: "",
        last: "Williams",
        phone: "050-321-7654",
        email: "carol@example.com",
        password: "Password1!",
        url: "https://randomuser.me/api/portraits/women/24.jpg",
        alt: "Carol profile",
        state: "NY",
        country: "USA",
        city: "New York",
        street: "Data Drive",
        houseNumber: 303,
        zip: 10001,
        isBusiness: true
      }
    ];

    // Create users if they don't already exist
    for (const userData of seedUsers) {
      try {
        const normalizedUser = normalizeUser(userData);
        await signup(normalizedUser);
        console.log(`Created seed user: ${userData.email}`);
      } catch (err) {
        // If user already exists, that's fine
        if (err.message.includes('duplicate') || err.message.includes('already exists')) {
          console.log(`User ${userData.email} already exists`);
        } else {
          console.error(`Failed to create seed user ${userData.email}:`, err);
        }
      }
    }

    // 3. Create additional groups for Development and Marketing teams
    const additionalGroups = [
      {
        name: "Development Team",
        description: "Tasks for software development projects"
      },
      {
        name: "Marketing Projects",
        description: "Tasks related to marketing campaigns"
      }
    ];

    // Create the groups and store their IDs
    const groupIds = [personalGroupId];
    for (const groupData of additionalGroups) {
      try {
        const group = await createGroup(groupData);
        groupIds.push(group.id ?? group._id ?? group.groupId);
      } catch (err) {
        console.warn(`Failed to create group ${groupData.name}:`, err);
      }
    }

    // 4. Add tasks and link them to the appropriate groups
    const existingIds = new Set((await MyTasks()).map(t => t._id));
    const taskMap = Object.fromEntries(initialTestData.map(t => [t._id, t]));
    const rootIds = ['ROOT-01', 'ROOT-DEV', 'ROOT-MKT'];
    for (const rootId of rootIds) {
      if (!existingIds.has(rootId)) {
        const rawRoot = taskMap[rootId];
        if (rawRoot) {
          const payload = normalizeTask(rawRoot);
          payload.userId = user._id;
          const created = await safeCreateTask(payload);
          if (created) existingIds.add(created._id);
        }
      }
    }


    function isDescendantOf(id, rootId) {
      const t = taskMap[id];
      if (!t || !t.parentIds) return false;
      if (t.parentIds.includes(rootId)) return true;
      return t.parentIds.some(pid => isDescendantOf(pid, rootId));
    }

    const personalTasks = initialTestData
      .filter(t => t._id !== "ROOT-01"
        && isDescendantOf(t._id, "ROOT-01")
        && !existingIds.has(t._id)
      );

    const devTasks = initialTestData
      .filter(t => t._id !== "ROOT-DEV"
        && isDescendantOf(t._id, "ROOT-DEV")
        && !existingIds.has(t._id)
      );

    const marketingTasks = initialTestData
      .filter(t => t._id !== "ROOT-MKT"
        && isDescendantOf(t._id, "ROOT-MKT")
        && !existingIds.has(t._id)
      );


    // Create all tasks
    const newPersonalIds = [];
    for (const raw of personalTasks) {
      const taskPayload = normalizeTask(raw);
      taskPayload.userId = user._id;
      const made = await safeCreateTask(taskPayload);
      if (made) newPersonalIds.push(made._id);
    }

    const newDevIds = [];
    for (const raw of devTasks) {
      const taskPayload = normalizeTask(raw);
      taskPayload.userId = user._id;
      const made = await safeCreateTask(taskPayload);
      if (made) newDevIds.push(made._id);
    }

    const newMarketingIds = [];
    for (const raw of marketingTasks) {
      const taskPayload = normalizeTask(raw);
      taskPayload.userId = user._id;
      const made = await safeCreateTask(taskPayload);
      if (made) newMarketingIds.push(made._id);
    }

    const personalLinkIds = new Set([
      'ROOT-01',
      ...newPersonalIds,
      ...[...existingIds].filter(id => isDescendantOf(id, 'ROOT-01'))
    ]);
    
    for (const id of personalLinkIds) {
      await safeLinkTask(personalGroupId, id);
    }
    
    // ─── Ensure ROOT-DEV is in the Development group ───
    if (groupIds.length > 1) {
      const devGroupId = groupIds[1];
      await safeLinkTask(devGroupId, 'ROOT-DEV');
      for (const id of newDevIds) {
        await safeLinkTask(devGroupId, id);
      }
    }
    
    // ─── Ensure ROOT-MKT is in the Marketing group ───
    if (groupIds.length > 2) {
      const mktGroupId = groupIds[2];
      await safeLinkTask(mktGroupId, 'ROOT-MKT');
      for (const id of newMarketingIds) {
        await safeLinkTask(mktGroupId, id);
      }
    }

    // Success message
    const totalNewTasks = newPersonalIds.length + newDevIds.length + newMarketingIds.length;
    snack(
      'success',
      totalNewTasks ? `${totalNewTasks} demo task(s) added` : 'Workspace ready',
      { dismiss: loaderIdRef.current }
    );
    localStorage.setItem(SEED_FLAG, JSON.stringify({ state: 'done' }));


    setTimeout(() => {
      snack(
        "info",
        "Refreshing page to load new data…",
        { anchorOrigin: { vertical: "bottom", horizontal: "right" } }
      );

      // Force a complete page refresh after a brief delay
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    }, 1000);

    return true;
  } catch (e) {
    setError(e);
    snack('error', 'Failed to initialize demo data', { dismiss: loaderIdRef.current });
    localStorage.removeItem(SEED_FLAG);
    return false;
  } finally {
    setInitializing(false);
    setLoading(false);
  }
};

export default seedDatabase;
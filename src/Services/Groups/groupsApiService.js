// src/Services/Groups/groupsApiService.js

import { getToken } from '../Users/localStorageService';

const API_BASE = 'https://localhost:7048/Groups';

function authHeader() {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${getToken()}`,
  };
}

/* ─── Group CRUD ─────────────────────────────────────────────────────────── */

// GET /Groups/my-groups
export async function fetchMyGroups() {
  const res = await fetch(`${API_BASE}/my-groups`, {
    headers: authHeader(),
  });
  return res.json();
}

// GET /Groups/{id}
export async function fetchGroupById(id) {
  const res = await fetch(`${API_BASE}/${id}`, {
    headers: authHeader(),
  });
  return res.json();
}

// POST /Groups
export async function createGroup(payload) {
  // build a body that matches your C# JsonPropertyName attributes
  const body = {
    name:        payload.name,
    description: payload.description,
    
  };
  console.log('POST /Groups payload →', body);
  const res = await fetch(`${API_BASE}`, {
    method:  'POST',
    headers: authHeader(),
    body:    JSON.stringify(body)
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`POST /Groups failed ${res.status}: ${text}`);
  }
  return res.json();
}

// PUT /Groups/{id}
export async function updateGroup(id, payload) {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: 'PUT',
    headers: authHeader(),
    body: JSON.stringify(payload),
  });
  return res.json();
}

// DELETE /Groups/{id}
export async function deleteGroup(id) {
  if (!id) {
    throw new Error('Cannot delete group: ID is undefined');
  }
  const res = await fetch(`${API_BASE}/${id}`, {
    method: 'DELETE',
    headers: authHeader()
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`DELETE /Groups/${id} failed: ${res.status} ${text}`);
  }
  return res.json();
}

/* ─── Member Operations ─────────────────────────────────────────────────── */

// POST /Groups/{groupId}/members
// body: { Email: string, IsAdmin: boolean }
export async function addMember(groupId, { email, isAdmin }) {
  return fetch(`${API_BASE}/${groupId}/members`, {
    method: 'POST',
    headers: authHeader(),
    body: JSON.stringify({ Email: email, IsAdmin: isAdmin }),
  });
}

// DELETE /Groups/{groupId}/members/{memberId}
export async function removeMember(groupId, memberId) {
  return fetch(`${API_BASE}/${groupId}/members/${memberId}`, {
    method: 'DELETE',
    headers: authHeader(),
  });
}

// PUT /Groups/{groupId}/members/{memberId}/admin
// body: { IsAdmin: boolean }
export async function updateMemberRole(groupId, memberId, isAdmin) {
  return fetch(`${API_BASE}/${groupId}/members/${memberId}/admin`, {
    method: 'PUT',
    headers: authHeader(),
    body: JSON.stringify({ IsAdmin: isAdmin }),
  });
}

/* ─── Task Operations ────────────────────────────────────────────────────── */

// POST /Groups/{groupId}/tasks/{taskId}
export async function addTaskToGroup(groupId, taskId) {
  return fetch(`${API_BASE}/${groupId}/tasks/${taskId}`, {
    method: 'POST',
    headers: authHeader(),
  });
}

// DELETE /Groups/{groupId}/tasks/{taskId}
export async function removeTaskFromGroup(groupId, taskId) {
  return fetch(`${API_BASE}/${groupId}/tasks/${taskId}`, {
    method: 'DELETE',
    headers: authHeader(),
  });
}

// POST /Groups/{groupId}/tasks/{taskId}/assign/{memberId}
export async function assignTaskToMember(groupId, taskId, memberId) {
  return fetch(
    `${API_BASE}/${groupId}/tasks/${taskId}/assign/${memberId}`,
    {
      method: 'POST',
      headers: authHeader(),
    }
  );
}

// DELETE /Groups/{groupId}/tasks/{taskId}/assign/{memberId}
export async function unassignTaskFromMember(groupId, taskId, memberId) {
  return fetch(
    `${API_BASE}/${groupId}/tasks/${taskId}/assign/${memberId}`,
    {
      method: 'DELETE',
      headers: authHeader(),
    }
  );
}

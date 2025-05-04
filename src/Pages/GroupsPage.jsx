import React, { useEffect, useMemo, useState } from 'react';
import { useMyUser } from '../Providers/Users/UserProvider';
import {
    Grid, Paper, Box, Typography, Button, Tabs, Tab,
    TableContainer, Table, TableHead, TableRow, TableCell, TableBody,
    IconButton, Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, FormControlLabel, Checkbox, FormControl,
    InputLabel, Select, MenuItem, LinearProgress,
    Avatar, Divider, Chip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import TaskIcon from '@mui/icons-material/Task';
import styles from './Css/GroupsPage.module.css';
import { useGroups } from '../Hooks/Groups/useGroups';
import Tooltip from '@mui/material/Tooltip';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import ROUTES from '../Routes/routesModel';

// ────────────────────────────────────────────────────────────────────
const GroupsPage = () => {
    const { user } = useMyUser();

    /* data hook ------------------------------------------------------ */
    const {
        groups, listLoading, listError,
        updateGroup, deleteGroup,
        selectedId, setSelectedId,
        members, tasks, detailLoading, detailError,
        addMember, removeMember, updateRole,
        addTask, removeTask, assignTask, unassignTask,
        selectedGroupContainsRootTask, createGroupWithRootTask, getAllGroupTasksByGroupId
    } = useGroups();

    /* local UI state ------------------------------------------------- */
    const [selectedTab, setSelectedTab] = useState(0);
    const [taskFilter, setTaskFilter] = useState('');  // '' = all

    const [addGroupOpen, setAddGroupOpen] = useState(false);
    const [editGroupOpen, setEditGroupOpen] = useState(false);
    const [confirmDeleteGroupOpen, setConfirmDeleteGroupOpen] = useState(false);

    const [newGroupName, setNewGroupName] = useState('');
    const [newGroupDesc, setNewGroupDesc] = useState('');
    const [editGroupName, setEditGroupName] = useState('');
    const [editGroupDesc, setEditGroupDesc] = useState('');

    const [addMemberOpen, setAddMemberOpen] = useState(false);
    const [newMemberEmail, setNewMemberEmail] = useState('');
    const [newMemberIsAdmin, setNewMemberIsAdmin] = useState(false);
    const [confirmDeleteMemberOpen, setConfirmDeleteMemberOpen] = useState(false);
    const [confirmRoleChangeOpen, setConfirmRoleChangeOpen] = useState(false);
    const [memberToChangeRole, setMemberToChangeRole] = useState(null);

    const [addTaskOpen, setAddTaskOpen] = useState(false);
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [confirmDeleteTaskOpen, setConfirmDeleteTaskOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    /* derived helpers ------------------------------------------------ */
    const [groupTasks, setGroupTasks] = useState([]);
    const selectedGroup = groups?.find(g => g.id === selectedId) || null;
    const filteredTasks = groupTasks.filter(t =>
        taskFilter ? t.assignee === taskFilter : true);

    /* handlers – groups --------------------------------------------- */
    const handleGroupSelect = id => {
        setSelectedId(id);
        setSelectedTab(0);
    };

    const handleCreateGroup = async () => {
        await createGroupWithRootTask({ name: newGroupName, description: newGroupDesc });
        setAddGroupOpen(false);
        setNewGroupName(''); setNewGroupDesc('');
    };

    const handleOpenEditGroup = () => {
        if (!selectedGroup) return;
        setEditGroupName(selectedGroup.name);
        setEditGroupDesc(selectedGroup.description || '');
        setEditGroupOpen(true);
    };

    const handleUpdateGroupDetails = async () => {
        await updateGroup(selectedId, { name: editGroupName, description: editGroupDesc });
        setEditGroupOpen(false);
    };

    const handleConfirmDeleteGroup = async () => {
        await deleteGroup(selectedId);
        setConfirmDeleteGroupOpen(false);
    };

    /* handlers – members -------------------------------------------- */
    const handleAddMemberConfirm = async () => {
        await addMember(newMemberEmail, newMemberIsAdmin);
        setAddMemberOpen(false);
        setNewMemberEmail(''); setNewMemberIsAdmin(false);
    };

    const handleConfirmDeleteMember = async () => {
        await removeMember(itemToDelete);
        setConfirmDeleteMemberOpen(false); setItemToDelete(null);
    };

    const handleConfirmRoleChange = async () => {
        await updateRole(memberToChangeRole.userId,
            memberToChangeRole.newRole === 'Admin');
        setConfirmRoleChangeOpen(false); setMemberToChangeRole(null);
    };

    /* handlers – tasks ---------------------------------------------- */
    const handleAddTaskConfirm = async () => {
        await addTask({ taskId: newTaskTitle, createdBy: user.id });
        setAddTaskOpen(false); setNewTaskTitle('');
    };

    const handleConfirmDeleteTask = async () => {
        await removeTask(itemToDelete);
        setConfirmDeleteTaskOpen(false); setItemToDelete(null);
    };

    const handleAssignTaskChange = async (taskId, uid) => {
        if (uid) {
          await assignTask(taskId, uid);
        } else {
          await unassignTask(taskId, uid);
        }
      
        setGroupTasks(prev =>
          prev.map(t =>
            t._id === taskId
              ? { ...t, assignee: uid }
              : t
          )
        );
      };

    /* ──────────────────────────────────────────────────────────────── */
    /* render helpers – Users table*/
    const renderUsersList = () => {
        const currentUserId = user.id ?? user._id;
        const selectedGroupCreator = selectedGroup?.creator_id ?? null;
        const currentMember = members.find(
            m => m.userId === currentUserId
                || m.user?._id === currentUserId
        );
        const isCurrentCreator = currentUserId === selectedGroupCreator;
        const isCurrentAdmin = isCurrentCreator || Boolean(currentMember?.isAdmin);
        function rank(m) {
            if (m.userId === selectedGroupCreator) return 0;
            if (m.userId === currentUserId) return 1;
            return 2;
        }
        const sortedMembers = [...members].sort((a, b) => {
            return rank(a) - rank(b);
        });
        return (
            <Box>
                <Box className={styles.listHeader}>
                    <Typography variant="h6">Members</Typography>
                    <Tooltip
                        title="Only admins can add new members"
                        disableHoverListener={isCurrentAdmin}
                    >
                        <span>
                            <Button
                                variant="contained"
                                startIcon={<PersonAddIcon />}
                                onClick={() => setAddMemberOpen(true)}
                                disabled={!selectedGroup || !isCurrentAdmin}
                            >
                                Add Member
                            </Button>
                        </span>
                    </Tooltip>
                </Box>

                <TableContainer component={Paper}>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Edit Role</TableCell>
                                <TableCell align="right">Remove from group</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {sortedMembers.map(m => {
                                const isGroupCreator = m.userId === selectedGroupCreator;
                                const isRowSelf = m.userId === currentUserId;

                                const canModify = members.length > 1
                                    && (
                                        isCurrentCreator
                                            ? !isRowSelf
                                            : isCurrentAdmin
                                                ? !isGroupCreator
                                                : false
                                    );
                                const tooltipMsg = !canModify
                                    ? isRowSelf && isCurrentCreator
                                        ? "You cannot modify yourself"
                                        : isGroupCreator && isCurrentAdmin
                                            ? "Admins cannot modify the group creator"
                                            : !isCurrentAdmin
                                                ? "Only admins can modify members"
                                                : ""
                                    : "";
                                const u = m.user || {};

                                let displayName = '';
                                if (u.name && typeof u.name === 'object') {
                                    displayName = [
                                        u.name.first,
                                        u.name.last
                                    ].filter(Boolean).join(' ');
                                } else {
                                    displayName = u.name
                                        || u.displayName
                                        || u.email
                                        || m.email
                                        || 'Unknown User';
                                }

                                const safeName = String(displayName);
                                const avatarChar = safeName.charAt(0);
                                const avatarSrc = u.avatarUrl || u.avatar || '';
                                const displayRole = m.role || (m.isAdmin ? 'Admin' : 'Member');

                                return (
                                    <TableRow key={m.userId} >
                                        <TableCell>
                                            <Box display="flex" alignItems="center">
                                                <Avatar src={avatarSrc} sx={{ mr: 1 }}>
                                                    {avatarChar}
                                                </Avatar>
                                                <Box display="flex" alignItems="center">
                                                    <Typography>{safeName}</Typography>

                                                    {isGroupCreator && <Chip label="Creator" size="small" color="warning" sx={{ ml: 1 }} />}
                                                    {m.isAdmin && !isGroupCreator && <Chip label="Admin" size="small" color="primary" sx={{ ml: 1 }} />}
                                                    {!isGroupCreator && !m.isAdmin && <Chip label="Member" size="small" color="default" sx={{ ml: 1 }} />}
                                                    {isRowSelf && <Chip label="You" size="small" sx={{ ml: 1, backgroundColor: 'lightgreen', color: 'black' }} />}
                                                </Box>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            {u.email || m.email || '—'}
                                        </TableCell>
                                        <TableCell>
                                            <Tooltip title={tooltipMsg} disableHoverListener={canModify}>
                                                <Box display="flex" alignItems="center">

                                                    <FormControl
                                                        variant="standard"
                                                        size="small"
                                                        sx={{ ml: 1, minWidth: 80 }}
                                                        disabled={!canModify}
                                                    >
                                                        <Select
                                                            value={displayRole}
                                                            onChange={e => {
                                                                setMemberToChangeRole({ userId: m.userId, newRole: e.target.value });
                                                                setConfirmRoleChangeOpen(true);
                                                            }}
                                                            disableUnderline
                                                        >
                                                            <MenuItem value="Member">Member</MenuItem>
                                                            <MenuItem value="Admin">Admin</MenuItem>
                                                        </Select>
                                                    </FormControl>
                                                </Box>
                                            </Tooltip>
                                        </TableCell>
                                        <TableCell align="right">
                                            <Tooltip title={tooltipMsg} disableHoverListener={canModify}>
                                                <span>
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => {
                                                            setItemToDelete(m.userId);
                                                            setConfirmDeleteMemberOpen(true);
                                                        }}
                                                        disabled={!canModify}
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </span>
                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        );
    };

    useEffect(() => {
        if (!selectedId) {
            setGroupTasks([]);              // clear when no group selected
            return;
        }

        let cancelled = false;
        (async () => {
            try {
                const tasks = await getAllGroupTasksByGroupId(selectedId);
                if (!cancelled) setGroupTasks(tasks || []);
            } catch (err) {
                console.error("Failed loading group tasks:", err);
                if (!cancelled) setGroupTasks([]);
            }
        })();

        return () => { cancelled = true; };
    }, [selectedId, getAllGroupTasksByGroupId]);

    const rootTaskId = useMemo(() => {
        const root = groupTasks.find(t => t.isRoot);
        return root ? root._id : null;
    }, [groupTasks]);

    function displayNameOfAssignedUser(m) {
        const u = m.user || {};
        if (u.name && typeof u.name === 'object') {
          return [u.name.first, u.name.last].filter(Boolean).join(' ');
        }
        return u.name || u.displayName || u.email || 'Unknown User';
      }
    /* render helpers – Tasks table ---------------------------------- */
    const renderTasksList = () => (

        <Box>
            <Box className={styles.listHeader}>
                <Typography variant="h6">Tasks</Typography>
                <Box display="flex" alignItems="center">
                    <FormControl size="small" variant="standard" sx={{ minWidth: 140, mr: 2 }}>
                        <InputLabel>Filter by User</InputLabel>
                        <Select
                            value={taskFilter}
                            onChange={e => setTaskFilter(e.target.value)}
                        >
                            <MenuItem value=''><em>All Users</em></MenuItem>
                            {members.map(m => {
                                const u = m.user || {};
                                const name = typeof u.name === 'object'
                                    ? [u.name.first, u.name.last].filter(Boolean).join(' ')
                                    : u.name || u.displayName || u.email || 'Unknown User';
                                const id = m.userId || u._id;
                                return <MenuItem key={id} value={id}>{name}</MenuItem>;
                            })}
                        </Select>
                    </FormControl>
                    <Button
                        variant="contained"
                        startIcon={<TaskIcon />}
                        onClick={() =>
                            navigate(ROUTES.CREATE_TASK, {
                                state: {
                                    prefill: { parentIds: rootTaskId ? [rootTaskId] : [] },
                                    from: location
                                }
                            })
                        }
                        disabled={!selectedGroup}
                    >Add Task</Button>
                </Box>
            </Box>

            <TableContainer component={Paper}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Task</TableCell>
                            <TableCell>Assignee</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredTasks.map(t => {
                            const realId = t._id;
                            const assigned = members.find(m =>
                                m.userId === t.assignee || m.user?._id === t.assignee
                            );
                            const assigneeNm = assigned ? displayNameOfAssignedUser(assigned)
                                : members.length === 1 ? 
                                displayNameOfAssignedUser(members[0])
                                    : 'Unassigned';

                            return (
                                <TableRow key={realId}>
                                    <TableCell>
                                        {t.title ?? t.name ?? t.task?.title ?? t.task?.name ?? 'Unnamed Task'}
                                    </TableCell>
                                    <TableCell>{assigneeNm}</TableCell>
                                    <TableCell align="right">
                                        <FormControl size="small" variant="standard" sx={{ minWidth: 100, mr: 1 }}>
                                            <InputLabel>Assign</InputLabel>
                                            <Select
                                                value={t.assignee ?? ''}
                                                onChange={e => {
                                                    const taskId = t.taskId ?? t.task?._id ?? t.id;
                                                    console.log("Assigning task", realId, "to user", e.target.value);
                                                    handleAssignTaskChange(realId, e.target.value);
                                                }}
                                            >
                                                <MenuItem value=''><em>Unassigned</em></MenuItem>
                                                {members.map(m => {
                                                    const u = m.user || {};
                                                    const name = typeof u.name === 'object'
                                                        ? [u.name.first, u.name.last].filter(Boolean).join(' ')
                                                        : u.name || u.displayName || u.email || 'Unknown User';
                                                    const id = m.userId || u._id;
                                                    return <MenuItem key={id} value={id}>{name}</MenuItem>;
                                                })}
                                            </Select>
                                        </FormControl>
                                        <IconButton
                                            size="small"
                                            onClick={() => { setItemToDelete(t.id); setConfirmDeleteTaskOpen(true); }}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );

    // compute the member and its display name for the confirmation dialog
    const memberToChange = members.find(m => m.userId === memberToChangeRole?.userId);
    const changeName = memberToChange
        ? (
            typeof memberToChange.user.name === 'object'
                ? [memberToChange.user.name.first, memberToChange.user.name.last].filter(Boolean).join(' ')
                : memberToChange.user.name || memberToChange.user.displayName || memberToChange.user.email
        )
        : '';

    /* ---------------------------------------------------------------- */
    return (
        <Grid container spacing={2} className={styles.pageContainer}
            sx={{ height: 'calc(100vh - 64px)', width: '100vw' }}>

            {/* ─────────── Sidebar – group list ─────────── */}
            <Grid container={false} xs={12} md={3} sx={{ width: '20vw', height: '100%' }}>
                <Paper className={styles.sidebarPaper}>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        fullWidth
                        onClick={() => setAddGroupOpen(true)}
                    >Add Group</Button>

                    {listLoading && <LinearProgress />}
                    {listError && (
                        <Typography color="error">{listError.message}</Typography>
                    )}

                    <Box className={styles.sidebarListContainer}>
                        {groups.map(g => (
                            <Box
                                key={g.id}
                                className={`${styles.groupItem} ${selectedId === g.id ? styles.selectedGroup : ''}`}
                                onClick={() => handleGroupSelect(g.id)}
                            >
                                {g.name}
                            </Box>
                        ))}
                    </Box>
                </Paper>
            </Grid>

            {/* ─────────── Main panel ─────────── */}
            <Grid container={false} xs={12} md={9} sx={{ width: '70vw', height: '100%' }}>
                <Paper className={styles.mainPanelPaper} sx={{ p: 2, height: '100%' }}>
                    {!selectedGroup ? (
                        <Box className={styles.noGroupSelectedBox}>
                            <Typography>Select a group to begin.</Typography>
                        </Box>
                    ) : detailLoading ? (
                        <LinearProgress />
                    ) : detailError ? (
                        <Typography color="error">{detailError.message}</Typography>
                    ) : (
                        <>
                            {/* Group header */}
                            <Box mb={2}>
                                <Box display="flex" justifyContent="space-between">
                                    <Typography variant="h4">{selectedGroup.name}</Typography>
                                    <Box>
                                        <IconButton onClick={handleOpenEditGroup}><EditIcon /></IconButton>
                                        <IconButton
                                            onClick={() => setConfirmDeleteGroupOpen(true)}
                                            disabled={selectedGroupContainsRootTask} // <-- Disable button here
                                            title={selectedGroupContainsRootTask ? "Cannot delete group containing the root task" : "Delete group"} // <-- Add tooltip
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </Box>
                                </Box>
                                <Typography variant="body2" color="textSecondary">
                                    {selectedGroup.description}
                                </Typography>
                                <Typography variant="caption" color="textSecondary">
                                    Created on:&nbsp;
                                    {new Date(selectedGroup.createdAt).toLocaleDateString()}
                                </Typography>
                            </Box>

                            <Divider />

                            {/* Tabs */}
                            <Tabs
                                value={selectedTab}
                                onChange={(_, v) => setSelectedTab(v)}
                                sx={{ mb: 2 }}
                            >
                                <Tab label="Tasks" />
                                <Tab label="Users" />
                            </Tabs>

                            {/* Content */}
                            <Box sx={{ overflowY: 'auto', height: 'calc(100% - 160px)' }}>
                                {selectedTab === 0 ? renderTasksList() : renderUsersList()}
                            </Box>
                        </>
                    )}
                </Paper>
            </Grid>

            {/** ===================== */}
            {/** Dialogs */}
            {/** ===================== */}

            {/* Create Group Dialog */}
            <Dialog open={addGroupOpen} onClose={() => setAddGroupOpen(false)}>
                <DialogTitle>Create New Group</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Name"
                        value={newGroupName}
                        onChange={e => setNewGroupName(e.target.value)}
                        fullWidth
                        margin="dense"
                    />
                    <TextField
                        label="Description"
                        value={newGroupDesc}
                        onChange={e => setNewGroupDesc(e.target.value)}
                        fullWidth
                        margin="dense"
                        multiline
                        rows={3}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setAddGroupOpen(false)}>Cancel</Button>
                    <Button onClick={handleCreateGroup}>Create</Button>
                </DialogActions>
            </Dialog>

            {/* Edit Group Dialog */}
            <Dialog open={editGroupOpen} onClose={() => setEditGroupOpen(false)}>
                <DialogTitle>Edit Group</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Name"
                        value={editGroupName}
                        onChange={e => setEditGroupName(e.target.value)}
                        fullWidth
                        margin="dense"
                    />
                    <TextField
                        label="Description"
                        value={editGroupDesc}
                        onChange={e => setEditGroupDesc(e.target.value)}
                        fullWidth
                        margin="dense"
                        multiline
                        rows={3}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditGroupOpen(false)}>Cancel</Button>
                    <Button onClick={handleUpdateGroupDetails}>Save</Button>
                </DialogActions>
            </Dialog>

            {/* Confirm Delete Group */}
            <Dialog open={confirmDeleteGroupOpen} onClose={() => setConfirmDeleteGroupOpen(false)}>
                <DialogTitle>Delete Group?</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to delete “{selectedGroup?.name}”? This cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmDeleteGroupOpen(false)}>Cancel</Button>
                    <Button color="error" onClick={handleConfirmDeleteGroup}>Delete</Button>
                </DialogActions>
            </Dialog>

            {/* Add Member Dialog */}
            <Dialog open={addMemberOpen} onClose={() => setAddMemberOpen(false)}>
                <DialogTitle>Add Member</DialogTitle>
                <DialogContent>
                    <TextField
                        label="User Email"
                        type="email"
                        value={newMemberEmail}
                        onChange={e => setNewMemberEmail(e.target.value)}
                        fullWidth
                        margin="dense"
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={newMemberIsAdmin}
                                onChange={e => setNewMemberIsAdmin(e.target.checked)}
                            />
                        }
                        label="Make Admin"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setAddMemberOpen(false)}>Cancel</Button>
                    <Button onClick={handleAddMemberConfirm}>Add</Button>
                </DialogActions>
            </Dialog>

            {/* Confirm Delete Member */}
            <Dialog open={confirmDeleteMemberOpen} onClose={() => setConfirmDeleteMemberOpen(false)}>
                <DialogTitle>Remove Member?</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to remove this member?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmDeleteMemberOpen(false)}>Cancel</Button>
                    <Button color="error" onClick={handleConfirmDeleteMember}>Remove</Button>
                </DialogActions>
            </Dialog>

            {/* Confirm Role Change */}
            <Dialog open={confirmRoleChangeOpen} onClose={() => setConfirmRoleChangeOpen(false)}>
                <DialogTitle>Change Role?</DialogTitle>
                <DialogContent>
                    <Typography>
                        Promote “{changeName}” to {memberToChangeRole?.newRole}?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmRoleChangeOpen(false)}>Cancel</Button>
                    <Button onClick={handleConfirmRoleChange}>Confirm</Button>
                </DialogActions>
            </Dialog>

            {/* Add Task Dialog */}
            <Dialog open={addTaskOpen} onClose={() => setAddTaskOpen(false)}>
                <DialogTitle>Add Task</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Title"
                        value={newTaskTitle}
                        onChange={e => setNewTaskTitle(e.target.value)}
                        fullWidth
                        margin="dense"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setAddTaskOpen(false)}>Cancel</Button>
                    <Button onClick={handleAddTaskConfirm}>Add</Button>
                </DialogActions>
            </Dialog>

            {/* Confirm Delete Task */}
            <Dialog open={confirmDeleteTaskOpen} onClose={() => setConfirmDeleteTaskOpen(false)}>
                <DialogTitle>Delete Task?</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to delete this task?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmDeleteTaskOpen(false)}>Cancel</Button>
                    <Button color="error" onClick={handleConfirmDeleteTask}>Delete</Button>
                </DialogActions>
            </Dialog>
        </Grid>
    );
};

export default GroupsPage;

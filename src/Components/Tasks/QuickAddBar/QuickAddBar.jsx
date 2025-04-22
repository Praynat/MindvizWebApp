import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { IconButton, Popover } from "@mui/material";
import { Send as SendIcon, OpenInNew as OpenInNewIcon } from "@mui/icons-material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import QuickDatePicker from "./QuickDatePicker";
import SidebarItem from "../ListView/SidebarItem";
import ROUTES from '../../../Routes/routesModel';
import "./QuickAddBar.css";

function buildTree(tasks) {
  if (!tasks || tasks.length === 0) return [];
  const map = {};
  tasks.forEach(t => (map[t._id] = { ...t, subCategories: [] }));
  tasks.forEach(t => {
    (t.parentIds || []).forEach(pid => {
      if (map[pid]) map[pid].subCategories.push(map[t._id]);
    });
  });
  return Object.values(map).filter(t => !t.parentIds?.length);
}

export default function QuickAddBar({ tasks = [], selectedTask, onTaskCreated }) {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [deadlineDate, setDeadlineDate] = useState(null);
  const [dateAnchor, setDateAnchor] = useState(null);
  const [parentAnchor, setParentAnchor] = useState(null);
  const [parentId, setParentId] = useState("");

  const wrappedSetDateAnchor = (elOrUpdater) => {
       setParentAnchor(null);
       setDateAnchor(prev =>
         typeof elOrUpdater === "function" ? elOrUpdater(prev) : elOrUpdater
       );
     };
  const rootTask = tasks.find(t => !t.parentIds?.length);
  const effectiveParentId = parentId || selectedTask?._id || rootTask?._id || "";

  useEffect(() => {
    if (selectedTask?._id) setParentId(selectedTask._id);
    else if (rootTask?._id && !parentId) setParentId(rootTask._id);
  }, [selectedTask, rootTask, parentId]);

  const handleQuickCreate = async () => {
    if (!title.trim()) return;
    await onTaskCreated?.({ name: title.trim(), deadline: deadlineDate, parentIds: [effectiveParentId] });
    setTitle("");
    setDeadlineDate(null);
  };

  const handleOpenFullModal = () => {
    const prefill = {
      name: title.trim(),
      deadline: deadlineDate,
      parentIds: [effectiveParentId]
    };
    navigate(ROUTES.CREATE_TASK, { state: { prefill } });
  };

  return (
    <div className="quick-add-bar">
      <div className="quick-add-bar-input-group">
        <div className="quick-add-bar-parent-ref">
          <span className="quick-add-bar-parent-label">Select parent</span>
          <div
            className="quick-add-bar-parent-select"
            onClick={e => setParentAnchor(a => (a ? null : e.currentTarget))}
          >
            <span>
              {tasks.find(t => t._id === effectiveParentId)?.name || "Racine"}
            </span>
            <ExpandMoreIcon
              fontSize="small"
              style={{ transform: parentAnchor ? "rotate(180deg)" : "rotate(0)" }}
            />
          </div>
          <Popover
            open={Boolean(parentAnchor)}
            anchorEl={parentAnchor}
            onClose={() => setParentAnchor(null)}
            anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
            transformOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            ModalProps={{
              disableAutoFocus: true,
              disableEnforceFocus: true,
              disableRestoreFocus: true,
            }}
            PaperProps={{ className: "quick-add-bar-popover-paper" }}
          >
            <div className="quick-parent-selector-popover-content">
              {buildTree(tasks).map(item => (
                <SidebarItem
                  key={item._id}
                  item={item}
                  selectedItemId={effectiveParentId}
                  onFilterSelect={newItem => {
                    setParentId(newItem._id || newItem.id);
                    setParentAnchor(null);
                  }}
                />
              ))}
            </div>
          </Popover>
        </div>

        <div className="quick-add-bar-divider" />

        <input
          type="text"
          placeholder="Add a quick task..."
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="quick-add-bar-input"
          maxLength={80}
        />

        <div className="quick-add-bar-divider" />

        <QuickDatePicker
        enableAccessibleFieldDOMStructure={false}
        deadlineDate={deadlineDate}
        setDeadlineDate={setDeadlineDate}
         anchorEl={dateAnchor}
         setAnchorEl={wrappedSetDateAnchor}
          applyDeadline={(useTime) => {
            if (!deadlineDate) return;
            const finalDate = useTime
              ? deadlineDate
              : new Date(deadlineDate.setHours(0, 0, 0, 0));
            setDeadlineDate(finalDate);
            setDateAnchor(null);
          }}
        />

        <IconButton onClick={handleOpenFullModal} size="small" title="Ouvrir la création avancée">
          <OpenInNewIcon />
        </IconButton>

        <IconButton
          onClick={handleQuickCreate}
          disabled={!title.trim()}
          size="large"
          color="primary"
          title="Ajouter rapidement"
        >
          <SendIcon />
        </IconButton>
      </div>
    </div>
  );
}

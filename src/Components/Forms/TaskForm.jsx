import React, { useState } from "react"; // Removed useEffect
import {
    Grid, TextField, Button, Popover, Box, Typography,
    FormControlLabel, Checkbox, Autocomplete, Chip, FormControl,
} from "@mui/material";
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import Form from "./Form";
import Input from "./Input"; // Assuming Input component uses data[name] and onChange correctly
import SidebarItem from "../Tasks/ListView/SidebarItem";
import "./TaskForm.css";

// Function to build task tree
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

const taskTypes = ["Simple", "Complex", "Category"];
const frequencyTypes = ["OneTime", "Daily", "Weekly", "Monthly", "Yearly", "Custom"];
const weekDaysValues = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const monthOfYearValues = [
    { label: "January", value: 1 },
    { label: "February", value: 2 },
    { label: "March", value: 3 },
    { label: "April", value: 4 },
    { label: "May", value: 5 },
    { label: "June", value: 6 },
    { label: "July", value: 7 },
    { label: "August", value: 8 },
    { label: "September", value: 9 },
    { label: "October", value: 10 },
    { label: "November", value: 11 },
    { label: "December", value: 12 }
];

export default function TaskForm({
    onSubmit, // Received from useForm hook via parent page
    onReset,  // Received from useForm hook via parent page
    errors,   // Received from useForm hook via parent page
    onInputChange, // Renamed from handleChange for clarity, received from useForm hook
    setData,  // Receive setData for more complex updates (like parent select)
    data,     // Received from useForm hook via parent page
    tasks = [],
    validateForm, // Received from useForm hook via parent page
    isEditing = false, // Keep if needed for conditional UI elements
    submitButtonText = 'Submit', // Keep if Form.jsx uses it
}) {
    const [parentAnchor, setParentAnchor] = useState(null);

    const handleParentSelect = (item) => {
        setData(p => ({ ...p, parentIds: item?._id ? [item._id] : [] }));
        setParentAnchor(null); // Close popover
    };

    const handleDeadlineChange = (val) => {
        setData(p => ({ ...p, deadline: val, isDeadline: !!val }));
    };

    const handleIsFreq = (e) => {
        const checked = e.target.checked;
        setData(p => ({
            ...p,
            isFrequency: checked,
            ...(checked ? {} : { // Reset frequency fields if unchecked
                frequency: null, startDate: null, endDate: null, weekDays: [],
                dayOfMonth: null, monthOfYear: null, frequencyInterval: null
            })
        }));
    };

    const handleWeekDayChange = (e) => {
        const { name, checked } = e.target;
        setData(p => {
            const days = p.weekDays || [];
            return { ...p, weekDays: checked ? [...days, name] : days.filter(d => d !== name) };
        });
    };

    const handleDateField = (field) => (val) => setData(p => ({ ...p, [field]: val }));

    const handleAuto = (field) => (_, val) => setData(p => ({ ...p, [field]: val || [] }));

    const selectedParentId = data.parentIds?.[0] || "";
    const selectedParent = tasks.find(t => t._id === selectedParentId);
    const taskTree = buildTree(tasks.filter(t => t.type === 'Category'));

    return (
        <Form onSubmit={onSubmit} onReset={onReset} validateForm={validateForm} className="task-form" submitText={submitButtonText}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Grid container spacing={3}>
                    {/* === Row 1: Name, Deadline, Description === */}
                    <Grid container item xs={12} spacing={2}>
                        <Grid item xs={12} sm={4}>
                            <Input name="name" label="Task Name" data={data} onChange={onInputChange} error={errors.name} required className="full-height" />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <DateTimePicker
                                label="Deadline"
                                value={data.deadline || null}
                                onChange={handleDeadlineChange}
                                enableAccessibleFieldDOMStructure={false}
                                slots={{ textField: params => <TextField {...params} fullWidth error={!!errors.deadline} helperText={errors.deadline} /> }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Input name="description" label="Description" data={data} onChange={onInputChange} error={errors.description} multiline />
                        </Grid>
                    </Grid>

                    {/* === Row 2: Parent, Type, Links, Tags === */}
                    <Grid container item xs={12} spacing={2}>
                        <Grid item xs={12} sm={3}>
                            <Box sx={{ position: 'relative', display: 'inline-block', width: '100%', height: '100%' }}>
                                <Typography component="label" htmlFor="parent-select-button" sx={{ position: 'absolute', top: -8, left: "8%", px: 0.5, bgcolor: 'background.paper', fontSize: '0.75rem', color: 'text.secondary', userSelect: 'none', zIndex: 10 }}>
                                    Parent Task
                                </Typography>
                                <Button id="parent-select-button" variant="outlined" onClick={e => setParentAnchor(e.currentTarget)} endIcon={<span style={{ fontSize: 12 }}>▼</span>} fullWidth className="parent-select-button">
                                    {selectedParent?.name || 'Select Parent'}
                                </Button>
                                <Popover open={!!parentAnchor} anchorEl={parentAnchor} onClose={() => setParentAnchor(null)} anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }} transformOrigin={{ vertical: 'top', horizontal: 'left' }}>
                                    <Box sx={{ maxHeight: 400, overflowY: 'auto', minWidth: 250, p: 1 }}>
                                        <SidebarItem key="no-parent" item={{ _id: null, name: "No Parent" }} selectedItemId={selectedParentId} onFilterSelect={handleParentSelect} isTopLevel={true} />
                                        {taskTree.map(item => <SidebarItem key={item._id} item={item} selectedItemId={selectedParentId} onFilterSelect={handleParentSelect} />)}
                                    </Box>
                                </Popover>
                                {errors.parentIds && <Typography color="error" variant="caption">{errors.parentIds}</Typography>}
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <Input name="type" label="Task Type" select options={taskTypes} data={data} onChange={onInputChange} error={errors.type} required className="full-height" />
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <Autocomplete multiple freeSolo options={[]} value={data.links || []} onChange={handleAuto('links')} renderTags={(val, getTag) => val.map((opt, i) => <Chip key={i} label={opt} {...getTag({ i })} />)} renderInput={params => <TextField {...params} variant="outlined" label="Links" placeholder="http://..." error={!!errors.links} helperText={errors.links} />} />
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <Autocomplete multiple freeSolo options={[]} value={data.tags || []} onChange={handleAuto('tags')} renderTags={(val, getTag) => val.map((opt, i) => <Chip key={i} label={opt} {...getTag({ i })} />)} renderInput={params => <TextField {...params} variant="outlined" label="Tags" placeholder="Add tag" error={!!errors.tags} helperText={errors.tags} />} />
                        </Grid>
                    </Grid>

                    {/* === Row 3: Recurring Settings === */}
                    <Grid container item xs={12} spacing={2} alignItems="center">
                        <Grid item>
                            <FormControlLabel control={<Checkbox checked={data.isFrequency || false} onChange={handleIsFreq} name="isFrequency" />} label="Recurring Task" />
                        </Grid>
                        {data.isFrequency && (
                            <>
                                <Grid item xs={12} sm={2}>
                                    <Input name="frequency" label="Frequency" select options={frequencyTypes} data={data} onChange={onInputChange} error={errors.frequency} className="full-height" />
                                </Grid>
                                <Grid item xs={12} sm={3}>
                                    <DateTimePicker label="Start Date" value={data.startDate || null} onChange={handleDateField('startDate')} enableAccessibleFieldDOMStructure={false}
                                        slots={{ textField: params => <TextField {...params} fullWidth error={!!errors.startDate} helperText={errors.startDate} /> }} />
                                </Grid>
                                <Grid item xs={12} sm={3}>
                                    <DateTimePicker label="End Date" value={data.endDate || null} onChange={handleDateField('endDate')} enableAccessibleFieldDOMStructure={false}
                                        slots={{ textField: params => <TextField {...params} fullWidth error={!!errors.endDate} helperText={errors.endDate} /> }} />
                                </Grid>
                            </>
                        )}
                    </Grid>

                    {/* === Row 4: Frequency Specifics === */}
                    {data.isFrequency && (
                        <Grid container item xs={12} spacing={2}>
                            {data.frequency === "Weekly" && (
                                <Grid item xs={12}>
                                    <Box className="recurring-section">
                                        <FormControl component="fieldset" fullWidth error={!!errors.weekDays}>
                                            <Typography variant="body2">Repeat on:</Typography>
                                            <Box display="flex" flexWrap="wrap" gap={0.5}>
                                                {weekDaysValues.map(d => <FormControlLabel key={d} control={<Checkbox size="small" checked={data.weekDays?.includes(d)} onChange={handleWeekDayChange} name={d} />} label={d.substring(0, 3)} />)}
                                            </Box>
                                            {errors.weekDays && <Typography color="error" variant="caption">{errors.weekDays}</Typography>}
                                        </FormControl>
                                    </Box>
                                </Grid>
                            )}
                            {data.frequency === "Monthly" && (
                                <Grid item xs={12} sm={4}>
                                    <Input name="dayOfMonth" label="Day of Month" type="number" data={data} onChange={onInputChange} error={errors.dayOfMonth} InputProps={{ inputProps: { min: 1, max: 31 } }} className="full-height" />
                                </Grid>
                            )}
                            {data.frequency === "Yearly" && (
                                <Grid item xs={12} sm={4}>
                                    <Input name="monthOfYear" label="Month" select options={monthOfYearValues.map(m => m.value)} getOptionLabel={opt => monthOfYearValues.find(m => m.value === opt)?.label || ''} data={data} onChange={onInputChange} error={errors.monthOfYear} className="full-height" />
                                </Grid>
                            )}
                            {data.frequency === "Custom" && (
                                <Grid item xs={12} sm={4}>
                                    <Input name="frequencyInterval" label="Interval (Days)" type="number" data={data} onChange={onInputChange} error={errors.frequencyInterval} InputProps={{ inputProps: { min: 1 } }} className="full-height" />
                                </Grid>
                            )}
                        </Grid>
                    )}
                </Grid>
            </LocalizationProvider>
        </Form>
    );
}

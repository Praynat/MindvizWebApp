import React, { useState } from "react";
import {
    Grid, TextField, Button, Popover, Box, Typography,
    FormControlLabel, Checkbox, Autocomplete, Chip, FormControl,
} from "@mui/material";
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import Form from "./Form";
import Input from "./Input";
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
    onSubmit,
    onReset,
    errors,
    onInputChange,
    setData,
    data,
    tasks = [],
    validateForm,
    isEditing = false,
    isRootTask = false, // <-- Receive the prop
    submitButtonText = 'Submit',
}) {
    const [parentAnchor, setParentAnchor] = useState(null);

    // Determine if fields should be disabled (all except name if root)
    const disableFields = isRootTask;

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
    const taskTree = buildTree(tasks);

    return (
        <Form onSubmit={onSubmit} onReset={onReset} validateForm={validateForm} className="task-form" submitText={submitButtonText}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                {/* Parent container */}
                <Grid container spacing={3}>
                    {/* Row 1 */}
                    <Grid xs={12} container spacing={2}>
                        <Grid container={false} xs={12} sm={4}>
                            <Input name="name" label="Task Name" data={data} onChange={onInputChange} error={errors.name} required className="full-height" />
                        </Grid>
                        <Grid container={false} xs={12} sm={4}>
                            <DateTimePicker
                                label="Deadline"
                                value={data.deadline || null}
                                onChange={handleDeadlineChange}
                                enableAccessibleFieldDOMStructure={false}
                                slots={{ textField: params => <TextField {...params} fullWidth error={!!errors.deadline} helperText={errors.deadline} /> }}
                                disabled={disableFields} // <-- Disable
                            />
                        </Grid>
                        <Grid container={false} xs={12} sm={4}>
                            <Input name="description" label="Description" data={data} onChange={onInputChange} error={errors.description} multiline disabled={disableFields} /> {/* <-- Disable */}
                        </Grid>
                    </Grid>

                    {/* Row 2 */}
                    <Grid xs={12} container spacing={2}>
                        <Grid container={false} xs={12} sm={3}>
                            <Box sx={{ position: 'relative', display: 'inline-block', width: '100%', height: '100%' }}>
                                <Typography component="label" htmlFor="parent-select-button" sx={{ position: 'absolute', top: -8, left: "8%", px: 0.5, bgcolor: 'background.paper', fontSize: '0.75rem', color: 'text.secondary', userSelect: 'none', zIndex: 10 }}>
                                    Parent Task
                                </Typography>
                                <Button id="parent-select-button" variant="outlined" onClick={e => setParentAnchor(e.currentTarget)} endIcon={<span style={{ fontSize: 12 }}>▼</span>} fullWidth className="parent-select-button" disabled={disableFields}> {/* <-- Disable */}
                                    {selectedParent?.name || 'Select Parent'}
                                </Button>
                                <Popover open={!!parentAnchor && !disableFields} anchorEl={parentAnchor} onClose={() => setParentAnchor(null)} anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }} transformOrigin={{ vertical: 'top', horizontal: 'left' }}>
                                    <Box sx={{ maxHeight: 400, overflowY: 'auto', minWidth: 250, p: 1 }}>
                                        <SidebarItem key="no-parent" item={{ _id: null, name: "No Parent" }} selectedItemId={selectedParentId} onFilterSelect={handleParentSelect} isTopLevel={true} />
                                        {taskTree.map(item => <SidebarItem key={item._id} item={item} selectedItemId={selectedParentId} onFilterSelect={handleParentSelect} />)}
                                    </Box>
                                </Popover>
                                {errors.parentIds && <Typography color="error" variant="caption">{errors.parentIds}</Typography>}
                            </Box>
                        </Grid>
                        <Grid container={false} xs={12} sm={3}>
                            <Input name="type" label="Task Type" select options={taskTypes} data={data} onChange={onInputChange} error={errors.type} required className="full-height" disabled={disableFields} /> {/* <-- Disable */}
                        </Grid>
                        <Grid container={false} xs={12} sm={3}>
                            <Autocomplete multiple freeSolo options={[]} value={data.links || []} onChange={handleAuto('links')} renderTags={(val, getTag) => val.map((opt, i) => <Chip key={i} label={opt} {...getTag({ i })} />)} renderInput={params => <TextField {...params} variant="outlined" label="Links" placeholder="http://..." error={!!errors.links} helperText={errors.links} />} disabled={disableFields} /> {/* <-- Disable */}
                        </Grid>
                        <Grid container={false} xs={12} sm={3}>
                            <Autocomplete multiple freeSolo options={[]} value={data.tags || []} onChange={handleAuto('tags')} renderTags={(val, getTag) => val.map((opt, i) => <Chip key={i} label={opt} {...getTag({ i })} />)} renderInput={params => <TextField {...params} variant="outlined" label="Tags" placeholder="Add tag" error={!!errors.tags} helperText={errors.tags} />} disabled={disableFields} /> {/* <-- Disable */}
                        </Grid>
                    </Grid>

                    {/* Row 3 */}
                    <Grid xs={12} container spacing={2} alignItems="center">
                        <Grid container={false} xs={12}>
                            <FormControlLabel control={<Checkbox checked={data.isFrequency || false} onChange={handleIsFreq} name="isFrequency" disabled={disableFields} />} label="Recurring Task" /> {/* <-- Disable */}
                        </Grid>
                        {data.isFrequency && (
                            <>
                                <Grid container={false} xs={12} sm={2}>
                                    <Input name="frequency" label="Frequency" select options={frequencyTypes} data={data} onChange={onInputChange} error={errors.frequency} className="full-height" disabled={disableFields} /> {/* <-- Disable */}
                                </Grid>
                                <Grid container={false} xs={12} sm={3}>
                                    <DateTimePicker label="Start Date" value={data.startDate || null} onChange={handleDateField('startDate')} enableAccessibleFieldDOMStructure={false}
                                        slots={{ textField: params => <TextField {...params} fullWidth error={!!errors.startDate} helperText={errors.startDate} /> }} disabled={disableFields} /> {/* <-- Disable */}
                                </Grid>
                                <Grid container={false} xs={12} sm={3}>
                                    <DateTimePicker label="End Date" value={data.endDate || null} onChange={handleDateField('endDate')} enableAccessibleFieldDOMStructure={false}
                                        slots={{ textField: params => <TextField {...params} fullWidth error={!!errors.endDate} helperText={errors.endDate} /> }} disabled={disableFields} /> {/* <-- Disable */}
                                </Grid>
                            </>
                        )}
                    </Grid>

                    {/* Row 4 (conditional) */}
                    {data.isFrequency && (
                        <Grid xs={12} container spacing={2}>
                            {data.frequency === "Weekly" && (
                                <Grid container={false} xs={12}>
                                    <Box className="recurring-section">
                                        <FormControl component="fieldset" fullWidth error={!!errors.weekDays} disabled={disableFields}> {/* <-- Disable FormControl */}
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
                                <Grid container={false} xs={12} sm={4}>
                                    <Input name="dayOfMonth" label="Day of Month" type="number" data={data} onChange={onInputChange} error={errors.dayOfMonth} InputProps={{ inputProps: { min: 1, max: 31 } }} className="full-height" disabled={disableFields} /> {/* <-- Disable */}
                                </Grid>
                            )}
                            {data.frequency === "Yearly" && (
                                <Grid container={false} xs={12} sm={4}>
                                    <Input name="monthOfYear" label="Month" select options={monthOfYearValues.map(m => m.value)} getOptionLabel={opt => monthOfYearValues.find(m => m.value === opt)?.label || ''} data={data} onChange={onInputChange} error={errors.monthOfYear} className="full-height" disabled={disableFields} /> {/* <-- Disable */}
                                </Grid>
                            )}
                            {data.frequency === "Custom" && (
                                <Grid container={false} xs={12} sm={4}>
                                    <Input name="frequencyInterval" label="Interval (Days)" type="number" data={data} onChange={onInputChange} error={errors.frequencyInterval} InputProps={{ inputProps: { min: 1 } }} className="full-height" disabled={disableFields} /> {/* <-- Disable */}
                                </Grid>
                            )}
                        </Grid>
                    )}
                </Grid>
            </LocalizationProvider>
        </Form>
    );
}

import React from "react";
import { Popover, TextField, Box, IconButton, Button, Stack } from "@mui/material";
import { Close as CloseIcon, CalendarMonth as CalendarIcon } from "@mui/icons-material";
import { LocalizationProvider, DesktopDatePicker, DesktopTimePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

export default function QuickDatePicker({
  deadlineDate,
  setDeadlineDate,
  anchorEl,
  setAnchorEl,
  applyDeadline
}) {
  return (
    <>
      <IconButton
        className="quick-add-bar-calendar-btn"
        onClick={e => setAnchorEl(a => (a ? null : e.currentTarget))}
        size="small"
      >
        <CalendarIcon />
      </IconButton>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: "top", horizontal: "left" }}
        transformOrigin={{ vertical: "bottom", horizontal: "left" }}
        disableRestoreFocus
        PaperProps={{ className: "quick-add-bar-popover-paper" }}
      >
        <Box className="quick-add-bar-popover-content">
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DesktopDatePicker
              label="Choose Date"
              value={deadlineDate}
              onChange={setDeadlineDate}
              inputFormat="dd/MM/yyyy"
              renderInput={params => (
                <TextField {...params} size="small" fullWidth />
              )}
            />
            {deadlineDate && (
              <DesktopTimePicker
                label="Choose Time"
                value={deadlineDate}
                onChange={setDeadlineDate}
                renderInput={params => (
                  <TextField {...params} size="small" fullWidth />
                )}
              />
            )}
          </LocalizationProvider>
          <IconButton
            size="small"
            aria-label="Clear date"
            onClick={() => setDeadlineDate(null)}
            style={{ alignSelf: "flex-end" }}
          >
            <span className="sr-only">Remove date</span>
            <CloseIcon fontSize="small" />
          </IconButton>
          <Stack direction="row" spacing={1} justifyContent="flex-end">
            <Button
              size="small"
              disabled={!deadlineDate}
              onClick={() => applyDeadline(false)}
            >
              No Hour
            </Button>
            <Button
              variant="contained"
              size="small"
              disabled={!deadlineDate}
              onClick={() => applyDeadline(true)}
            >
              Validate
            </Button>
          </Stack>
        </Box>
      </Popover>
    </>
  );
}
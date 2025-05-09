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
        ModalProps={{
          disableAutoFocus: true,
          disableEnforceFocus: true,
          disableRestoreFocus: true,
        }}
        PaperProps={{ className: "quick-add-bar-popover-paper" }}
      >
        <Box className="quick-date-picker-popover-content">
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box display="flex" flexDirection="column" gap={1}>
              <DesktopDatePicker
                enableAccessibleFieldDOMStructure={false}
                value={deadlineDate}
                onChange={setDeadlineDate}
                inputFormat="dd/MM/yyyy"
                slots={{ textField: TextField }}
                slotProps={{ textField: { size: "small", fullWidth: true } }}
              />
              {deadlineDate && (
                <DesktopTimePicker
                  enableAccessibleFieldDOMStructure={false}
                  value={deadlineDate}
                  onChange={setDeadlineDate}
                  slots={{ textField: TextField }}
                  slotProps={{ textField: { size: "small", fullWidth: true } }}
                />
              )}
            </Box>
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
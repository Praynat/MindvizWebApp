const initialTaskForm = {
  // Core
  name: "",
  description: "",
  parentIds: [], // Will hold the selected parent ID (usually just one)

  // Type
  type: "Simple", // Default type

  // Deadline
  deadline: null,
  isDeadline: false,

  // --- Frequency ---
  isFrequency: false,
  frequency: null, // Default to null, or 'OneTime' if appropriate when isFrequency is true
  startDate: null,
  endDate: null,
  weekDays: [], // Default to empty array for multi-select (checkboxes)
  dayOfMonth: null,
  monthOfYear: null, // Default to null for single select (dropdown/radio)
  frequencyInterval: null,

  // Relations
  links: [],
  tags: [],

  // Status (Uncomment if form sets them, otherwise backend handles defaults)
  // progress: 0,
  // isChecked: false,
  // weight: 1,
};

export default initialTaskForm;
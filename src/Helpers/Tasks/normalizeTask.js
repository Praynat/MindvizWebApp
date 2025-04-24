// Helper function to convert array of day names to bitmask
// (Assuming Monday=1, Tuesday=2, Wednesday=4, ..., Sunday=64)
const weekDaysMap = {
  Sunday: 64, // Or 1 if Sunday is the start
  Monday: 1,  // Or 2
  Tuesday: 2, // Or 4
  Wednesday: 4,// Or 8
  Thursday: 8, // Or 16
  Friday: 16, // Or 32
  Saturday: 32 // Or 64
};

function convertWeekDaysArrayToBitmask(daysArray) {
  if (!Array.isArray(daysArray)) {
    return 0; // Default to 0 (None) if not an array
  }
  return daysArray.reduce((mask, dayName) => {
    const dayValue = weekDaysMap[dayName];
    return dayValue ? mask | dayValue : mask;
  }, 0); // Start with 0
}

function normalizeTask(task) {
    if (!task || typeof task !== "object") {
      throw new Error("Invalid task object");
    }

    // Convert weekDays array from form to bitmask for backend
    const weekDaysBitmask = convertWeekDaysArrayToBitmask(task.weekDays);

    return {
      _id: task._id,
      name: task.name || 'Title',
      description: task.description || '',
      type: task.type || 'Simple',
      isRoot: task.isRoot || task.IsRoot || false,
      parentIds: task.parentIds || [],
      childrenIds: task.childrenIds || [],
      isChecked: typeof task.isChecked === 'boolean' ? task.isChecked : false,
      progress: task.progress || 0,
      weight: task.weight || 1,
      isDeadline: !!task.isDeadline, // Ensure boolean
      deadline: task.deadline ? new Date(task.deadline) : null,
      createdAt: task.createdAt ? new Date(task.createdAt) : new Date(),
      updatedAt: task.updatedAt ? new Date(task.updatedAt) : new Date(),

      isFrequency: !!task.isFrequency, // Ensure boolean
      frequency: task.frequency ?? "OneTime",
      startDate: task.startDate ? new Date(task.startDate) : null,
      endDate: task.endDate ? new Date(task.endDate) : null,
      nextOccurrences: Array.isArray(task.nextOccurrences)
        ? task.nextOccurrences.map((date) => new Date(date))
        : [],

      // Use the converted bitmask
      weekDays: weekDaysBitmask,

      // Ensure these are null if not provided or invalid, matching backend expectations
      dayOfMonth: task.dayOfMonth ?? null,
      // Assuming backend expects number for month (0 might be invalid if 1-12 expected)
      // If backend expects 0 for 'None', this is fine. If it expects null, change to:
      // monthOfYear: task.monthOfYear ?? null,
      monthOfYear: task.monthOfYear ?? 0,
      frequencyInterval: task.frequencyInterval ?? null,

      links: task.links ?? [],
      tags: task.tags ?? [],

      userId: task.userId ?? null,
    };
  }

  export default normalizeTask;

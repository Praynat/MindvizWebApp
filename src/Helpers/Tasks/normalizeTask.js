function normalizeTask(task) {
    if (!task || typeof task !== "object") {
      throw new Error("Invalid task object");
    }
  
    return {
      _id: task._id,
      name: task.name || 'Title',
      description: task.description || '',
      type: task.type || 'Simple',
      parentIds: task.parentIds || [],
      childrenIds: task.childrenIds || [],
      progress: task.progress || 0,
      weight: task.weight || 1,
      isDeadline: !!task.isDeadline,
      deadline: task.deadline ? new Date(task.deadline) : null,
      createdAt: task.createdAt ? new Date(task.createdAt) : new Date(),
      updatedAt: task.updatedAt ? new Date(task.updatedAt) : new Date(),

    isFrequency: !!task.isFrequency,
    frequency: task.frequency ?? "OneTime",
    startDate: task.startDate ? new Date(task.startDate) : null,
    endDate: task.endDate ? new Date(task.endDate) : null,
    nextOccurrences: Array.isArray(task.nextOccurrences)
      ? task.nextOccurrences.map((date) => new Date(date))
      : [],

    weekDays: task.weekDays ?? 0,
    dayOfMonth: task.dayOfMonth ?? null,
    monthOfYear: task.monthOfYear ?? 0,
    frequencyInterval: task.frequencyInterval ?? null,

    links: task.links ?? [],
    tags: task.tags ?? [],

    userId: task.userId ?? null,
    };
  }
  
  export default normalizeTask;
  
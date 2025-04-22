import Joi from "joi";

const taskTypes = ["Simple", "Complex", "Category"];
const frequencyTypes = ["OneTime", "Daily", "Weekly", "Monthly", "Yearly", "Custom"];
// Assuming WeekDays might be represented as an array of strings or numbers in the form
const weekDaysValues = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
// Assuming MonthOfYear might be represented as numbers 1-12 or strings
const monthOfYearValues = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

const taskSchema = {
  // Core fields
  name: Joi.string().min(2).max(100).required().label("Name"),
  description: Joi.string().max(500).allow("").label("Description"),
  parentIds: Joi.array().items(Joi.string()).min(1).required().label("Parent Task"),

  // Type
  type: Joi.string().valid(...taskTypes).default("Simple").label("Task Type"),

  // Deadline
  deadline: Joi.date().allow(null).label("Deadline"),
  isDeadline: Joi.boolean().default(false),

  // --- Frequency ---
  isFrequency: Joi.boolean().default(false),

  frequency: Joi.string().valid(...frequencyTypes).when('isFrequency', {
    is: true,
    then: Joi.required(),
    otherwise: Joi.optional().allow(null)
  }).label("Frequency Type"),

  startDate: Joi.date().allow(null).when('isFrequency', {
    is: true,
    then: Joi.required(),
    otherwise: Joi.optional().allow(null)
  }).label("Start Date"),

  endDate: Joi.date().allow(null).when('isFrequency', {
    is: true,
    then: Joi.optional(), // Often optional even if frequency is set
    otherwise: Joi.optional().allow(null)
  }).label("End Date"),

  // Conditionally required based on frequency type
  weekDays: Joi.array().items(Joi.string().valid(...weekDaysValues)).when('frequency', {
    is: 'Weekly',
    then: Joi.array().min(1).required(),
     // Allow null/empty array otherwise
        }).label("Week Days"),

        dayOfMonth: Joi.number().integer().min(1).max(31).allow(null).when('frequency', {
            is: 'Monthly',
            then: Joi.required(),
            otherwise: Joi.optional()
        }).label("Day of Month"),

        monthOfYear: Joi.alternatives().try(
            Joi.number().integer().min(1).max(12),
            Joi.string().valid(...monthOfYearValues)
        ).allow(null).when('frequency', {
            is: 'Yearly',
            then: Joi.required(),
            otherwise: Joi.optional()
        }).label("Month of Year"),

  frequencyInterval: Joi.number().integer().min(1).allow(null).when('frequency', {
    is: 'Custom', // Or other types needing an interval
    then: Joi.required(),
    otherwise: Joi.optional()
  }).label("Frequency Interval"),

  // Relations (Optional on creation)
  links: Joi.array().items(Joi.string().uri()).label("Links"),
  tags: Joi.array().items(Joi.string()).label("Tags"),

  // Status (Defaults usually handled by backend)
  progress: Joi.number().min(0).max(100).default(0),
   isChecked: Joi.boolean().default(false),
   weight: Joi.number().min(0).default(1),
};

export default taskSchema;
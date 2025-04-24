import Joi from "joi";

const taskTypes = ["Simple", "Complex", "Category"];
const frequencyTypes = ["OneTime", "Daily", "Weekly", "Monthly", "Yearly", "Custom"];
const weekDaysValues = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const monthOfYearValues = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const taskSchema = {
  // Core fields
  name:        Joi.string().min(2).max(100).required().label("Name"),
  description: Joi.string().max(500).allow("").label("Description"),
  parentIds:   Joi.array().items(Joi.string()).default([]).label("Parent Task"),

  // Type
  type: Joi.string().valid(...taskTypes).default("Simple").label("Task Type"),

  // Deadline
  deadline:   Joi.date().allow(null).label("Deadline"),
  isDeadline: Joi.boolean().default(false).label("Has Deadline"),

  // Frequency toggle
  isFrequency: Joi.boolean().default(false).label("Is Recurring"),

  frequency: Joi.string().valid(...frequencyTypes).when('isFrequency', {
    is: true,
    then: Joi.required(),
    otherwise: Joi.optional().allow(null)
  }).label("Frequency"),

  startDate: Joi.date().allow(null).when('isFrequency', {
    is: true,
    then: Joi.required(),
    otherwise: Joi.optional().allow(null)
  }).label("Start Date"),

  endDate: Joi.date().allow(null).when('isFrequency', {
    is: true,
    then: Joi.optional(),
    otherwise: Joi.optional().allow(null)
  }).label("End Date"),

  // Weekly
  weekDays: Joi.array()
    .items(Joi.string().valid(...weekDaysValues))
    .when('frequency', {
      is: 'Weekly',
      then: Joi.array().min(1).required(),
      otherwise: Joi.optional().allow(null)
    })
    .label("Week Days"),

  // Monthly
  dayOfMonth: Joi.number().integer().min(1).max(31).allow(null).when('frequency', {
    is: 'Monthly',
    then: Joi.required(),
    otherwise: Joi.optional().allow(null)
  }).label("Day of Month"),

  // Yearly — strict validation only when frequency === "Yearly"
  monthOfYear: Joi.when('frequency', {
    is: 'Yearly',
    then: Joi.alternatives().try(
      // Numeric month 1–12
      Joi.number().integer().min(1).max(12),
      // Full month name
      Joi.string().valid(...monthOfYearValues),
      // { label: "...", value: 1–12 }
      Joi.object({
        label: Joi.string().valid(...monthOfYearValues).required(),
        value: Joi.number().integer().min(1).max(12).required()
      })
    ).required(),
    otherwise: Joi.any().optional().allow(null, "")
  }).label("Month of Year"),

  // Custom interval
  frequencyInterval: Joi.number().integer().min(1).allow(null).when('frequency', {
    is: 'Custom',
    then: Joi.required(),
    otherwise: Joi.optional().allow(null)
  }).label("Frequency Interval"),

  // Relations
  links: Joi.array().items(Joi.string().uri()).label("Links"),
  tags:  Joi.array().items(Joi.string()).label("Tags"),

  // Status
  progress:  Joi.number().min(0).max(100).default(0).label("Progress"),
  isChecked: Joi.boolean().default(false).label("Completed"),
  weight:    Joi.number().min(0).default(1).label("Weight"),
};

export default taskSchema;

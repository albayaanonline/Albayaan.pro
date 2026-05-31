import { pgTable, serial, integer, text, boolean, timestamp } from "drizzle-orm/pg-core";
import { lessonsTable } from "./lessons";
import { usersTable } from "./users";

export const exercisesTable = pgTable("exercises", {
  id:            serial("id").primaryKey(),
  lessonId:      integer("lesson_id").notNull().references(() => lessonsTable.id, { onDelete: "cascade" }),
  type:          text("type").notNull(),
  question:      text("question").notNull(),
  questionAr:    text("question_ar").notNull().default(""),
  questionSo:    text("question_so").notNull().default(""),
  options:       text("options").array(),
  correctAnswer: text("correct_answer").notNull(),
  explanation:   text("explanation").notNull().default(""),
  xpReward:      integer("xp_reward").notNull().default(10),
  order:         integer("order").notNull().default(1),
  createdAt:     timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const exerciseAttemptsTable = pgTable("exercise_attempts", {
  id:          serial("id").primaryKey(),
  userId:      integer("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  exerciseId:  integer("exercise_id").notNull().references(() => exercisesTable.id, { onDelete: "cascade" }),
  isCorrect:   boolean("is_correct").notNull(),
  userAnswer:  text("user_answer").notNull(),
  answeredAt:  timestamp("answered_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Exercise = typeof exercisesTable.$inferSelect;
export type ExerciseAttempt = typeof exerciseAttemptsTable.$inferSelect;

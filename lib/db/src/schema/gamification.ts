import { pgTable, serial, integer, text, timestamp, boolean } from "drizzle-orm/pg-core";
import { usersTable } from "./users";

export const userGamificationTable = pgTable("user_gamification", {
  id:             serial("id").primaryKey(),
  userId:         integer("user_id").notNull().unique().references(() => usersTable.id, { onDelete: "cascade" }),
  xp:             integer("xp").notNull().default(0),
  level:          integer("level").notNull().default(1),
  streak:         integer("streak").notNull().default(0),
  lastActiveDate: text("last_active_date"),
  badges:         text("badges").array().notNull().default([]),
  totalExercises: integer("total_exercises").notNull().default(0),
  correctAnswers: integer("correct_answers").notNull().default(0),
  updatedAt:      timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export type UserGamification = typeof userGamificationTable.$inferSelect;

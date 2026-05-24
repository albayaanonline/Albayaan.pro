import { pgTable, text, serial, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { coursesTable } from "./courses";

export const lessonsTable = pgTable("lessons", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id").notNull().references(() => coursesTable.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  titleAr: text("title_ar").notNull(),
  titleSo: text("title_so").notNull(),
  order: integer("order").notNull().default(1),
  duration: text("duration").notNull().default("5m"),
  isLocked: boolean("is_locked").notNull().default(true),
  hasQuiz: boolean("has_quiz").notNull().default(false),
  content: text("content").notNull().default(""),
  contentAr: text("content_ar").notNull().default(""),
  contentSo: text("content_so").notNull().default(""),
  videoUrl: text("video_url"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertLessonSchema = createInsertSchema(lessonsTable).omit({ id: true, createdAt: true });
export type InsertLesson = z.infer<typeof insertLessonSchema>;
export type Lesson = typeof lessonsTable.$inferSelect;

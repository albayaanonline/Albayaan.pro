import { pgTable, text, serial, timestamp, integer, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const coursesTable = pgTable("courses", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  titleAr: text("title_ar").notNull(),
  titleSo: text("title_so").notNull(),
  description: text("description").notNull(),
  descriptionAr: text("description_ar").notNull(),
  descriptionSo: text("description_so").notNull(),
  language: text("language").notNull(),
  level: text("level").notNull().default("beginner"),
  price: real("price").notNull().default(0),
  duration: text("duration").notNull().default("0h"),
  thumbnailUrl: text("thumbnail_url"),
  enrolledCount: integer("enrolled_count").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertCourseSchema = createInsertSchema(coursesTable).omit({ id: true, createdAt: true });
export type InsertCourse = z.infer<typeof insertCourseSchema>;
export type Course = typeof coursesTable.$inferSelect;

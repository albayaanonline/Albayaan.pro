import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";

export const certificatesTable = pgTable("certificates", {
  id: serial("id").primaryKey(),
  certId: text("cert_id").notNull().unique(),
  userId: integer("user_id").notNull(),
  courseId: integer("course_id").notNull(),
  studentName: text("student_name").notNull(),
  courseName: text("course_name").notNull(),
  issuedAt: timestamp("issued_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Certificate = typeof certificatesTable.$inferSelect;

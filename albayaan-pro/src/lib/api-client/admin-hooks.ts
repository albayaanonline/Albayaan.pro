import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { customFetch } from "./custom-fetch";

export interface AdminCourse {
  id: number;
  slug: string;
  title: string;
  titleAr: string;
  titleSo?: string;
  description: string;
  descriptionAr?: string;
  descriptionSo?: string;
  language: "english" | "arabic";
  level: "beginner" | "intermediate" | "advanced";
  price: number;
  duration: string;
  thumbnailUrl: string | null;
  enrolledCount: number;
  lessonCount: number;
  createdAt: string;
}

export interface AdminCourseInput {
  title: string;
  titleAr?: string;
  titleSo?: string;
  description?: string;
  descriptionAr?: string;
  descriptionSo?: string;
  language: "english" | "arabic";
  level: "beginner" | "intermediate" | "advanced";
  price: number;
  duration?: string;
  thumbnailUrl?: string;
}

export interface AdminLesson {
  id: number;
  courseId: number;
  title: string;
  titleAr: string;
  titleSo: string;
  order: number;
  duration: string;
  isLocked: boolean;
  hasQuiz: boolean;
  content: string;
  contentAr: string;
  contentSo: string;
}

export interface AdminAnalytics {
  totalUsers: number;
  totalCourses: number;
  totalEnrollments: number;
  confirmedPayments: number;
  topCourses: { id: number; title: string; enrolledCount: number; price: number }[];
  recentUsers: { id: number; name: string; email: string; role: string; createdAt: string }[];
}

export interface AdminCertificate {
  id: number;
  certId: string;
  userId: number;
  studentName: string;
  studentEmail: string;
  courseId: number;
  courseName: string;
  issuedAt: string;
}

export interface StoreCertInput {
  certId: string;
  userId: number;
  courseId: number;
  studentName: string;
  courseName: string;
}

export interface CertRecord {
  id: number;
  certId: string;
  userId: number;
  courseId: number;
  studentName: string;
  courseName: string;
  issuedAt: string;
}

const ADMIN_COURSES_KEY = ["admin", "courses"] as const;

export function useGetAdminCourses() {
  return useQuery({
    queryKey: ADMIN_COURSES_KEY,
    queryFn: () => customFetch<AdminCourse[]>("/api/admin/courses", { credentials: "include" }),
    retry: false,
  });
}

export function useAdminCreateCourse() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: AdminCourseInput) =>
      customFetch<AdminCourse>("/api/admin/courses", {
        method: "POST",
        credentials: "include",
        body: JSON.stringify(data),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ADMIN_COURSES_KEY }),
  });
}

export function useAdminUpdateCourse() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ courseId, data }: { courseId: number; data: Partial<AdminCourseInput> }) =>
      customFetch<AdminCourse>(`/api/admin/courses/${courseId}`, {
        method: "PUT",
        credentials: "include",
        body: JSON.stringify(data),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ADMIN_COURSES_KEY }),
  });
}

export function useAdminDeleteCourse() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (courseId: number) =>
      customFetch<{ success: boolean; id: number }>(`/api/admin/courses/${courseId}`, {
        method: "DELETE",
        credentials: "include",
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ADMIN_COURSES_KEY }),
  });
}

export function useAdminGetCourseLessons(courseId: number | null) {
  return useQuery({
    queryKey: ["admin", "courses", courseId, "lessons"],
    queryFn: () =>
      customFetch<AdminLesson[]>(`/api/admin/courses/${courseId}/lessons`, { credentials: "include" }),
    enabled: courseId !== null,
  });
}

export function useAdminDeleteLesson() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ lessonId, courseId }: { lessonId: number; courseId: number }) =>
      customFetch<{ success: boolean }>(`/api/admin/lessons/${lessonId}`, {
        method: "DELETE",
        credentials: "include",
      }),
    onSuccess: (_d, vars) =>
      qc.invalidateQueries({ queryKey: ["admin", "courses", vars.courseId, "lessons"] }),
  });
}

export function useGetAdminAnalytics() {
  return useQuery({
    queryKey: ["admin", "analytics"],
    queryFn: () => customFetch<AdminAnalytics>("/api/admin/analytics", { credentials: "include" }),
    retry: false,
  });
}

export function useGetAdminCertificates() {
  return useQuery({
    queryKey: ["admin", "certificates"],
    queryFn: () =>
      customFetch<AdminCertificate[]>("/api/admin/certificates", { credentials: "include" }),
    retry: false,
  });
}

export function useVerifyCertificateById(certId: string | null) {
  return useQuery({
    queryKey: ["certificate", certId],
    queryFn: () =>
      customFetch<CertRecord>(`/api/certificates/${encodeURIComponent(certId!)}`, {
        credentials: "include",
      }),
    enabled: Boolean(certId),
    retry: false,
  });
}

export function useStoreCertificate() {
  return useMutation({
    mutationFn: (data: StoreCertInput) =>
      customFetch<CertRecord>("/api/certificates", {
        method: "POST",
        credentials: "include",
        body: JSON.stringify(data),
      }),
  });
}

export function useAdminDeleteUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (userId: number) =>
      customFetch<{ success: boolean }>(`/api/admin/users/${userId}`, {
        method: "DELETE",
        credentials: "include",
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "users"] }),
  });
}

export function useAdminUpdateUserRole() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, role }: { userId: number; role: "user" | "admin" }) =>
      customFetch<{ id: number; name: string; email: string; role: string }>(
        `/api/admin/users/${userId}/role`,
        {
          method: "PATCH",
          credentials: "include",
          body: JSON.stringify({ role }),
        }
      ),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "users"] }),
  });
}

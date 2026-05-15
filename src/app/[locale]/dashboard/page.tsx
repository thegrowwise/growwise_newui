import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { BookOpen, ExternalLink, LogOut, GraduationCap, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import LogoutButton from '@/components/LogoutButton';

export const metadata: Metadata = {
  title: 'My Dashboard | GrowWise School',
  description: 'Access your enrolled GrowWise courses.',
  robots: { index: false, follow: false },
};

// Shape returned by Tutor LMS enrolled-courses endpoint
interface TutorCourse {
  id: number;
  post_title: string;
  post_status: string;
  guid?: string;
  permalink?: string;
  thumbnail?: string;
  completed_percent?: number;
  course_progress?: number;
}

interface TutorEnrolledResponse {
  data?: TutorCourse[] | { posts?: TutorCourse[] };
  status_code?: number;
}

async function fetchEnrolledCourses(token: string): Promise<{
  courses: TutorCourse[];
  error?: string;
  expired?: boolean;
}> {
  try {
    const res = await fetch(
      'https://learn.thegrowwise.com/wp-json/tutor/v1/enrolled-courses',
      {
        headers: { Authorization: `Bearer ${token}` },
        next: { revalidate: 0 },
      },
    );

    if (res.status === 401 || res.status === 403) {
      return { courses: [], expired: true };
    }

    if (!res.ok) {
      return { courses: [], error: `Could not load courses (${res.status}).` };
    }

    const payload = (await res.json()) as TutorEnrolledResponse | TutorCourse[];

    // Tutor LMS can return either a plain array or { data: [...] } or { data: { posts: [...] } }
    let courses: TutorCourse[] = [];
    if (Array.isArray(payload)) {
      courses = payload;
    } else if (Array.isArray((payload as TutorEnrolledResponse).data)) {
      courses = (payload as TutorEnrolledResponse).data as TutorCourse[];
    } else if ((payload as TutorEnrolledResponse).data && typeof (payload as TutorEnrolledResponse).data === 'object') {
      const inner = ((payload as TutorEnrolledResponse).data as { posts?: TutorCourse[] }).posts;
      courses = Array.isArray(inner) ? inner : [];
    }

    return { courses };
  } catch {
    return { courses: [], error: 'Network error fetching courses.' };
  }
}

export default async function DashboardPage() {
  const jar = await cookies();
  const token = jar.get('gw_token')?.value;

  if (!token) redirect('/login');

  const { courses, error, expired } = await fetchEnrolledCourses(token);

  // Token expired — clear cookie and redirect to login
  if (expired) {
    // Can't mutate cookies in a Server Component render — use a redirect
    // The logout API route clears the cookie; we redirect there then on to /login.
    redirect('/api/auth/logout-redirect');
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F8FAFC] to-white">
      {/* Slim header */}
      <header className="border-b border-[#1F396D]/10 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" aria-label="GrowWise home">
            <Image
              src="/assets/growwise-logo.png"
              alt="GrowWise"
              width={130}
              height={36}
              className="h-7 w-auto"
            />
          </Link>
          <LogoutButton />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-10 space-y-8">
        {/* Heading */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#1F396D]/10 flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-[#1F396D]" aria-hidden />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#1F396D]">My Courses</h1>
            <p className="text-xs text-gray-500">Your enrolled GrowWise programs</p>
          </div>
        </div>

        {/* Error state */}
        {error && (
          <div className="flex items-start gap-3 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3">
            <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" aria-hidden />
            <p className="text-sm text-amber-800">{error}</p>
          </div>
        )}

        {/* Empty state */}
        {!error && courses.length === 0 && (
          <Card className="border border-[#1F396D]/10">
            <CardContent className="py-12 text-center space-y-3">
              <BookOpen className="w-8 h-8 text-gray-300 mx-auto" aria-hidden />
              <p className="font-medium text-gray-700">No courses enrolled yet</p>
              <p className="text-sm text-gray-500">
                Complete the free self-check or contact GrowWise to get started.
              </p>
              <div className="flex justify-center gap-3 pt-2">
                <Link
                  href="/self-check"
                  className="text-sm font-semibold text-white bg-[#F16112] hover:bg-[#d54f0a] px-4 py-2 rounded-lg transition-colors"
                >
                  Take the Self-Check
                </Link>
                <Link
                  href="/enroll"
                  className="text-sm font-semibold text-[#1F396D] border border-[#1F396D]/30 hover:border-[#1F396D] px-4 py-2 rounded-lg transition-colors"
                >
                  Enroll in a Program
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Course grid */}
        {courses.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {courses.map((course) => {
              const progress = course.completed_percent ?? course.course_progress ?? 0;
              const courseUrl =
                course.permalink ??
                course.guid ??
                `https://learn.thegrowwise.com/?p=${course.id}`;

              return (
                <Card
                  key={course.id}
                  className="border border-[#1F396D]/10 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden"
                >
                  {/* Thumbnail */}
                  {course.thumbnail ? (
                    <div className="relative h-36 w-full bg-[#1F396D]/5">
                      <Image
                        src={course.thumbnail}
                        alt={course.post_title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    </div>
                  ) : (
                    <div className="h-36 w-full bg-gradient-to-br from-[#1F396D]/10 to-[#F16112]/10 flex items-center justify-center">
                      <BookOpen className="w-8 h-8 text-[#1F396D]/30" aria-hidden />
                    </div>
                  )}

                  <CardContent className="p-4 space-y-3">
                    <h2 className="text-sm font-bold text-[#1F396D] leading-snug line-clamp-2">
                      {course.post_title}
                    </h2>

                    {/* Progress bar */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>Progress</span>
                        <span className="font-semibold text-[#1F396D]">{Math.round(progress)}%</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-gray-100 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-[#F16112] transition-all"
                          style={{ width: `${Math.min(100, Math.round(progress))}%` }}
                          role="progressbar"
                          aria-valuenow={Math.round(progress)}
                          aria-valuemin={0}
                          aria-valuemax={100}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      {progress >= 100 ? (
                        <Badge className="bg-green-100 text-green-700 border-green-200 border text-xs">
                          Completed
                        </Badge>
                      ) : progress > 0 ? (
                        <Badge className="bg-[#F16112]/10 text-[#F16112] border-[#F16112]/20 border text-xs">
                          In Progress
                        </Badge>
                      ) : (
                        <Badge className="bg-gray-100 text-gray-600 border-gray-200 border text-xs">
                          Not Started
                        </Badge>
                      )}

                      <a
                        href={courseUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-semibold text-[#1F396D] hover:text-[#F16112] transition-colors"
                      >
                        Open course
                        <ExternalLink className="w-3 h-3" aria-hidden />
                      </a>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

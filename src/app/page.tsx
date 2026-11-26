import { sanityClient } from '@/lib/sanity';
import HeroSection from '@/components/home/HeroSection';
import PortalModules from '@/components/home/PortalModules';
import EnrollmentBreakdown, { type ClassStat } from '@/components/home/EnrollmentBreakdown';
import AcademicPillars from '@/components/home/AcademicPillars';
import Footer from '@/components/home/Footer';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface StudentSummary {
  class: string;
  gender?: string;
  status?: string;
}

const ORDERED_CLASSES = ['Pre-Primary', '1', '2', '3', '4', '5', '6', '7', '8'];

async function getSchoolStats() {
  const query = `*[_type == "masterData" && coalesce(status, "active") == "active"]{
    class,
    gender,
    "status": coalesce(status, "active")
  }`;

  const activeStudents = await sanityClient.fetch<StudentSummary[]>(
    query,
    {},
    { cache: 'no-store' }
  );

  const totalActive = activeStudents.length;
  const girlsCount = activeStudents.filter(
    (s) => s.gender?.toLowerCase() === 'female'
  ).length;
  const boysCount = activeStudents.filter(
    (s) => s.gender?.toLowerCase() === 'male'
  ).length;

  const classBreakdown: ClassStat[] = ORDERED_CLASSES.map((cls) => {
    const count = activeStudents.filter((s) => s.class === cls).length;
    return {
      key: cls,
      label: cls === 'Pre-Primary' ? 'Pre-Primary' : `Class ${cls}`,
      count,
    };
  });

  const maxClassCount = Math.max(...classBreakdown.map((c) => c.count), 1);

  return {
    totalActive,
    girlsCount,
    boysCount,
    classBreakdown,
    maxClassCount,
  };
}

export default async function HomePage() {
  const { totalActive, girlsCount, boysCount, classBreakdown, maxClassCount } =
    await getSchoolStats();

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100 selection:bg-cyan-400 selection:text-slate-950">
      {/* Ambient Cyberpunk Glows */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/4 h-[28rem] w-[28rem] rounded-full bg-cyan-500/10 blur-[140px]" />
        <div className="absolute top-1/3 right-1/4 h-[28rem] w-[28rem] rounded-full bg-fuchsia-600/10 blur-[140px]" />
        <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-emerald-500/10 blur-[130px]" />
      </div>

      <main className="relative mx-auto max-w-7xl space-y-20 px-4 py-12 sm:px-6 lg:px-8">
        <HeroSection
          totalActive={totalActive}
          girlsCount={girlsCount}
          boysCount={boysCount}
        />

        <PortalModules />

        <section className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <EnrollmentBreakdown
            classBreakdown={classBreakdown}
            maxClassCount={maxClassCount}
          />
          <AcademicPillars />
        </section>
      </main>

      <Footer />
    </div>
  );
}
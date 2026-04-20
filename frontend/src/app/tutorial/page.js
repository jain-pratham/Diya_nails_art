import Link from "next/link";

const steps = [
  "Prep your nails by cleaning and shaping them.",
  "Match your set to the occasion and outfit.",
  "Apply adhesive carefully and press each nail firmly.",
  "Finish with cuticle oil for a polished look.",
];

export default function TutorialPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <section className="rounded-[2rem] bg-[#FFF8F2] p-8 sm:p-12 border border-[#E8DCCB]/60">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#B39178]">Tutorial</p>
        <h1 className="mt-4 text-3xl sm:text-5xl font-semibold tracking-tight text-[#222]">
          Simple application guide
        </h1>
        <p className="mt-4 text-sm sm:text-base text-[#6B5A4C]">
          A beginner-friendly routine for applying press-on nails at home.
        </p>
      </section>

      <section className="mt-10 rounded-[1.75rem] border border-gray-100 bg-white p-6 sm:p-8 shadow-sm">
        <ol className="space-y-4">
          {steps.map((step, index) => (
            <li key={step} className="flex gap-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#F7F1E5] text-sm font-semibold text-[#76543F]">
                {index + 1}
              </span>
              <p className="pt-1 text-sm sm:text-base text-gray-700">{step}</p>
            </li>
          ))}
        </ol>
        <Link href="/shop" className="mt-8 inline-flex text-sm font-semibold text-[#B39178]">
          Browse collections
        </Link>
      </section>
    </main>
  );
}

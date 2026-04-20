import Link from "next/link";

const designs = [
  {
    title: "French-Inspired Nails",
    description: "Clean, timeless looks for an elegant everyday style.",
    href: "/category/french",
  },
  {
    title: "Bridal Nails",
    description: "Soft and romantic styles designed for special moments.",
    href: "/category/bridal",
  },
  {
    title: "Glossy Finishes",
    description: "High-shine sets that feel polished and modern.",
    href: "/category/glossy",
  },
];

export default function DesignerNailsPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <section className="rounded-[2rem] bg-[#FCF9F5] p-8 sm:p-12 border border-[#E8DCCB]/60">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#B39178]">Designer Nails</p>
        <h1 className="mt-4 text-3xl sm:text-5xl font-semibold tracking-tight text-[#222]">
          Curated looks with a premium feel
        </h1>
        <p className="mt-4 max-w-2xl text-sm sm:text-base text-[#6B5A4C]">
          Explore elevated nail styles for weddings, everyday wear, and special occasions.
        </p>
      </section>

      <section className="mt-10 grid gap-6 md:grid-cols-3">
        {designs.map((item) => (
          <article key={item.title} className="rounded-[1.75rem] border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900">{item.title}</h2>
            <p className="mt-2 text-sm text-gray-600">{item.description}</p>
            <Link href={item.href} className="mt-5 inline-flex text-sm font-semibold text-[#B39178]">
              View collection
            </Link>
          </article>
        ))}
      </section>
    </main>
  );
}

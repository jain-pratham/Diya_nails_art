import Link from "next/link";

const saleItems = [
  {
    title: "Wedding Set",
    description: "Soft, elegant styles for bridal occasions.",
    href: "/category/bridal",
  },
  {
    title: "Party Set",
    description: "Bold designs made for celebrations.",
    href: "/category/party",
  },
  {
    title: "Holiday Set",
    description: "Festive looks with a polished finish.",
    href: "/category/glossy",
  },
];

export default function SalePage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <section className="rounded-[2rem] bg-[#FCF9F5] p-8 sm:p-12 border border-[#E8DCCB]/60">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#B39178]">Sale</p>
        <h1 className="mt-4 text-3xl sm:text-5xl font-semibold tracking-tight text-[#222]">
          Fresh styles, special pricing
        </h1>
        <p className="mt-4 max-w-2xl text-sm sm:text-base text-[#6B5A4C]">
          Explore featured nail sets that are perfect for weddings, parties, and festive moments.
        </p>
      </section>

      <section className="mt-10 grid gap-6 md:grid-cols-3">
        {saleItems.map((item) => (
          <article key={item.title} className="rounded-[1.75rem] border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900">{item.title}</h2>
            <p className="mt-2 text-sm text-gray-600">{item.description}</p>
            <Link href={item.href} className="mt-5 inline-flex text-sm font-semibold text-[#B39178]">
              Shop now
            </Link>
          </article>
        ))}
      </section>
    </main>
  );
}

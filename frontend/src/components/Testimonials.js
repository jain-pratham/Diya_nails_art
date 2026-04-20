"use client";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Jenkins",
    review: "I can't believe these are press-ons! They look exactly like my $80 salon manicure, but took only 10 minutes to apply. Absolutely obsessed.",
    stars: 5,
  },
  {
    name: "Priya Sharma",
    review: "The quality is unmatched. I've reused my favorite set three times now and they still look brand new. The glue is strong but gentle.",
    stars: 5,
  },
  {
    name: "Emily Chen",
    review: "Finally found press-ons that actually fit my small nail beds! The sizing guide was perfect. Getting so many compliments.",
    stars: 5,
  }
];

export default function Testimonials() {
  return (
    <section className="w-full py-16 md:py-24 bg-white">
      <div className="max-w-[1410px] mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 md:mb-14 gap-5 md:gap-6">
          <div className="max-w-xl">
            <h2 className="text-2xl sm:text-3xl md:text-[34px] text-[#333333] font-normal tracking-tight mb-2 md:mb-3">Loved by Our Community</h2>
            <p className="text-[#76543F]/80 text-sm sm:text-base md:text-lg">Don't just take our word for it. See what our babes have to say.</p>
          </div>
          <div className="text-left md:text-right">
            <p className="text-3xl md:text-4xl text-[#333333] font-light">4.9/5</p>
            <div className="flex gap-1 mt-1 justify-start md:justify-end">
              {[...Array(5)].map((_, i) => <Star key={i} size={16} className="fill-[#B39178] text-[#B39178]" />)}
            </div>
            <p className="text-sm text-gray-500 mt-1">Based on 1,200+ reviews</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {testimonials.map((test, idx) => (
            <div key={idx} className="bg-[#FCF9F5] rounded-[2rem] p-6 sm:p-8 md:p-10 border border-[#F8F1E7] hover:shadow-lg transition-shadow duration-300">
              <div className="flex gap-1 mb-6">
                {[...Array(test.stars)].map((_, i) => <Star key={i} size={18} className="fill-[#C181C8] text-[#C181C8]" />)}
              </div>
              <p className="text-[#333333] text-base leading-loose mb-8 font-light italic">
                "{test.review}"
              </p>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#E8DCCB] flex items-center justify-center text-[#76543F] font-medium border border-white">
                  {test.name.charAt(0)}
                </div>
                <h4 className="text-[#333333] font-medium text-sm">{test.name}</h4>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

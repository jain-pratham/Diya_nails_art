"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "How to use press-on nails?",
    a: "Start by gently pushing back your cuticles and gently buffing the nail bed. Wipe with an alcohol pad to remove oils. Apply a dot of our premium glue to both your natural nail and the press-on, align it with the cuticle, and press firmly for 15 seconds."
  },
  {
    q: "How long do they last?",
    a: "With our adhesive tabs, you can expect 1-3 days of wear (perfect for weekend events). With our brush-on nail glue, you can enjoy 10-14 days of flawless wear, depending on your lifestyle and proper application."
  },
  {
    q: "Can they be reused?",
    a: "Yes! All Diya's Nail Art press-ons are completely reusable. If you use adhesive tabs, simply peel them off. If you use glue, you can gently file away the dried glue residue on the back of the nail before re-applying."
  },
  {
    q: "Do they damage natural nails?",
    a: "Not at all. When applied and removed correctly, press-on nails are completely safe and do not damage your natural nail beds. Never force or pull the nails off—always soak them in warm soapy water with a little oil to loosen the adhesive."
  }
];

export default function FAQSection() {
  const [openIdx, setOpenIdx] = useState(0);

  return (
    <section className="w-full py-24 bg-[#FCF9F5]">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-[34px] text-[#333333] font-normal tracking-tight">Frequently Asked Questions</h2>
          <p className="text-[#B39178] mt-3 font-medium">Everything you need to know about our nails</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div 
                key={idx} 
                className={`bg-white rounded-2xl overflow-hidden transition-all duration-300 border ${isOpen ? 'border-[#B39178]/40 shadow-sm' : 'border-transparent'}`}
              >
                <button 
                  onClick={() => setOpenIdx(isOpen ? -1 : idx)}
                  className="w-full flex items-center justify-between p-6 text-left"
                >
                  <span className="text-[#333333] font-medium text-[15px] md:text-base">{faq.q}</span>
                  <ChevronDown 
                    size={20} 
                    className={`text-[#B39178] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
                  />
                </button>
                
                <div 
                  className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[200px] pb-6 opacity-100' : 'max-h-0 opacity-0'}`}
                >
                  <p className="text-[#76543F]/80 text-[14px] leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

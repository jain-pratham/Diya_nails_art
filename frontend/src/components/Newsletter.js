"use client";

export default function Newsletter() {
  return (
    <section className="w-full py-16 md:py-24 bg-white">
      <div className="max-w-[1410px] mx-auto px-4 sm:px-6">
        <div className="bg-[#FAF5F0] rounded-[2rem] p-6 sm:p-10 md:p-20 text-center border border-[#E8DCCB] shadow-sm max-w-5xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl text-[#333333] font-light tracking-tight mb-4">
            Join <span className="font-medium italic text-[#B39178]">Diya's Club</span>
          </h2>
          <p className="text-[#76543F]/80 text-sm sm:text-base md:text-lg mb-8 sm:mb-10 max-w-xl mx-auto leading-relaxed">
            Subscribe to receive exclusive offers, early access to new drops, and professional nail care tips directly to your inbox.
          </p>

          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
            <input 
              type="email" 
              placeholder="Enter your email address" 
              className="flex-1 bg-white border border-[#E8DCCB] px-5 sm:px-6 py-3.5 sm:py-4 rounded-full text-[#333333] outline-none focus:border-[#B39178] focus:ring-1 focus:ring-[#B39178] transition-all shadow-sm placeholder:text-gray-400"
              required
            />
            <button 
              type="submit" 
              className="bg-[#76543F] hover:bg-[#B39178] text-white px-8 py-3.5 sm:py-4 rounded-full font-medium transition-colors shadow-md whitespace-nowrap"
            >
              Subscribe
            </button>
          </form>
          <p className="text-xs text-gray-400 mt-5">By subscribing, you agree to our Terms of Service and Privacy Policy.</p>
        </div>
      </div>
    </section>
  );
}

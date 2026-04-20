"use client";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const posts = [
  {
    title: "How to Make Your Press-Ons Last 14 Days",
    date: "March 12, 2026",
    desc: "The ultimate guide to nail prep and application for the longest lasting natural look.",
    image: "/blog1.jpg",
  },
  {
    title: "Trending: The Glazed Donut Look is Back",
    date: "February 28, 2026",
    desc: "Why chrome and glazed finishes are dominating this season and how to style them.",
    image: "/blog2.jpg",
  },
  {
    title: "Safe Removal: Protecting Your Natural Nails",
    date: "February 15, 2026",
    desc: "Step-by-step instructions on removing your fake nails without causing any damage.",
    image: "/blog3.jpg",
  }
];

export default function BlogSection() {
  return (
    <section className="w-full py-20 bg-white">
      <div className="max-w-[1410px] mx-auto px-6">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-[34px] text-[#333333] font-normal tracking-tight">On The Journal</h2>
          <p className="text-[#B39178] mt-3 font-medium">Tips, trends, and nail care</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map((post, idx) => (
            <Link href="#" key={idx} className="group block">
              <div className="w-full">
                <div className="relative w-full aspect-[4/3] rounded-[2rem] overflow-hidden mb-6 bg-[#FCF9F5]">
                  <Image 
                    src={post.image} 
                    fill 
                    alt={post.title} 
                    unoptimized
                    className="object-cover group-hover:scale-105 transition-transform duration-700" 
                    onError={(e) => { e.target.style.display='none'; }}
                  />
                  <div className="absolute inset-0 bg-[#E8DCCB] opacity-50 -z-10"></div>
                </div>
                
                <p className="text-xs text-[#B39178] font-semibold tracking-wider uppercase mb-3">{post.date}</p>
                <h3 className="text-xl text-[#333333] font-medium leading-snug mb-3 group-hover:text-[#B39178] transition-colors">{post.title}</h3>
                <p className="text-[#76543F]/80 text-sm leading-relaxed mb-4">{post.desc}</p>
                
                <div className="inline-flex items-center gap-1 text-[#333333] text-sm font-medium group-hover:text-[#B39178] transition-colors">
                  Read More <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

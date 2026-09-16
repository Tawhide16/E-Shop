import React from 'react';
import { SectionConfig } from '../../types/cms';

export const EditorialSection: React.FC<{ section: SectionConfig }> = ({ section }) => {
  return (
    <section className="w-full px-4 sm:px-8 lg:px-12 py-12 font-sans">
      <div className="w-full space-y-6 text-gray-800">
        <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black font-mono">
          WORKOUT CLOTHES & GYM CLOTHES
        </h2>
        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-medium">
          Workout Clothes designed to help you become your personal best. Because when it comes to performing at your max, there should be no obstacles – least of all your workout clothes. Functional and comfortable, we create workout clothing you'll sweat in. Since 2012, we've designed and created the workout clothes we want to wear, because training and its people are what we know best.
        </p>

        <div className="space-y-2 pt-2">
          <h3 className="text-lg font-black uppercase tracking-tight text-black font-mono">
            GYM CLOTHES BUILT IN THE WEIGHT ROOM
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-medium">
            Our legacy was founded in the weight room. Gymshark was founded with a love for training and that passion continues into all our gym clothes today. You'll find the latest innovation in gym clothing and accessories to help you perform at your best and recover in style.
          </p>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-medium">
            Our <strong className="text-black font-bold">Men's Workout Clothes</strong> feature sweat wicking <strong className="text-black font-bold">workout shirts</strong> and <strong className="text-black font-bold">tank tops</strong>, <strong className="text-black font-bold">gym shorts</strong>, <strong className="text-black font-bold">sweatpants</strong> and more. Whilst our <strong className="text-black font-bold">Women's Workout Clothes</strong> are designed for a range of movements and feature sophisticated seamless technology, clever contouring and durable, quick-dry sweat wicking fabrics on <strong className="text-black font-bold">leggings</strong>, <strong className="text-black font-bold">sports bras</strong> and more.
          </p>
        </div>

        <div className="space-y-2 pt-2">
          <h3 className="text-lg font-black uppercase tracking-tight text-black font-mono">
            ACTIVEWEAR & ATHLEISURE
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-medium">
            An obsession with lifting is what started this brand, and we haven't forgotten our roots. Our <strong className="text-black font-bold">Women's</strong> and <strong className="text-black font-bold">Men's Bodybuilding clothes</strong> feature classic styles, with modern cuts and innovative fabrics to help you raise the bar.
          </p>
        </div>

        <div className="space-y-2 pt-2">
          <h3 className="text-lg font-black uppercase tracking-tight text-black font-mono">
            MORE THAN YOUR BEST WORKOUT CLOTHING
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-medium">
            The Gymshark community is devoted to unlocking potential through conditioning and the things we do today to prepare for tomorrow. It's every setback, step-up and milestone along the way. Game-changing workout clothing, running clothes and loungewear essentials. It's not just in the designs, it's in the people who wear them.
          </p>
        </div>
      </div>
    </section>
  );
};

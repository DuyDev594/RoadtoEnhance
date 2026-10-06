<template>
  <div class="min-h-screen bg-white dark:bg-gray-900 font-sans text-gray-900 dark:text-gray-100 transition-colors duration-300 w-full">
    
    <!-- Hero Banner (Full Bleed Edge-to-Edge) -->
    <section class="relative w-full bg-gradient-to-r from-slate-950 via-blue-950 to-slate-900 py-16 md:py-28 px-4 sm:px-6 lg:px-8 shadow-xl">
      <div class="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div class="text-left order-2 md:order-1">
          <h1 class="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight tracking-tight">
            About <span class="bg-gradient-to-r from-blue-400 to-sky-300 bg-clip-text text-transparent">RoadtoEnhance</span>
          </h1>
          <p class="text-lg md:text-xl text-blue-100/90 max-w-xl leading-relaxed mb-8">
            Empowering your English journey through modern interactive paths and borderless learning experiences.
          </p>
          <div class="flex gap-4">
            <button 
              @click="goToLogin"
              class="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-blue-600/30 active:scale-95 cursor-pointer">
              Get Started
            </button>
          </div>
        </div>

        <div class="order-1 md:order-2 flex justify-center items-center">
          <div class="relative w-full max-w-[420px] aspect-square rounded-3xl overflow-hidden shadow-2xl border-4 border-white/10 bg-white/5 backdrop-blur-md">
            <img 
              src="/R2E.png" 
              alt="RoadtoEnhance Banner" 
              class="w-full h-full object-contain p-4"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- Mission Section -->
    <section class="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div class="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
        <div class="space-y-6">
          <h2 class="text-2xl sm:text-3xl font-bold flex items-center gap-3">
            <span class="w-2.5 h-8 bg-blue-600 rounded-full"></span>
            Our Mission
          </h2>
          <p class="text-gray-600 dark:text-gray-400 leading-relaxed text-base sm:text-lg">
            Our mission is to provide high-quality, engaging, and effective English learning resources that empower individuals to communicate confidently in English. 
          </p>
          <p class="text-gray-600 dark:text-gray-400 leading-relaxed text-base sm:text-lg">
            We believe that language learning should be accessible, enjoyable, and tailored to the needs of each learner. It's not just about grammar; it's about opening new doors to the world.
          </p>
        </div>

        <div class="grid grid-cols-2 gap-4 sm:gap-6">
          <div v-for="(stat, i) in stats" :key="i" 
               class="bg-gray-50 dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700/80 text-center transition-colors shadow-xs">
            <div class="text-3xl sm:text-4xl font-extrabold text-blue-600 dark:text-blue-400">{{ stat.value }}</div>
            <div class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider mt-1.5">{{ stat.label }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-16 sm:py-24 bg-slate-50 dark:bg-gray-800/40 px-4 sm:px-6 lg:px-8 border-y border-gray-100 dark:border-gray-800">
      <div class="max-w-7xl mx-auto">
        <div class="text-center mb-12 sm:mb-16">
          <h2 class="text-2xl sm:text-3xl font-bold">Outstanding Features</h2>
          <p class="text-gray-500 dark:text-gray-400 mt-3 text-sm sm:text-base">Everything you need to master English in one place</p>
        </div>
        
        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          <div v-for="(feature, index) in features" :key="index" 
            class="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/80 hover:-translate-y-2 transition-all duration-300">
            <div class="w-12 h-12 sm:w-14 sm:h-14 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl mb-6">
              <font-awesome-icon :icon="feature.icon" />
            </div>
            <h3 class="font-bold text-lg sm:text-xl text-gray-800 dark:text-gray-100 mb-3">{{ feature.title }}</h3>
            <p class="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">{{ feature.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Callout Section -->
    <section class="py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
      <div class="max-w-4xl mx-auto bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[2rem] p-8 sm:p-14 text-center text-white relative overflow-hidden shadow-2xl shadow-blue-500/20 dark:shadow-none">
        <div class="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full opacity-50"></div>
        
        <div class="relative z-10">
          <h2 class="text-3xl md:text-4xl font-extrabold mb-6">Have Questions or Feedback?</h2>
          <p class="text-blue-100 mb-10 text-base sm:text-lg max-w-xl mx-auto">
            We value your input and are always looking for ways to improve our platform.
          </p>
          <a 
            href="mailto:contact@roadtoenhance.com" 
            class="inline-block bg-white text-blue-600 px-10 py-4 rounded-full font-bold text-base sm:text-lg hover:bg-blue-50 transition-all transform hover:scale-105 shadow-md"
          >
            Contact@roadtoenhance.com
          </a> 
          <p class="mt-8 text-blue-200 font-medium text-sm sm:text-base">
            Thank you for choosing RoadtoEnhance as your language learning partner!
          </p>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

const stats = [
    { label: 'Lessons', value: '100+' },
    { label: 'Support', value: '24/7' },
    { label: 'Resources', value: 'Free' },
    { label: 'Community', value: 'Global' }
];

const features = [
    {
        icon: 'book',
        title: 'Interactive Lessons',
        desc: 'Engaging multimedia content, quizzes, and real-life scenarios designed for effective learning.'
    },
    {
        icon: 'bullseye',
        title: 'Personalized Paths',
        desc: 'Tailored learning journeys based on your proficiency level and specific language goals.'
    },
    {
        icon: 'chart-line',
        title: 'Progress Tracking',
        desc: 'Stay motivated with a built-in system that visualizes your improvement over time.'
    }
];

const goToLogin = () => {
    router.push("/auth/login");
};
</script>
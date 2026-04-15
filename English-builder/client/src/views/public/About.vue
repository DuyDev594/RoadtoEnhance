<template>
  <div class="min-h-screen bg-white dark:bg-gray-900 font-sans text-gray-900 dark:text-gray-100 transition-colors duration-300">
    
    <section class="relative bg-gradient-to-r from-slate-900 to-blue-900 py-16 md:py-24 px-6">
      <div class="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div class="text-left order-2 md:order-1">
          <h1 class="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
            About <span class="text-blue-400">RoadtoEnhance</span>
          </h1>
          <p class="text-lg md:text-xl text-blue-100 max-w-xl leading-relaxed mb-8">
            Empowering your English journey through modern interactive paths and borderless learning experiences.
          </p>
          <div class="flex gap-4">
            <button 
              @click="goToLogin"
              class="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-bold transition-all shadow-lg active:scale-95">
              Get Started
            </button>
          </div>
        </div>

        <div class="order-1 md:order-2 flex justify-center items-center">
          <div class="relative w-full max-w-[400px] aspect-square rounded-2xl overflow-hidden shadow-2xl border-4 border-white/10">
            <img 
              src="/R2E.png" 
              alt="RoadtoEnhance Banner" 
              class="w-full h-full object-contain bg-white/5"
            />
          </div>
        </div>
      </div>
    </section>

    <section class="py-20 px-6 max-w-7xl mx-auto">
      <div class="grid md:grid-cols-2 gap-16 items-center">
        <div class="space-y-6">
          <h2 class="text-3xl font-bold flex items-center gap-3">
            <span class="w-2 h-8 bg-blue-600 rounded-full"></span>
            Our Mission
          </h2>
          <p class="text-gray-600 dark:text-gray-400 leading-relaxed text-lg">
            Our mission is to provide high-quality, engaging, and effective English learning resources that empower individuals to communicate confidently in English. 
          </p>
          <p class="text-gray-600 dark:text-gray-400 leading-relaxed text-lg">
            We believe that language learning should be accessible, enjoyable, and tailored to the needs of each learner. It's not just about grammar; it's about opening new doors to the world.
          </p>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div v-for="(stat, i) in stats" :key="i" 
               class="bg-gray-50 dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 text-center transition-colors">
            <div class="text-3xl font-bold text-blue-600 dark:text-blue-400">{{ stat.value }}</div>
            <div class="text-sm text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider mt-1">{{ stat.label }}</div>
          </div>
        </div>
      </div>
    </section>

    <section class="py-20 bg-slate-50 dark:bg-gray-800/50 px-6">
      <div class="max-w-7xl mx-auto">
        <div class="text-center mb-16">
          <h2 class="text-3xl font-bold">Outstanding Features</h2>
          <p class="text-gray-500 dark:text-gray-400 mt-3">Everything you need to master English in one place</p>
        </div>
        
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div v-for="(feature, index) in features" :key="index" 
            class="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:-translate-y-2 transition-all duration-300">
            <div class="w-14 h-14 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center text-3xl mb-6">
              <font-awesome-icon :icon="feature.icon" />
            </div>
            <h3 class="font-bold text-xl text-gray-800 dark:text-gray-100 mb-3">{{ feature.title }}</h3>
            <p class="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">{{ feature.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="py-24 px-6">
      <div class="max-w-4xl mx-auto bg-blue-600 rounded-[2rem] p-12 text-center text-white relative overflow-hidden shadow-2xl shadow-blue-200 dark:shadow-none">
        <div class="absolute -top-10 -right-10 w-40 h-40 bg-blue-500 rounded-full opacity-50"></div>
        
        <div class="relative z-10">
          <h2 class="text-3xl md:text-4xl font-bold mb-6">Have Questions or Feedback?</h2>
          <p class="text-blue-100 mb-10 text-lg">
            We value your input and are always looking for ways to improve our platform.
          </p>
          <a 
            href="mailto:contact@roadtoenhance.com" 
            class="inline-block bg-white text-blue-600 px-10 py-4 rounded-full font-bold text-lg hover:bg-blue-50 transition-all transform hover:scale-105"
          >
            Contact@roadtoenhance.com
          </a> 
          <p class="mt-8 text-blue-200 font-medium">
            Thank you for choosing RoadtoEnhance as your language learning partner!
          </p>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup>
import router from '../../router';
import { useRouter } from "vue-router";

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
    router.push("/auth/Login");
};
</script>
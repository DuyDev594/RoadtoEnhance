<template>
  <footer class="bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 pt-12 pb-8 px-6">
    <div class="max-w-7xl mx-auto">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
        
        <div class="col-span-1 md:col-span-1">
          <div class="flex items-center gap-2 mb-4">
            <img src="/logo.png" alt="R2E Logo" class="h-8 w-auto dark:hidden" />
            <img src="/logowhite.png" alt="R2E Logo" class="h-8 w-auto hidden dark:block" />
            <span class="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
              RoadtoEnhance
            </span>
          </div>
          <p class="text-gray-500 dark:text-gray-400 text-sm leading-relaxed max-w-xs">
            A comprehensive platform designed to empower your English skills through interactive and personalized learning paths.
          </p>
        </div>

        <div class="grid grid-cols-2 gap-8 col-span-1 md:col-span-2 justify-items-end md:justify-items-center">
          <div class="space-y-4">
            <h4 class="font-bold text-gray-900 dark:text-white uppercase tracking-wider text-xs">Resources</h4>
            <ul class="space-y-2">
              <li>
                <RouterLink to="/app/lessons" class="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm">
                  Lessons
                </RouterLink>
              </li>
              <li>
                <RouterLink to="/videos" class="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm">
                  Video Learning
                </RouterLink>
              </li>
              <li>
                <RouterLink to="/app/flashcards" class="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm">
                  Flashcards
                </RouterLink>
              </li>
            </ul>
          </div>

          <div class="space-y-4">
            <h4 class="font-bold text-gray-900 dark:text-white uppercase tracking-wider text-xs">Platform</h4>
            <ul class="space-y-2">
              
              <li>
                <RouterLink to="/" class="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm">
                  About Us
                </RouterLink>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div class="border-t border-gray-100 dark:border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <p class="text-gray-400 dark:text-gray-500 text-xs">
          © 2026 RoadtoEnhance. All rights reserved.
        </p>
        <div class="flex items-center gap-6 text-xs text-gray-400 dark:text-gray-500">
          <span class="hover:text-blue-600 cursor-pointer transition-colors">Privacy Policy</span>
          <span class="hover:text-blue-600 cursor-pointer transition-colors">Terms of Service</span>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
// Không cần logic phức tạp ở đây, RouterLink tự xử lý
</script>

<style scoped>
/* Đảm bảo footer luôn nằm dưới cùng nếu nội dung trang ngắn */
footer {
  margin-top: auto;
}
</style>
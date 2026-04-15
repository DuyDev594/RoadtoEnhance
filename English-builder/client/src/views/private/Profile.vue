<template>
  <div class="p-6">
    <div class="grid grid-cols-12 gap-6">

      <!-- LEFT: PROFILE SIDEBAR -->
      <div class="col-span-12 md:col-span-4">
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow p-6 text-center">

          <!-- Avatar -->
          <img
            :src="avatarUrl"
            class="w-28 h-28 rounded-full mx-auto mb-4 border"
          />

          <h2 class="text-2xl font-semibold text-gray-900 dark:text-gray-100">
            {{ user.username }}
          </h2>

          <p class="text-sm text-gray-500 dark:text-gray-400">
            {{ user.email }}
          </p>

          <!-- Level -->
          <div class="mt-4">

            <p class="text-base text-gray-700 dark:text-gray-300">
              <b>Level:</b>
              <span v-if="user.level">{{ user.level }}</span>
              <span v-else class="text-gray-400 dark:text-gray-500">
                Not tested
              </span>
            </p>

            <p class="mt-2 text-base text-gray-700 dark:text-gray-300">
              <b>Status:</b>

              <span
                v-if="!user.level"
                class="text-orange-600 dark:text-orange-400 font-semibold"
              >
                New user
              </span>

              <span
                v-else
                class="text-green-600 dark:text-green-400 font-semibold"
              >
                Active
              </span>
            </p>

          </div>

          <!-- Edit button -->
          <button
            class="mt-6 w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            @click="goEditProfile"
          >
            Edit Profile
          </button>

        </div>
      </div>

      <!-- RIGHT: DASHBOARD -->
      <div class="col-span-12 md:col-span-8">

        <div class="bg-white dark:bg-gray-800 rounded-xl shadow p-6">

          <h2 class="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
            Learning Activity
          </h2>

          <!-- Chart -->
          <div class="h-[320px] w-full">
            <Bar
              v-if="chartData.labels.length"
              :data="chartData"
              :options="chartOptions"
              :plugins="[ChartDataLabels]"
            />
          </div>

        </div>

      </div>

    </div>
  </div>
</template>

<script setup>

import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";

import api from "../../api/api.js";
import { getLearningActivity } from "@/api/userStats";

import { Bar } from "vue-chartjs";

import {
  Chart,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from "chart.js";

import ChartDataLabels from "chartjs-plugin-datalabels";


Chart.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ChartDataLabels
);

const router = useRouter();
const user = ref({});

const chartData = ref({
  labels: [],
  datasets: [
    {
      label: "Lessons",
      data: [],
      backgroundColor: "#3b82f6",
      borderRadius: 8,
      barThickness: 12,
      maxBarThickness: 14,
      categoryPercentage: 0.5,
      barPercentage: 0.6
    },
    {
      label: "Flashcards",
      data: [],
      backgroundColor: "#22c55e",
      borderRadius: 8,
      barThickness: 12,
      maxBarThickness: 14,
      categoryPercentage: 0.5,
      barPercentage: 0.6
    }
  ]
});

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,

  layout: {
    padding: {
      top: 20
    }
  },

  plugins: {

    legend: {
      position: "bottom",
      labels: {
        boxWidth: 14,
        padding: 20
      }
    },

    datalabels: {
      anchor: "end",
      align: "top",
      offset: 6,
      color: "#374151",
      font: {
        weight: "bold",
        size: 12
      },
      formatter: (value) => value
    }

  },

  scales: {

    y: {
      display: false,
      grace: "40%"
    },

    x: {
      grid: {
        display: false
      }
    }

  }
};


onMounted(async () => {

  try {

    const res = await api.get("/users/me");
    user.value = res.data;

    const activity = await getLearningActivity();

    console.log("Activity API:", activity.data);

    chartData.value.labels = activity.data.map(d =>
      new Date(d.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric"
      })
    );

    chartData.value.datasets[0].data =
      activity.data.map(d => d.lessons);

    chartData.value.datasets[1].data =
      activity.data.map(d => d.flashcards);

  }

  catch (err) {

    console.error("Dashboard load error:", err);

  }

});


const avatarUrl = computed(() =>
  "https://ui-avatars.com/api/?size=128&name=" +
  encodeURIComponent(user.value.username || "User")
);

const goEditProfile = () => {

  router.push("/app/profile/edit");

};

</script>
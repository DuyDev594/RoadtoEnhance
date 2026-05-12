<template>
  <div class="space-y-6">
    <div class="relative w-full aspect-video rounded-3xl overflow-hidden bg-black shadow-lg">
      <div ref="playerContainer" class="w-full h-full"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from "vue";

const props = defineProps({
  videoId: String,
  segments: Array,
  activeIndex: Number,
  trigger: Number
});

const emit = defineEmits(["segment-end"]); // Change to kebab-case for better compatibility
const isPlayerReady = ref(false)
const player = ref(null);
const playerContainer = ref(null);
let timer = null;
let currentEndTime = 0;

const loadYouTubeAPI = () => {
  return new Promise((resolve) => {
    if (window.YT && window.YT.Player) return resolve();
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    window.onYouTubeIframeAPIReady = () => resolve();
  });
};

const initPlayer = async () => {
  await loadYouTubeAPI();

  player.value = new window.YT.Player(playerContainer.value, {
    videoId: props.videoId,
    playerVars: { 
      autoplay: 0,
      modestbranding: 1,
      rel: 0,
      origin: window.location.origin
    },
    events: {
      onReady: () => {
      console.log("YouTube Player Ready")
      isPlayerReady.value = true
    }
  }
    })

}

const playSegment = (segment) => {

  if (!player.value) return

  clearInterval(timer)

  currentEndTime = segment.end

  player.value.seekTo(segment.start, true)

  player.value.playVideo()

  timer = setInterval(() => {

    const currentTime = player.value.getCurrentTime()

    if (currentTime >= currentEndTime) {

      player.value.pauseVideo()

      clearInterval(timer)

      emit("segment-end")

    }

  }, 200)

}

const formatTime = (sec) => {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
};

// Watch for videoId changes if user switches lessons without full page reload
watch(

  () => props.videoId,

  (newId) => {

    if (!player.value || !newId) return

    // clear timer cũ
    clearInterval(timer)

    // stop video cũ
    player.value.stopVideo()

    // load video mới
    player.value.loadVideoById({
      videoId: newId,
      startSeconds: 0
    })

  }

)

watch(() => props.trigger, () => {

  if (!isPlayerReady.value) return

  const seg = props.segments[props.activeIndex]

  if (seg) playSegment(seg, props.activeIndex)

})

onMounted(initPlayer);

onBeforeUnmount(() => {
  clearInterval(timer);
  if (player.value && player.value.destroy) player.value.destroy();
});
</script>
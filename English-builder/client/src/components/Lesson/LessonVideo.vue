<template>
    <div class="relative aspect-video bg-black rounded-xl overflow-hidden">
        <div ref="playerContainer" class="w-full h-full"></div>
    </div>
</template>

<script setup>
import { onMounted, watch, ref, onBeforeUnmount } from "vue";

const props = defineProps({
    videoId: String,
    segment: Object,
    trigger: Number
});

const emit = defineEmits(["segment-ended"]);
const playerContainer = ref(null);
const player = ref(null);
const isReady = ref(false);
let stopChecker = null;

onMounted(() => {
    loadAPI();
});

onBeforeUnmount(() => {
    if (player.value) {
        player.value.destroy();
    }
    if (stopChecker) clearInterval(stopChecker);
});
watch(
    () => props.segment,
    (newSeg) => {
        if (!newSeg || !player.value || !isReady.value) return;
        playSegment(newSeg);
    }
);

watch(
    () => props.trigger,
    () => {
        if (!props.segment || !player.value || !isReady.value) return;
        playSegment(props.segment);
    }
);

function playSegment(seg) {
    if (stopChecker) {
        clearInterval(stopChecker);
        stopChecker = null;
    }

    player.value.seekTo(seg.start, true);
    // player.value.playVideo();

    stopChecker = setInterval(() => {
        if (player.value.getCurrentTime() >= seg.end) {
        player.value.pauseVideo();
        clearInterval(stopChecker);
        stopChecker = null;
        emit("segment-ended");
        }
    }, 200);
}

function loadAPI() {
    if (window.YT && window.YT.Player) {
        createPlayer();
        return;
    }

    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.body.appendChild(tag);

    window.onYouTubeIframeAPIReady = createPlayer;
}

function createPlayer() {
    if (!playerContainer.value || !props.videoId) return;

    player.value = new window.YT.Player(playerContainer.value, {
        videoId: props.videoId,
        playerVars: {
        modestbranding: 1,
        rel: 0
        },
        events: {
        onReady: () => {
            isReady.value = true;
        }
        }
    });
}
</script>
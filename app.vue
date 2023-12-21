<template>
  <div class="bg-black text-white p-8 flex flex-col gap-4 py-32">
    <img v-if="art" :src="art.url" alt="Art" :class="width > height ? 'w-screen' : 'h-screen'"
      class="object-cover fixed scale-150 blur-lg z-0 opacity-20 -translate-x-1/2 left-1/2 -translate-y-1/2 top-1/2">
    <p :id="`line-${index}`" v-for="(line, index) in lines" :class="index === activeLine ? 'opacity-100' : 'opacity-25'"
      class="text-4xl font-bold z-10">
      {{ line.line }}
    </p>
    <p class="opacity-10 text-sm">
      &copy; rxsto {{ new Date().getFullYear() }}
    </p>
  </div>
  <div v-if="track" class="bg-neutral-800 text-white w-full p-8 fixed top-0 z-10">
    <div class="flex gap-2 items-center">
      <img v-if="art" :src="art.url" alt="Art" class="h-6">
      <p class="font-medium">
        {{ track.title }} - {{ track.author }}
      </p>
    </div>
  </div>
  <div class="fixed top-8 right-8 z-20 flex gap-4 items-center">
    <button v-if="hasScrolled" @click="resetScrolling()">
      <Icon name="fluent:arrow-sync-circle-24-filled" class="text-2xl" />
    </button>
    <button @click="settingsActive = !settingsActive">
      <Icon name="fluent:settings-32-filled" class="text-2xl" />
    </button>
  </div>
  <Transition name="fade">
    <div v-if="settingsActive" class="bg-neutral-800 text-white w-full p-8 fixed bottom-0 z-10">
      <div class="flex items-center gap-4">
        <p class="flex gap-1"><span class="opacity-50">Delay:</span>{{ offset }}ms</p>
        <URange :min="-2000" :max="2000" v-model="offset" />
        <UButton @click="offset = DEFAULT_OFFSET">Reset</UButton>
      </div>
    </div>
  </Transition>
</template>

<script lang="ts" setup>
const DEFAULT_OFFSET = 500

const { width, height } = useWindowSize()

const config = useRuntimeConfig()

const baseUrl = config.public.baseUrl
const apiKey = useCookie('apiKey')

apiKey.value = apiKey.value || useRoute().query.apiKey as string

if (!apiKey.value) {
  throw createError({ statusCode: 401, message: 'No API key provided!' })
} else {
  navigateTo('/', { replace: true })
}

const { data: lyrics, refresh } = await useFetch<Lyrics>(`${baseUrl}/current`, {
  headers: {
    'Authorization': apiKey.value
  }
})

const lines = computed(() => lyrics.value?.lines)
const track = computed(() => lyrics.value?.track)
const art = computed(() => track.value?.albumArt[track.value?.albumArt.length - 1])

const activeLine = ref(0)
const scrollingAnchor = ref(0)

const isPlaying = ref(false)
const position = ref(0)
const lastUpdate = ref(Date.now())

const settingsActive = ref(false)

const isScrolling = ref(false)
const hasScrolled = ref(false)

const offset = useLocalStorage('offset', DEFAULT_OFFSET)

let ws: WebSocket | null = null
let interval: NodeJS.Timeout | undefined = undefined

onMounted(() => {
  document.addEventListener('scroll', (_) => {
    if (isScrolling.value) {
      return
    }

    hasScrolled.value = true
  })

  ws = new WebSocket(config.public.wsUrl + `/events?api_key=${apiKey.value}`)

  ws.onopen = (ev) => console.log(ev)
  ws.onclose = (ev) => console.log(ev)
  ws.onerror = (ev) => console.log(ev)

  ws.onmessage = (ev) => {
    const data = JSON.parse(ev.data)
    const type = data.type

    switch (type) {
      case 'player_update':
        const d = data as PlayerStateUpdateEvent
        position.value = d.position
        isPlaying.value = d.playing

        lastUpdate.value = new Date(d.timestamp).getTime()
        break
      case 'player_stopped':
        break
      case 'next_track':
        refresh()
        break
    }

    // player_stopped

    // next_track
  }

  if (!lyrics.value) {
    return
  }

  interval = setInterval(() => {
    if (!lines.value) {
      return
    }

    const currentPosition = position.value + (Date.now() - lastUpdate.value) - offset.value
    const indexOfLine = lines.value.findIndex(l => l.range.start < currentPosition && l.range.end >= currentPosition)

    activeLine.value = indexOfLine

    const el = document.getElementById(`line-${indexOfLine}`)

    if (!el) {
      return
    }

    scrollingAnchor.value = el.offsetTop - (window.innerHeight / 2)
  }, 250)
})

watch(scrollingAnchor, (newAnchor) => {
  if (hasScrolled.value) {
    return
  }

  scrollToPosition(newAnchor)
})

const resetScrolling = () => {
  hasScrolled.value = false
  scrollToPosition(scrollingAnchor.value)
}

const scrollToPosition = (position: number) => {
  isScrolling.value = true

  window.scrollTo({
    top: position,
    behavior: 'smooth'
  })

  setTimeout(() => {
    isScrolling.value = false
  }, 750)
}

onBeforeUnmount(() => {
  clearInterval(interval)

  if (ws) {
    ws.close()
  }
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: transform 300ms ease-in-out;
  transform: translateY(0);
}

.fade-enter-from,
.fade-leave-to {
  transform: translateY(8rem);
}
</style>

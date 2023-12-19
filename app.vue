<template>
  <div class="bg-black text-white p-8 flex flex-col gap-4">
    <p :id="`line-${index}`" v-for="(line, index) in lines" :class="index === activeLine ? 'opacity-100' : 'opacity-25'" class="text-4xl font-bold">
      {{ line.line }}
    </p>
  </div>
</template>

<script lang="ts" setup>
const config = useRuntimeConfig()

const baseUrl = config.public.baseUrl
const apiKey = config.public.apiKey

const { data: lyrics } = await useFetch<Lyrics>(`${baseUrl}/current`, {
  headers: {
    'Authorization': apiKey
  }
})

const lines = ref<Line[]>([])

const activeLine = ref(0)
const scrollingAnchor = ref(0)

const isPlaying = ref(false)
const position = ref(0)
const lastUpdate = ref(Date.now())

let interval = null

onMounted(() => {
  const ws = new WebSocket(config.public.wsUrl + `/events?api_key=${apiKey}`)

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

        lastUpdate.value = Date.now()
        break
      case 'player_stopped':
        break
      case 'next_track':
        break
    }

    // player_stopped

    // next_track
  }

  if (!lyrics.value) {
    return
  }

  lines.value = lyrics.value.lines

  interval = setInterval(() => {
    const currentPosition = position.value + (Date.now() - lastUpdate.value) + 2000
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
  window.scrollTo({
      top: newAnchor,
      behavior: 'smooth'
    })
})
</script>

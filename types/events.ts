interface PlayerStateUpdateEvent {
  playing: boolean,
  position: number,
  timestamp: string
}

interface PlayerStoppedEvent {}

interface NextTrackEvent {
  startPosition: number
}

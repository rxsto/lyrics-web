interface PlayerStateUpdateEvent {
  playing: boolean,
  position: number
}

interface PlayerStoppedEvent {}

interface NextTrackEvent {
  startPosition: number
}

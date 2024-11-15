export interface PlayerStateUpdateEvent {
  playing: boolean,
  position: number,
  timestamp: string
}

export interface PlayerStoppedEvent {}

export interface NextTrackEvent {
  startPosition: number
}

export interface State {
  lyrics: Lyrics,
  time: number,
  position: number
}

export interface Lyrics {
  lines: Line[],
  track: Track
}

export interface Line {
  line: string,
  range: LineRange
}
 
export interface LineRange {
  start: number,
  end: number
}

export interface Track {
  album: string,
  author: string,
  title: string,
  albumArt: AlbumArt[]
}

export interface AlbumArt {
  height: number,
  width: number,
  url: string
}

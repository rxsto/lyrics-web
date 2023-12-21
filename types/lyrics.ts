interface Lyrics {
  lines: Line[],
  track: Track
}

interface Line {
  line: string,
  range: LineRange
}

interface LineRange {
  start: number,
  end: number
}

interface Track {
  album: string,
  author: string,
  title: string,
  albumArt: AlbumArt[]
}

interface AlbumArt {
  height: number,
  width: number,
  url: string
}

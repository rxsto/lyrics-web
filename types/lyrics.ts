interface Lyrics {
  lines: Line[]
}

interface Line {
  line: string,
  range: LineRange
}

interface LineRange {
  start: number,
  end: number
}

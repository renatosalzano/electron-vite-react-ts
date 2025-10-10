const colors = {
  // fg
  // 0: 30,
  bb: 90,
  r: 31,
  g: 32,
  y: 33,
  b: 94,
  m: 95,
  c: 36,
  w: 37,
  // bg
  R: 41,
  G: 42,
  Y: 43,
  B: 44,
  M: 45,
  C: 46,
  W: 47
} as const

function color(n: number, s: string) {
  return `\x1b[${n}m${s}\x1b[0m`
}

global.bb = (str: string) => color(colors.bb, str)
global.r = (str: string) => color(colors.r, str)
global.g = (str: string) => color(colors.g, str)
global.y = (str: string) => color(colors.y, str)
global.b = (str: string) => color(colors.b, str)
global.m = (str: string) => color(colors.m, str)
global.c = (str: string) => color(colors.c, str)
global.w = (str: string) => color(colors.w, str)
global.R = (str: string) => color(colors.R, str)
global.G = (str: string) => color(colors.G, str)
global.Y = (str: string) => color(colors.Y, str)
global.B = (str: string) => color(colors.B, str)
global.M = (str: string) => color(colors.M, str)
global.C = (str: string) => color(colors.C, str)
global.W = (str: string) => color(colors.W, str)


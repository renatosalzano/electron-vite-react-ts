import { mkdir, mkdirSync, writeFile, writeFileSync } from 'fs'
import * as colors from '../material-color/colors.js'
import { join, resolve } from 'path'

export type ColorType = 'light' | 'dark'

export type Color = {
  name: string
  hue: string
  shade?: { name: string, hue: string, type: ColorType }[]
  type: ColorType
}


function calc_opacity(opacity: number) {

  if (opacity < 0) opacity = 0
  if (opacity > 1) opacity = 1

  const intValue = Math.round(opacity * 255)
  const hex = intValue.toString(16).toUpperCase().padStart(2, '0')

  return hex

}

export const build_material_colors = async () => {

  const dir = resolve(process.cwd(), 'vitron/src/material-color')

  const palette = []
  const hue_entries = []

  let index = ''
  let index_export = ''
  let _palette = ''

  let output = `body {
  `

  for (const [color_key, color] of Object.entries(colors)) {

    function gradient(key: string, hex: string) {

      output += '\n\n';

      ['', '80', '60', '40', '20', '10'].forEach((opacity) => {

        if (opacity === '') {

          output += `  --${key}: ${hex};\n`
        } else {

          output += `  --${key}_${opacity}: ${hex}${calc_opacity(Number(opacity) / 100)};\n`
        }

      })

    }

    if (typeof color === 'string') {

      // output += `  --${color_key}: ${color};\n`
      gradient(color_key, color)

    } else {

      Object
        .entries(color)
        .forEach(([key, color]) => {

          // output += `--${color_key}`
          gradient(`${color_key}-${key}`, color)

        })

    }
  }

  output += '\n}';


  mkdirSync(dir, { recursive: true })

  writeFileSync(join(dir, 'material-colors.css'), output)
}


// function is_light_or_dark(hexColor: string) {
//   // 1. Pulizia e normalizzazione del colore HEX
//   // Rimuove l'hash iniziale se presente
//   const hex = hexColor.replace(/^#/, '');

//   // Se è in formato breve (es. "FFF"), lo espande (es. "FFFFFF")
//   const fullHex = hex.length === 3 ?
//     hex.split('').map(c => c + c).join('') :
//     hex;

//   // 2. Estrazione dei componenti RGB
//   const r = parseInt(fullHex.substring(0, 2), 16); // Rosso
//   const g = parseInt(fullHex.substring(2, 4), 16); // Verde
//   const b = parseInt(fullHex.substring(4, 6), 16); // Blu

//   // 3. Calcolo della Luminosità (Media Pesata)
//   // Questa formula è usata spesso in UI design per approssimare la percezione umana
//   // I pesi (0.299, 0.587, 0.114) riflettono la sensibilità dell'occhio ai colori (più sensibile al verde)
//   const brightness = (r * 0.299 + g * 0.587 + b * 0.114);

//   // 4. Soglia di Riferimento
//   // Un valore tipico di soglia (threshold) è 128 (a metà tra 0 e 255)
//   const threshold = 128;

//   // 5. Risultato
//   return brightness > threshold ? 'light' : 'dark';
// }
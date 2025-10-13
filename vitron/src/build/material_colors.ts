// import { mkdir, mkdirSync, writeFile, writeFileSync } from 'fs'
// import * as colors from '../material-color/colors.js'
// import { join, resolve } from 'path'

// export type ColorType = 'light' | 'dark'

// export type Color = {
//   name: string
//   hue: string
//   shade?: { name: string, hue: string, type: ColorType }[]
//   type: ColorType
// }

// export const build_material_colors = async () => {

//   const dir = resolve(process.cwd(), 'vitron/src/material-color')

//   const palette = []
//   const hue_entries = []

//   let index = ''
//   let index_export = ''
//   let _palette = ''

//   for (const [color_key, color] of Object.entries(colors)) {

//     let output = `export const ${color_key} = {
//   `

//     let Color: Color = {
//       name: color_key,
//       hue: '',
//       type: 'dark'
//     }


//     if (typeof color === 'string') {

//       Color.hue = color
//       Color.type = is_light_or_dark(color)
//       hue_entries.push([color, Color])

//       output += `hue:'${color}',
//   type: '${is_light_or_dark(color)}'
// `

//     } else {

//       output += `hue:'${color[500]}',
//   type: '${is_light_or_dark(color[500])}',
//   shade: {
// `

//       Color.hue = color[500]
//       Color.type = is_light_or_dark(color[500])

//       Color.shade = Object.entries(color)
//         .map(([key, value]) => {

//           const _color = value as string

//           hue_entries.push([_color, Color])

//           output += `    ${key}: {\n      hue: '${value}',\n      type: '${is_light_or_dark(_color)}'\n    },\n`

//           return ({
//             name: color_key + key,
//             hue: _color,
//             type: is_light_or_dark(_color)
//           })
//         })

//       hue_entries.push([color[500], Color])
//       output += '\n}'

//     }

//     output += '} as const;'
//     writeFileSync(join(dir, `${color_key}.ts`), output)

//     palette.push(Color)
//     index += `import { ${color_key} } from './${color_key}.js';\n`
//     index_export += `  ${color_key},\n`
//     _palette += `  ${color_key},\n`
//   }


//   index = index
//     + 'export {\n'
//     + index_export
//     + '\n};\n'
//     + 'export const palette = [\n'
//     + _palette
//     + ']';


//   mkdirSync(dir, { recursive: true })

//   // const output = 'export const palette = ' + JSON.stringify(palette, null, 2) + 'as const'

//   writeFileSync(join(dir, 'index.ts'), index)
// }


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
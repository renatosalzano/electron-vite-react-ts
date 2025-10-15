type ClassValue =
  | string
  | undefined
  | boolean
  | { [key: string]: ClassValue | undefined | null };

export type Classname = (...props: ClassValue[]) => string

(window as any).cls = (...props: ClassValue[]) => {

  let out = ''

  for (const prop of props) {

    switch (typeof prop) {

      case 'object':

        for (const k in prop) {

          out += prop[k]
            ? k + " "
            : ''

        }
        break

      case 'string':

        out += prop + ' '
        break

      case 'undefined':
        break
    }
  }

  return out.trim()
}
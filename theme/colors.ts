import { Hct } from '@material/material-color-utilities/hct'
import { argbFromHex, hexFromArgb } from '@material/material-color-utilities/utils/string_utils'
import { deepMerge, type DeepPartial } from '../utils/object'
import { themeDefaults } from './config'

const tones = [80, 50, 40, 20] as const
type Tones = (typeof tones)[number]

type ColorTones<T extends string> = {
  [K in Tones as `${T}_${K}`]: string
}

type SurfaceVariants = 'surface' | 'surface_2' | 'surface_3' | 'surface_4'

type ColorSurfaces<T extends string> = {
  [K in SurfaceVariants as `${T}_${K}`]: string
}

export type MaterialColors<Colors extends Record<string, string>> = {
  [K in keyof Colors as keyof ColorTones<string & K>]: string
} & {
  [K in keyof Colors as keyof ColorSurfaces<string & K>]: string
} & ColorTones<'neutral'>

const hexFromHct = (hue: number, chroma: number, tone: number) => hexFromArgb(Hct.from(hue, chroma, tone).toInt())

const maxLightness = 99
const inverseTone = (tone: number) => {
  const extraLightness = 8
  return Math.min(100 - tone + extraLightness, maxLightness)
}

const createTones = <Name extends string>(name: Name, hue: number, chroma: number, darkMode: boolean) => {
  const result: Record<string, string> = {}
  for (const tone of tones) {
    result[`${name}_${tone}`] = hexFromHct(hue, chroma, darkMode ? inverseTone(tone) : tone)
  }
  return result as ColorTones<Name>
}

const createSurfaceVariants = <Name extends string>(name: Name, hue: number, chroma: number, darkMode: boolean) => {
  const result: Record<string, string> = {}
  result[`${name}_surface`] = hexFromHct(hue, 8, darkMode ? 8 : maxLightness)
  result[`${name}_surface_2`] = hexFromHct(hue, 14, darkMode ? inverseTone(94) : 94)
  result[`${name}_surface_3`] = hexFromHct(hue, 18, darkMode ? inverseTone(88) : 88)
  result[`${name}_surface_4`] = hexFromHct(hue, 20, darkMode ? inverseTone(84) : 84)
  return result as ColorSurfaces<Name>
}

export const createMaterialColors = (userOptions?: DeepPartial<typeof themeDefaults>) => {
  const options = userOptions ? deepMerge(themeDefaults, userOptions) : themeDefaults

  const colors: Record<string, string> = {}

  for (const [name, value] of Object.entries(options.colors)) {
    const { hue, chroma } = Hct.fromInt(argbFromHex(value))
    Object.assign(colors, createTones(name, hue, chroma, options.darkMode))
    Object.assign(colors, createSurfaceVariants(name, hue, chroma, options.darkMode))
  }

  const primary = Hct.fromInt(argbFromHex(options.colors.primary))
  Object.assign(colors, createTones('neutral', primary.hue, 8, options.darkMode))

  return colors as MaterialColors<typeof options.colors>
}

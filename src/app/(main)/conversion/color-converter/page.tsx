'use client'

import { colord, extend, getFormat } from 'colord'
import a11yPlugin from 'colord/plugins/a11y'
import cmykPlugin from 'colord/plugins/cmyk'
import hwbPlugin from 'colord/plugins/hwb'
import lchPlugin from 'colord/plugins/lch'
import namesPlugin from 'colord/plugins/names'
import React from 'react'
import { RgbaStringColorPicker } from 'react-colorful'
import { useClickAway } from 'react-use'

import Container from '@/components/Container'
import Title from '@/components/Title'

extend([hwbPlugin, cmykPlugin, lchPlugin, namesPlugin, a11yPlugin])

type List = {
  label: string
  value: string
}

type Lists = {
  label: string
  data: List[]
}

type ItemProps = {
  list: List[]
}

const ColorConverter = () => {
  const [value, setValue] = React.useState('rgba(255, 255, 255, 1)')
  const [opened, setOpened] = React.useState(false)
  const popover = React.useRef(null)

  useClickAway(popover, () => {
    setOpened(false)
  })

  const lists: Lists[] = [
    {
      label: 'Conversion',
      data: [
        {
          label: 'HEX',
          value: colord(value).toHex(),
        },
        {
          label: 'RGB',
          value: colord(value).toRgbString(),
        },
        {
          label: 'HSL',
          value: colord(value).toHslString(),
        },
        {
          label: 'HWB',
          value: colord(value).toHwbString(),
        },
        {
          label: 'CMYK',
          value: colord(value).toCmykString(),
        },
        {
          label: 'LCH',
          value: colord(value).toLchString(),
        },
        {
          label: 'CSS Keyword',
          value: colord(value).toName({ closest: true }) || '未知',
        },
      ],
    },
    {
      label: 'Analysis',
      data: [
        {
          label: 'Is it a valid CSS value?',
          value: colord(value).isValid() ? 'Yes' : 'No',
        },
        {
          label: 'Format',
          value: getFormat(value) || '-',
        },
        {
          label: 'Hue (0-359)',
          value: `${colord(value).hue()} deg`,
        },
        {
          label: 'Brightness',
          value: `${Math.floor(colord(value).brightness() * 100)}% (${
            colord(value).isDark() ? 'Dark' : 'Light'
          })`,
        },
        {
          label: 'Luminance',
          value: `${Math.floor(colord(value).luminance() * 100)}%`,
        },
        {
          label: 'Contrast',
          value: `${colord(value).contrast()}:1`,
        },
      ],
    },
  ]

  return (
    <Container className='flex flex-col items-center justify-center'>
      <Title title='Color Converter' />

      {/* Color input */}
      <div className='relative my-8 flex w-full max-w-[250px] items-center justify-between gap-4'>
        <button
          className='h-7 w-7 cursor-pointer rounded-lg'
          style={{ backgroundColor: value }}
          type='button'
          onClick={() => setOpened(true)}
        />
        <div>{value}</div>

        {opened && (
          <div
            className='absolute left-0 top-[calc(100%+12px)] rounded-lg'
            ref={popover}
          >
            <RgbaStringColorPicker color={value} onChange={setValue} />
          </div>
        )}
      </div>

      {/* Color conversion results */}
      <div className='my-12 grid w-full gap-4 sm:grid-cols-2'>
        {lists.map((list) => {
          const { label, data } = list

          return (
            <>
              <div
                key={label}
                className='rounded-lg border border-accent-2 p-4'
              >
                <div className='mb-8 text-center text-3xl font-bold'>
                  {label}
                </div>
                <Items list={data} />
              </div>
            </>
          )
        })}
      </div>
    </Container>
  )
}

const Items = (props: ItemProps) => {
  const { list } = props

  return (
    <>
      {list.map((item) => {
        const { label, value } = item

        return (
          <div className='mb-4 border-b-4 border-accent-2' key={label}>
            <div className='text-sm font-medium'>{label}</div>
            <div className='my-2 text-lg font-bold'>{value}</div>
          </div>
        )
      })}
    </>
  )
}

export default ColorConverter

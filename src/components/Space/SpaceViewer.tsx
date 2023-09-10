import { SwitchViewerBlock } from '@/components/Space/SwitchViewerBlock'
import type { BlockType, Space } from '@/models/space'
import { useSpaceStore } from '@/store/space'
import { useSpaceModeStore } from '@/store/spaceMode'
import { useEffect, useState } from 'react'
import { Responsive, WidthProvider, type Layout } from 'react-grid-layout'

import styles from './SpaceViewer.module.scss'

const ResponsiveGridLayout = WidthProvider(Responsive)

export function SpaceViewer() {
  const [rowHeight, setRowHeight] = useState(100)
  const { mode } = useSpaceModeStore()
  const { space } = useSpaceStore()
  const [state, setState] = useState({
    breakpoints: 'lg',
    layouts: { lg: getBlockLayout(space.blocks, mode) } // , md: layout, sm: layout, xs: layout, xxs: layout
  })

  useEffect(() => {
    const nextLayout = getBlockLayout(space.blocks, mode)
    setState(() => ({ breakpoints: 'lg', layouts: { lg: nextLayout } }))
  }, [mode])

  return (
    <>
      <h1 className={styles.title}>{space.title}</h1>
      <p className={styles.description}>{space.description}</p>
      <div className={styles.layout}>
        <ResponsiveGridLayout
          layouts={state.layouts}
          breakpoints={{
            lg: 1200
          }}
          cols={{ lg: 4 }}
          rowHeight={rowHeight}
          width={1000}
          margin={[30, 30]}
          onWidthChange={(width, _margin, cols) => {
            setRowHeight((width * 0.7) / cols)
          }}
          onResizeStart={(_layout, _oldItem, _newItem, _placeholder, _event, element) => {
            element.classList.add('react-gird-resizable-keep')
          }}
          onResizeStop={(_layout, _oldItem, _newItem, _placeholder, _event, element) => {
            element.classList.remove('react-gird-resizable-keep')
          }}
          onLayoutChange={(layout, _layouts) => {
            const changedLayout = sortLayout(layout)
            if (JSON.stringify(sortLayout(changedLayout)) !== JSON.stringify(state.layouts.lg)) {
              setState(() => ({ breakpoints: 'lg', layouts: { lg: changedLayout } }))
            }
          }}
        >
          {space.blocks.map((block) => {
            return (
              <div className={styles.item} key={block.blockId}>
                <SwitchViewerBlock mode={mode} type={block.type} block={block} />
              </div>
            )
          })}
        </ResponsiveGridLayout>
      </div>
    </>
  )
}

interface BlockItem {
  i: string
  x: number
  y: number
  w: number
  h: number
  type?: BlockType
  MaxH?: number
  MaxW?: number
  isDraggable?: boolean
  isResizable?: boolean
}

function sortLayout(layout: BlockItem[]): Layout[] {
  return layout.sort((a, b) => {
    if (a.y === b.y) {
      return a.x > b.x ? 1 : -1
    }
    return a.y > b.y ? 1 : -1
  })
}

function getBlockLayout(blocks: Space['blocks'], mode: SpaceMode): Layout[] {
  return blocks.map((block) => {
    const { blockId, ...rest } = block
    return {
      blockId,
      i: blockId,
      isDraggable: mode !== 'view',
      isResizable: mode !== 'view',
      static: mode === 'view',
      minW: 1,
      maxW: 4,
      minH: 1,
      maxH: 2,
      ...rest
    }
  })
}

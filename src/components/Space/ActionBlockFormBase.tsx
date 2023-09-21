import { type BlockType } from '@/models/space'
import { useDrawerFormType } from '@/store/formMode'
import type { ReactNode } from 'react'
import { BiCaretRightSquare, BiImageAlt, BiLink, BiMapAlt, BiPencil } from 'react-icons/bi'
import styles from './ActionBlockFormBase.module.scss'

// todo block type을 알아야하는지 논의가 필요합니당.
interface Props {
  children: ReactNode
}

export function ActionBlockFormBase({ children }: Props) {
  const { blockType, setBlockType, drawerMode } = useDrawerFormType()

  type FormType = {
    title: string
    type: BlockType
    icon: ReactNode
  }
  const formTypes: FormType[] = [
    {
      type: 'link',
      title: '링크',
      icon: <BiLink />
    },
    {
      type: 'image',
      title: '사진',
      icon: <BiImageAlt />
    },
    {
      type: 'video',
      title: '동영상',
      icon: <BiCaretRightSquare />
    },
    {
      type: 'googleMap',
      title: '지도',
      icon: <BiMapAlt />
    },
    {
      type: 'text',
      title: '텍스트',
      icon: <BiPencil />
    }
  ]
  return (
    <div style={{ display: 'flex', height: '100%', flexDirection: 'column' }}>
      <div className={styles.ActionBlockFormBaseContainer}>
        <h2>
          {formTypes.find((form) => form.type === blockType)?.title} {drawerMode === 'create' ? '추가' : '수정'}하기
        </h2>
        <div className={styles.actionNavigation}>
          {formTypes.map((form) => {
            return (
              <div key={form.type}>
                <button
                  className={[
                    form.type === blockType ? styles.active : '',
                    drawerMode === 'edit' ? styles.disable : ''
                  ].join(' ')}
                  onClick={() => {
                    setBlockType(form.type)
                  }}
                  disabled={drawerMode === 'edit'}
                >
                  <div className={styles.icon}>{form.icon}</div>
                </button>
                <div id={styles.btnTitle} className={form.type === blockType ? styles.activeText : ''}>
                  {form.title}
                </div>
              </div>
            )
          })}
        </div>
      </div>
      <div style={{ display: 'flex', height: '100%', width: '100%' }}>{children}</div>
    </div>
  )
}

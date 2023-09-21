import { type BlockWith } from '@/models/space'
import BlockLogo from './BlockLogo'
import styles from './LinkBlock.module.scss'

type Props = {
  block: BlockWith<'link'>
  mode: SpaceMode
}

export function LinkBlock({ block, mode }: Props) {
  return (
    <div className={styles.container}>
      <div className={mode === 'edit' ? 'cover' : ''} />
      <div className={styles.itemBox}>
        <BlockLogo logo={block.url} />
        <div className={styles.titleUrl}>
          <span>{block.text}</span>
          {block.w === 1 ? (
            <a style={{ display: 'none' }} href={block.url}>
              {block.url}
            </a>
          ) : (
            <a href={block.url}>{block.url}</a>
          )}
        </div>
      </div>
      <div
        className={styles.footer}
        onClick={() => {
          window.location.href = block.url
        }}
      >
        <div className={styles.footerLeft}>바로가기</div>
        <div className={styles.footerright} />
      </div>
    </div>
  )
}

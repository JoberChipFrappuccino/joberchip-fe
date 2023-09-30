import classNames from 'classnames'
import { type BlockBaseWithBlockProps } from '../SwitchCase/ViewerBox'
import BlockLogo from './BlockLogo'
import styles from './LinkBlock.module.scss'

export function LinkBlock({ block, mode }: BlockBaseWithBlockProps<TLink>) {
  return (
    <div className={styles.container}>
      <div className={classNames(mode === 'edit' && 'cover')} />
      <div className={styles.itemBox}>
        <BlockLogo logo={block.src} />
        <div className={styles.titleUrl}>
          <span>{block.title}</span>
          {block.w === 1 ? (
            <a style={{ display: 'none' }} href={block.src}>
              {block.src}
            </a>
          ) : (
            <a href={block.src}>{block.src}</a>
          )}
        </div>
      </div>
      {/* // ? : a 태그로 변경 가능할 것 같은데 어떤가용..? */}
      <button type="button" className={styles.footer} onClick={() => (window.location.href = block.src)}>
        <div className={styles.footerLeft}>바로가기</div>
        <div className={styles.footerright} />
      </button>
    </div>
  )
}

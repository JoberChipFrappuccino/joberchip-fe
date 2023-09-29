import { Drawer } from '@/components/SharePage/Drawer'
import { Profile } from '@/components/SharePage/Profile'
import { SpaceViewer } from '@/components/SharePage/SpaceViewer'
import { SEO, SPACE } from '@/constants'
import useServerSideProps from '@/hooks/serverSideProps'
import { type SharePage } from '@/models/space'
import { useSharePageStore } from '@/store/sharePage'
import { useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { useParams } from 'react-router-dom'
import styles from './SharePage.module.scss'

interface PageSource {
  title: Record<string, string>
  description: Record<string, string>
}

type Params = {
  spaceId: string
}

export default function ShareableSpace() {
  const pageSource: PageSource = useServerSideProps(SEO)
  const SSRSpace: SharePage = useServerSideProps(SPACE)
  const { sharePage: space, loadSpace, setSpace, isLoaded, isFetching, setSpaceMode } = useSharePageStore()
  const { spaceId } = useParams<Params>()

  useEffect(() => {
    // CASE : CSR
    // react 내부적으로 주소를 이동할 경우 space를 다시 로드합니다.
    if (!SSRSpace?.pageId) {
      loadSpace(spaceId ?? '')
      return
    }

    // CASE : CSR
    // SSR로 로드한 spaceId와 이동할 space가 다르다면 space를 다시 로드합니다.
    if (SSRSpace?.pageId !== spaceId) {
      loadSpace(spaceId ?? '')
      return
    }

    // CASE : SSR
    // HACK : 권한은 임시로 업데이트하는 척 합니다.
    const nextSpace: SharePage = {
      ...SSRSpace,
      previlige: {
        edit: SSRSpace.pageId === 'space1',
        delete: SSRSpace.pageId === 'space1'
      }
    }
    if (nextSpace.previlige.edit) setSpaceMode('edit')
    setSpace(nextSpace)
  }, [spaceId])

  useEffect(() => {
    // HACK : fetch가 완료되면 페이지 권한을 체크 후 업데트합니다.
    if (!isFetching) {
      const nextSpace: SharePage = {
        ...space,
        previlige: {
          edit: space.pageId === 'space1',
          delete: space.pageId === 'space1'
        }
      }
      if (nextSpace.previlige.edit) setSpaceMode('edit')
      setSpace(nextSpace)
    }
  }, [isFetching])

  return (
    <>
      <Helmet>
        {/* // TODO : default pageSource + SSR일 경우 두 가지로 분기해야함 */}
        <title>{pageSource.title['/']}</title>
      </Helmet>
      {isLoaded && <Profile />}
      <aside>{<Drawer />}</aside>
      <div className={styles.viewer}>
        <div className={styles.spaceViewer}>
          <section>{isLoaded && <SpaceViewer />}</section>
        </div>
      </div>
    </>
  )
}
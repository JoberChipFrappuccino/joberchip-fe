import { fetchSpaceListAPI } from '@/api/space'
import { GroupSpace } from '@/components/Space/GroupSpace'
import { GroupSpaceItem } from '@/components/Space/GroupSpaceItem'
import { Search } from '@/components/Space/Search'
import { UserProfile } from '@/components/Space/UserProfile'
import { SPACE_LIST } from '@/constants/queryKeyConstant'
import { useUserStore } from '@/store/user'
import to from '@/utils/api'
import { useQuery } from '@tanstack/react-query'
import styles from './Space.module.scss'

export default function Space() {
  const { signOut, user } = useUserStore()
  const { data: res } = useQuery([SPACE_LIST], () => to(fetchSpaceListAPI()), {
    staleTime: 1000 * 60 * 60
  })

  if (res?.status === 'failure') alert(res?.message)

  return (
    <div className={styles.container}>
      <div className={styles.cover}>
        <button type="button" onClick={() => signOut()}>
          임시 로그아웃 버튼
        </button>
        <Search />
        <UserProfile />
        <GroupSpace title="개인 스페이스 (링크 클릭하면 에러납니다)">
          {res?.data?.map((space) => {
            return (
              <GroupSpaceItem
                key={space.spaceId}
                link={`/temp/space/${space.mainPageId}`}
                text={`${user.username}님의 스페이스, id : ${space.mainPageId}`}
              />
            )
          })}
        </GroupSpace>
        <GroupSpace title="단체 스페이스 (임시)">
          <GroupSpaceItem text="user 2의 단체 스페이스" link="/space/space2" />
          <GroupSpaceItem
            style={{ borderBottom: '1px solid grey', borderTop: '1px solid grey' }}
            text="자버 회사 소개 스페이스"
            link="/space/space3"
          />
          <GroupSpaceItem text="자버칩프라푸치노 프로젝트 소개 스페이스" link="/space/space4" />
        </GroupSpace>
      </div>
    </div>
  )
}

import { createSpaceAPI } from '@/api/space'
import { SPACE_LIST } from '@/constants/queryKeyConstant'
import { useUserStore } from '@/store/user'
import { useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import styles from './UserProfile.module.scss'

export function UserProfile() {
  const queryClient = useQueryClient()

  const { user } = useUserStore()
  const handleOnClickCreateSpace = () => {
    createSpaceAPI()
      .then(({ message }) => {
        alert(message)
        queryClient.refetchQueries([SPACE_LIST])
      })
      .catch(({ message }) => {
        alert(message)
      })
  }
  return (
    <div className={styles.container}>
      <div className={styles.profile}>
        <h1>{user?.username}</h1>
        <p>자버칩 소속</p>
      </div>
      <div className={styles.buttonCover}>
        <Link to="/space/space1" className={styles.mySpaceBtn}>
          내 스페이스 바로가기
        </Link>
        <button type="button" className={styles.addSpaceBtn} onClick={handleOnClickCreateSpace}>
          내 스페이스 추가하기
        </button>
      </div>
    </div>
  )
}
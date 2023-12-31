/* eslint-disable object-shorthand */
import { addImageBlockAPI, editImageBlockAPI } from '@/api/blocks'
import { IMAGE } from '@/constants/blockTypeConstant'
import { useBlockAction } from '@/store/blockAction'
import { useSharePageStore } from '@/store/sharePage'
import { getNextYOfLastBlock } from '@/utils/api'
import { useEffect, useState, type FormEvent } from 'react'
import { TiDeleteOutline } from 'react-icons/ti'
import { type BlockBaseWithBlockFormProps } from '../SwitchCase/DrawerEditForm'
import FormButton from '../Ui/Button'
import ImgThumbnail from '../Ui/ImgThumbnail'
import styles from './ImageBlockForm.module.scss'

export function ImageBlockForm({ block }: BlockBaseWithBlockFormProps<TImage>) {
  const { sharePage, setSharePage } = useSharePageStore()
  const [thumbnail, setThumbnail] = useState('')
  const [title, setTitle] = useState('')
  const isButtonDisabled = !title || !thumbnail
  const { drawerMode } = useBlockAction()
  const { setOpenDrawer } = useBlockAction()

  const titleValue = block?.title ?? ''
  const thumbnailValue = block?.src ?? ''
  const blockId = block?.objectId ?? ''

  useEffect(() => {
    setTitle(titleValue ?? '')
    setThumbnail(thumbnailValue ?? '')
  }, [titleValue, thumbnailValue])

  /** 이미지 블록 정보 API 전달 함수 */
  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const pageId = sharePage.pageId

    const addform = new FormData()
    const editform = new FormData()

    if (thumbnail.startsWith('data:image')) {
      const base64ImageData = thumbnail
      const blob = await fetch(base64ImageData).then((response) => response.blob())
      const file = new File([blob], 'image.png', { type: 'image/png' })
      addform.append('attachedImage', file, 'image.png')
      editform.append('attachedImage', file, 'image.png')
    }

    addform.append('x', '0')
    addform.append('y', getNextYOfLastBlock(sharePage.children).toString())
    addform.append('w', '1')
    addform.append('h', '2')
    addform.append('title', title)
    addform.append('type', IMAGE)
    addform.append('visible', 'true')

    editform.append('title', title)

    try {
      if (drawerMode === 'create') {
        const { data: responseData } = await addImageBlockAPI(pageId, addform)
        const updatedSharePage = {
          ...sharePage,
          children: [...sharePage.children, { ...responseData }]
        }
        setSharePage(updatedSharePage)
        setOpenDrawer(false)
      } else if (drawerMode === 'edit') {
        const { data: responseData } = await editImageBlockAPI(pageId, blockId, editform)
        const existingBlockIndex = sharePage.children.findIndex((block) => block.objectId === responseData.objectId)
        const updatedChildren = [...sharePage.children]
        if (existingBlockIndex !== -1) {
          updatedChildren[existingBlockIndex] = responseData
        } else {
          updatedChildren.push(responseData)
        }
        const updatedSharePage = {
          ...sharePage,
          children: updatedChildren
        }
        setSharePage(updatedSharePage)
        setOpenDrawer(false)
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className={styles.container}>
      <form className={styles.formBox} onSubmit={submitHandler}>
        <div className={styles.forms}>
          <h3>사진 제목*</h3>
          <div className={styles.inputbox}>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="사진 제목을 입력해주세요."
            />
            {title && (
              <button type="button" className={styles.delTitle} onClick={() => setTitle('')}>
                <TiDeleteOutline />
              </button>
            )}
          </div>
          <h3 className={styles.formText}>사진 첨부*</h3>
          <ImgThumbnail img={thumbnail} imgData={setThumbnail} />
        </div>
        <FormButton title={drawerMode === 'create' ? '사진 추가하기' : '사진 수정하기'} event={isButtonDisabled} />
      </form>
    </div>
  )
}

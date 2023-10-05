/* eslint-disable object-shorthand */
import { addImageBlockAPI, editImageBlockAPI } from '@/api/blocks'
import { useBlockAction } from '@/store/blockAction'
import { useSharePageStore } from '@/store/sharePage'
import { getNextYOfLastBlock } from '@/utils/api'
import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react'
import { TiDeleteOutline } from 'react-icons/ti'
import { type BlockBaseWithBlockFormProps } from '../SwitchCase/DrawerEditForm'
import FormButton from '../Ui/Button'
import ImgThumbnail from '../Ui/ImgThumbnail'
import styles from './ImageBlockForm.module.scss'

export function ImageBlockForm({ block }: BlockBaseWithBlockFormProps<TImage>) {
  const { sharePage, setSharePage } = useSharePageStore()
  const [thumbnail, setThumbnail] = useState<string>('')
  const [title, setTitle] = useState<string>('')
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

    // Base64 이미지 데이터를 File 객체로 변환하는 기능
    const base64ImageData = thumbnail
    const blob = await fetch(base64ImageData).then((response) => response.blob())
    const file = new File([blob], 'image.png', { type: 'image/png' })

    const addData = {
      x: 0,
      y: getNextYOfLastBlock(sharePage.children),
      w: 2,
      h: 2,
      title: title,
      attachedImage: file,
      type: 'IMAGE',
      visible: true
    }

    const editData = {
      title: title,
      attachedImage: file
    }

    const addform = new FormData()
    addform.append('x', addData.x.toString())
    addform.append('y', addData.y.toString())
    addform.append('w', addData.w.toString())
    addform.append('h', addData.h.toString())
    addform.append('title', addData.title)
    addform.append('attachedImage', addData.attachedImage, 'image.png')
    addform.append('type', addData.type)
    addform.append('visible', addData.visible.toString())

    const editform = new FormData()
    editform.append('title', editData.title)
    editform.append('attachedImage', editData.attachedImage, 'image.png')

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

  const onChangetitle = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value)
  }

  const deleteTitle = () => {
    setTitle('')
  }

  return (
    <div className={styles.container}>
      <form className={styles.formBox} onSubmit={submitHandler}>
        <div className={styles.forms}>
          <h3>사진 제목*</h3>
          <div className={styles.inputbox}>
            <input type="text" value={title} onChange={onChangetitle} placeholder="사진 제목을 입력해주세요." />
            {title && (
              <button type="button" className={styles.delTitle} onClick={deleteTitle}>
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

import { addVideoBlockAPI, editVideoBlockAPI } from '@/api/blocks'
import { useBlockAction } from '@/store/blockAction'
import { useSharePageStore } from '@/store/sharePage'
import { getNextYOfLastBlock } from '@/utils/api'
import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react'
import { TiDeleteOutline } from 'react-icons/ti'
import { type BlockBaseWithBlockFormProps } from '../SwitchCase/DrawerEditForm'
import FormButton from '../Ui/Button'
import VideoThumbnail from '../Ui/VideoThumbnail'
import styles from './VideoBlockForm.module.scss'

export function VideoBlockForm({ block }: BlockBaseWithBlockFormProps<TVideo>) {
  const { sharePage, setSharePage } = useSharePageStore()
  const [selectedRadio, setSelectedRadio] = useState('radio1')
  const [thumbnail, setThumbnail] = useState<string>('')
  const [videoUrl, setVideoUrl] = useState<string>('')
  const { drawerMode } = useBlockAction()
  const [isButtonDisabled, setIsButtonDisabled] = useState(true)
  const { setOpenDrawer } = useBlockAction()
  const [youtubeThumb, setYoutubeThumb] = useState<string>('')

  const thumbnailValue = block?.src ?? ''
  const blockId = block?.objectId ?? ''

  useEffect(() => {
    setThumbnail(thumbnailValue ?? '')
    if (thumbnailValue) {
      if (thumbnailValue.includes('youtube')) {
        setSelectedRadio('radio1')
      } else if (thumbnailValue.endsWith('.mp4')) {
        setSelectedRadio('radio2')
      }
    }
    if (thumbnailValue) {
      if (thumbnailValue.includes('youtube')) {
        setVideoUrl(thumbnailValue)
        setThumbnail('')
      } else if (thumbnailValue.endsWith('.mp4')) {
        setVideoUrl('')
      }
    }
    if (videoUrl.includes('be/')) {
      setYoutubeThumb(videoUrl.split('be/')[1])
    } else if (videoUrl.includes('v=')) {
      setYoutubeThumb(videoUrl.split('v=')[1])
    }
  }, [thumbnailValue, videoUrl])

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
      title: file.name,
      videoLink: `https://www.youtube.com/embed/${youtubeThumb}`,
      attachedVideo: file,
      type: 'VIDEO',
      visible: true
    }

    const editData = {
      videoLink: `https://www.youtube.com/embed/${youtubeThumb}`,
      attachedVideo: file
    }

    const addform = new FormData()
    addform.append('x', addData.x.toString())
    addform.append('y', addData.y.toString())
    addform.append('w', addData.w.toString())
    addform.append('h', addData.h.toString())
    addform.append('title', addData.title)
    addData.videoLink && addform.append('videoLink', addData.videoLink)
    addData.attachedVideo && addform.append('attachedVideo', addData.attachedVideo)
    addform.append('type', addData.type)
    addform.append('visible', addData.visible.toString())

    const editform = new FormData()
    editform.append('videoLink', editData.videoLink)
    editform.append('attachedVideo', editData.attachedVideo)

    try {
      if (drawerMode === 'create') {
        const { data: responseData } = await addVideoBlockAPI(pageId, addform)
        const updatedSharePage = {
          ...sharePage,
          children: [...sharePage.children, { ...responseData }]
        }
        setSharePage(updatedSharePage)
        setOpenDrawer(false)
      } else if (drawerMode === 'edit') {
        const { data: responseData } = await editVideoBlockAPI(pageId, blockId, editform)
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
    const newValue = e.target.value
    setVideoUrl(newValue) // 먼저 videoUrl을 업데이트합니다.
    setThumbnail(newValue) // 그리고 thumbnail을 업데이트합니다.
    setIsButtonDisabled(newValue === '')
  }

  const handleRadioChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSelectedRadio(e.target.value)
    setVideoUrl('')
    setThumbnail('')
    setIsButtonDisabled(true)
  }

  const deleteHandler = () => {
    setVideoUrl('')
    setThumbnail('')
  }

  return (
    <div className={styles.container}>
      <form className={styles.formBox} onSubmit={submitHandler}>
        <div className={styles.forms}>
          <label>
            <div className={styles.checkbox}>
              <input
                className={styles.radios}
                type="radio"
                value="radio1"
                checked={selectedRadio === 'radio1'}
                onChange={handleRadioChange}
              />
              <h3>동영상 URL 첨부</h3>
            </div>
            <div className={styles.inputbox}>
              <input
                type="text"
                value={videoUrl}
                onChange={onChangetitle}
                placeholder="유튜브 주소를 입력해주세요.(https://youtu.be/동영상링크)"
                disabled={selectedRadio !== 'radio1'}
              />
              {videoUrl && (
                <button type="button" className={styles.delete} onClick={deleteHandler}>
                  <TiDeleteOutline />
                </button>
              )}
            </div>
          </label>
          <label>
            <div className={styles.checkbox}>
              <input
                className={styles.radios}
                type="radio"
                value="radio2"
                checked={selectedRadio === 'radio2'}
                onChange={handleRadioChange}
              />
              <h3>동영상 파일 첨부</h3>
            </div>
          </label>
          <VideoThumbnail
            img={thumbnail}
            radio={selectedRadio}
            imgData={setThumbnail}
            buttonActive={setIsButtonDisabled}
            videoUrl={videoUrl}
          />
        </div>
        <FormButton title={drawerMode === 'create' ? '동영상 추가하기' : '동영상 수정하기'} event={isButtonDisabled} />
      </form>
    </div>
  )
}

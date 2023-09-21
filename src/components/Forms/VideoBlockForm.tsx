import { useDrawerFormType } from '@/store/formMode'
import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react'
import FormButton from '../Ui/Button'
import VideoThumbnail from '../Ui/VideoThumbnail'
import styles from './VideoBlockForm.module.scss'

type Props = {
  block: {
    src?: string
  }
}

export default function VideoBlockForm(block: Props) {
  const [selectedRadio, setSelectedRadio] = useState('radio1')
  const [thumbnail, setThumbnail] = useState<string>('')
  const [videoUrl, setVideoUrl] = useState<string>('')
  const { drawerMode } = useDrawerFormType()
  const [isButtonDisabled, setIsButtonDisabled] = useState(true)

  const thumbnailValue = block.block.src

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
  }, [thumbnailValue])

  const submitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const body = {
      src: thumbnail
    }
    // body에 data를 담아 post 전달 알림창으로 체크
    alert(JSON.stringify(body))
  }

  const onChangetitle = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    setThumbnail(videoUrl)
    setVideoUrl(e.target.value)
    setIsButtonDisabled(e.target.value === '')
  }

  const handleRadioChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSelectedRadio(e.target.value)
    setVideoUrl('')
    setThumbnail('')
    setIsButtonDisabled(true)
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
              <h3>동영상 URL 첨부*</h3>
            </div>
            <input
              type="text"
              value={videoUrl}
              onChange={onChangetitle}
              placeholder="동영상 주소를 입력해주세요."
              disabled={selectedRadio !== 'radio1'}
            />
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
          />
        </div>
        <FormButton title={drawerMode === 'create' ? '동영상 추가하기' : '동영상 수정하기'} event={isButtonDisabled} />
      </form>
    </div>
  )
}

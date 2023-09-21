import { useEffect, useState, type Dispatch, type SetStateAction } from 'react'
import { HiOutlineMinusCircle } from 'react-icons/hi'
import styles from './ImgThumbnail.module.scss'

type Props = {
  radio?: string
  imgData?: Dispatch<SetStateAction<string>>
  buttonActive?: Dispatch<SetStateAction<boolean>>
  img: string
}

export default function ImgThumbnail({ radio, imgData, buttonActive, img }: Props) {
  const [selectedRadio, setSelectedRadio] = useState<string>('radio1')
  const [thumbnail, setThumbnail] = useState<string>('')
  const [key, setKey] = useState(0)
  const editImg = img

  useEffect(() => {
    setThumbnail(editImg)
    setSelectedRadio(radio ?? 'radio1')
  }, [radio, img])

  /** 제품 썸네일 이미지 Base64 포멧 변환 */
  function changeMedia(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files as FileList
    for (const file of files) {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.addEventListener('load', (e) => {
        const result = (e.target as FileReader).result as string
        setThumbnail(result)
        imgData && imgData(result)
        setKey((e) => e + 1)
      })
    }
    buttonActive && buttonActive(e.target.value === '')
  }

  /** 썸네일 이미지 삭제 기능 */
  function changeMediaRemove() {
    setThumbnail('')
    imgData && imgData('')
    buttonActive && buttonActive(true)
    setKey((e) => e + 1)
  }

  return (
    <>
      {thumbnail ? (
        ''
      ) : (
        <label
          htmlFor="file"
          className={styles.addButton}
          style={img ? { cursor: 'not-allowed' } : { cursor: 'pointer' }}
        >
          <p>+</p>
        </label>
      )}
      <input
        type="file"
        id="file"
        name="file"
        style={{ display: 'none' }}
        onChange={(e) => {
          changeMedia(e)
        }}
        disabled={!!img}
        key={key}
      />
      {thumbnail ? (
        <div
          className={styles.thumbnailVideo}
          onClick={() => {
            changeMediaRemove()
          }}
        >
          {/* API 작업 이후 image만 포함할 예정 */}
          {thumbnail.includes('image' && 'jpg') ? <img src={thumbnail} /> : <video src={thumbnail} />}
          <div className={styles.minus}>
            <HiOutlineMinusCircle />
          </div>
        </div>
      ) : (
        <div style={{ display: selectedRadio !== 'radio2' ? 'none' : 'block' }} />
      )}
    </>
  )
}

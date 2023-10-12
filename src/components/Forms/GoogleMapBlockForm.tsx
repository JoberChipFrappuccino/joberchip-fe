import { addGoogleMapBlockAPI, editGoogleMapBlockAPI } from '@/api/blocks'
import { MAP } from '@/constants/blockTypeConstant'
import { useBlockAction } from '@/store/blockAction'
import { useSharePageStore } from '@/store/sharePage'
import { getNextYOfLastBlock } from '@/utils/api'
import { toast } from '@/utils/toast'
import { Autocomplete, GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api'
import { Input } from 'antd'
import { type SearchProps } from 'antd/es/input/Search'
import React, { useEffect, useState, type ChangeEvent, type FormEvent } from 'react'
import { TiDeleteOutline } from 'react-icons/ti'
import { SkeletonTheme } from 'react-loading-skeleton'
import { type BlockBaseWithBlockFormProps } from '../SwitchCase/DrawerEditForm'
import FormButton from '../Ui/Button'
import styles from './GoogleMapBlockForm.module.scss'

const { Search } = Input
export function GoogleMapBlockForm({ block }: BlockBaseWithBlockFormProps<TMap>) {
  const apikey = process.env.REACT_APP_GOOGLE_MAPS_API
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: apikey ?? '',
    libraries: ['places']
  })
  const [isButtonDisabled, setIsButtonDisabled] = useState(true)

  const onSearch: SearchProps['onSearch'] = (
    value: string,
    event?:
      | React.ChangeEvent<HTMLInputElement>
      | React.MouseEvent<HTMLElement, MouseEvent>
      | React.KeyboardEvent<HTMLInputElement>
      | undefined,
    info?: { source: any }
  ) => {}
  const [address, setAddress] = useState(block?.title ?? '')
  const [center, setCenter] = useState({
    lat: block?.latitude ?? 37.5642135,
    lng: block?.longitude ?? 127.0016985,
    address: block?.address ?? ''
  })
  const [query, setQuery] = useState('')
  const { sharePage, setSharePage } = useSharePageStore()
  const { setOpenDrawer } = useBlockAction()
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { drawerMode } = useBlockAction()
  const onAutocompleteLoad = (autocompleteParam: google.maps.places.Autocomplete) => {
    setAutocomplete(autocompleteParam)
  }

  const blockId = block?.objectId ?? ''

  const onAutocompletePlaceChanged = () => {
    if (autocomplete === null) return
    const place = autocomplete.getPlace()
    if (!place.geometry?.location) return

    const newLat = place.geometry.location.lat()
    const newLng = place.geometry.location.lng()

    setCenter((prev) => ({
      ...prev,
      lat: newLat,
      lng: newLng
    }))
    setIsButtonDisabled(false)
  }

  useEffect(() => {
    if (!isLoaded) {
      setIsLoading(true) // 로딩 중
      return
    }
    setIsLoading(false) // 로딩 완료
    // 여기에서 다른 동작을 수행할 수 있습니다.
  }, [isLoaded])

  const handleSearchEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (autocomplete !== null) {
      e.preventDefault()
      autocomplete.setFields(['geometry'])
      autocomplete.getPlace()
    }
  }

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const pageId = sharePage.pageId
    const data = {
      x: 0,
      y: getNextYOfLastBlock(sharePage.children),
      w: 1,
      h: 2,
      latitude: center.lat,
      longitude: center.lng,
      address,
      type: MAP,
      visible: true
    }
    try {
      // WARN : API 호출 후, 에러 처리를 해야 합니다! any타입도 제거해주세요!
      if (drawerMode === 'create') {
        const { data: responseData } = await addGoogleMapBlockAPI(pageId, data)
        const updatedSharePage = {
          ...sharePage,
          children: [...sharePage.children, responseData]
        }
        setSharePage(updatedSharePage)
        toast('지도가 추가되었습니다.', 'success', { autoClose: 500 })
        setOpenDrawer(false)
      } else if (drawerMode === 'edit') {
        const { data: responseData } = await editGoogleMapBlockAPI(pageId, blockId, {
          latitude: center.lat,
          longitude: center.lng,
          address
        })
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
        toast('지도가 수정되었습니다.', 'success', { autoClose: 500 })
        setOpenDrawer(false)
        setAddress('')
      }
    } catch (error) {
      console.error(error)
    }
  }

  const onChangeAddress = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    setAddress(e.target.value)
  }

  return (
    <div className={styles.container}>
      <form className={styles.formBox} onSubmit={submitHandler}>
        <div>
          {isLoading ? (
            <SkeletonTheme>{/* 로딩 중에만 Skeleton 테마 렌더링 */}</SkeletonTheme>
          ) : (
            <>
              <Autocomplete
                onLoad={onAutocompleteLoad}
                onPlaceChanged={onAutocompletePlaceChanged}
                options={{
                  componentRestrictions: { country: 'KR' }
                }}
              >
                <div className={styles.searchBox}>
                  <Search
                    className={styles.searcInput}
                    placeholder="장소를 입력하세요"
                    loading={isLoading}
                    defaultValue={query}
                    onPressEnter={(e) => {
                      handleSearchEnter(e)
                    }}
                    allowClear
                    enterButton="Search"
                    size="large"
                    onSearch={onSearch}
                    onChange={(e) => {
                      if (e.target.value === '') setIsButtonDisabled(true)
                      setQuery(e.target.value)
                    }}
                  />
                </div>
              </Autocomplete>
              <GoogleMap
                mapContainerStyle={{ width: '100%', height: '400px' }}
                center={center}
                zoom={15}
                options={{
                  zoomControl: false,
                  streetViewControl: false,
                  mapTypeControl: false,
                  fullscreenControl: false
                }}
              >
                <Marker position={center} />
              </GoogleMap>
            </>
          )}
        </div>
        <div className={styles.forms}>
          <h3>상세주소</h3>
          <div className={styles.inputbox}>
            <input type="text" value={address} onChange={onChangeAddress} placeholder="주소를 입력해주세요" />
            {address && (
              <button type="button" className={styles.delTitle} onClick={() => setAddress('')}>
                <TiDeleteOutline />
              </button>
            )}
          </div>
        </div>
        <FormButton title={drawerMode === 'create' ? '지도 추가하기' : '지도 수정하기'} event={isButtonDisabled} />
      </form>
    </div>
  )
}

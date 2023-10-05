import { addGoogleMapBlockAPI, editGoogleMapBlockAPI } from '@/api/blocks'
import { useBlockAction } from '@/store/blockAction'
import { useSharePageStore } from '@/store/sharePage'
import { getNextYOfLastBlock } from '@/utils/api'
import { Autocomplete, GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api'
import { Input } from 'antd'
import { type SearchProps } from 'antd/es/input/Search'
import React, { useEffect, useState, type ChangeEvent, type FormEvent } from 'react'
import { SkeletonTheme } from 'react-loading-skeleton'
import { type BlockBaseWithBlockFormProps } from '../SwitchCase/DrawerEditForm'
import FormButton from '../Ui/Button'
import styles from './ImageBlockForm.module.scss'

const { Search } = Input
// Todo 인풋창으로 주소 만들어서 안적히면 빈문자 백앤드로 보내기. 지도 api 연동 준 함수로 쓰되 x,높이, 임의값으로 하기
export function GoogleMapBlockForm({ block }: BlockBaseWithBlockFormProps<TMap>) {
  const apikey = process.env.REACT_APP_GOOGLE_MAPS_API
  // console.log(process.env.REACT_APP_GOOGLE_MAPS_API)
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: apikey ?? '',
    libraries: ['places']
  })
  const [isButtonDisabled, setIsButtonDisabled] = useState(true) // 초기값을 true로 설정

  const onSearch: SearchProps['onSearch'] = (
    value: string,
    event?:
      | React.ChangeEvent<HTMLInputElement>
      | React.MouseEvent<HTMLElement, MouseEvent>
      | React.KeyboardEvent<HTMLInputElement>
      | undefined,
    info?: { source: any }
  ) => {}
  const [address, setAddress] = useState<string>('')
  const [center, setCenter] = useState({
    lat: block?.latitude ?? 37.5642135,
    lng: block?.longitude ?? 127.0016985,
    address: block?.address ?? ''
  })
  const [query, setQuery] = useState('')
  const { sharePage, setSharePage } = useSharePageStore()
  const { setOpenDrawer } = useBlockAction()
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null)
  const [isLoading, setIsLoading] = useState(true) // 로딩 상태 추가
  const { drawerMode } = useBlockAction()
  const onAutocompleteLoad = (autocompleteParam: google.maps.places.Autocomplete) => {
    setAutocomplete(autocompleteParam)
  }

  const onAutocompletePlaceChanged = () => {
    if (autocomplete === null) return
    const place = autocomplete.getPlace()
    if (!place.geometry?.location) return

    const newLat = place.geometry.location.lat()
    const newLng = place.geometry.location.lng()
    // const address = place.formatted_address

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
      w: 2,
      h: 2,
      latitude: center.lat,
      longitude: center.lng,
      address,
      type: 'MAP',
      visible: true
    }
    try {
      if (drawerMode === 'create') {
        const { data: responseData } = await addGoogleMapBlockAPI(pageId, data)
        const updatedSharePage = {
          ...sharePage,
          children: [...sharePage.children, responseData]
        }
        setSharePage(updatedSharePage)
        setOpenDrawer(false)
      } else if (drawerMode === 'edit') {
        await editGoogleMapBlockAPI(pageId, block?.blockId, {
          latitude: center.lat,
          longitude: center.lng,
          address
        })
        // const newBlocks = [...sharePage.children.push(res.data)]
        setOpenDrawer(false)
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
                <Search
                  placeholder="장소를 입력하세요"
                  loading={isLoading}
                  className={styles.formBoxs}
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
          </div>
        </div>
        <FormButton title={drawerMode === 'create' ? '지도 추가하기' : '지도 수정하기'} event={isButtonDisabled} />
      </form>
    </div>
  )
}

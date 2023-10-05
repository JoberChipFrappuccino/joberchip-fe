export interface SharePage {
  pageId: string
  pageProfileImage: string
  title: string
  description: string
  privilege?: {
    edit: boolean
    delete: boolean
  }
  children: Array<BlockWith<BlockType>>
}

export type BlockType = TText | TImage | TLink | TPage | TEmbed | TVideo | TMap | TTemplate | 'BASE' // HACK : "BASE"는 임시 코드

export type BlockBase<T extends BlockType> = {
  objectId: string
  type: T
  y: number
  x: number
  height: number
  width: number
  h: number
  w: number
  visible: boolean
  i?: string
  maxH?: number
  maxW?: number
  minH?: number
  minW?: number
  isDraggable?: boolean
  isResizable?: boolean
  isBounded?: boolean
  static?: boolean
}

export interface TextBlock extends BlockBase<TText> {
  src: string
}

export interface ImageBlock extends BlockBase<TImage> {
  src: string
  title: string
}

export interface LinkBlock extends BlockBase<TLink> {
  src: string
  title: string
  description: string
}
export interface PageBlock extends BlockBase<TPage> {
  title: string
  description: string
  location: string
  url: string
}
export interface EmbedGoogleMapBlock extends BlockBase<TMap> {
  src: string | undefined
  blockId: number // 지도 블록의 고유 식별자
  address: string // 주소 정보
  latitude: number // 위도
  longitude: number // 경도
  x: number // X 좌표
  y: number // Y 좌표
  height: number // 블록 높이
  width: number // 블록 너비
}

export interface EmbedBlock extends BlockBase<TEmbed> {
  src: string
  caption: string
}
export interface VideoBlock extends BlockBase<TVideo> {
  src: string
  caption: string
}

export interface TemplateBlock extends BlockBase<TTemplate> {
  templateId: string
  title: string
  description: string
  previewURL: string
  iconUrl: string
  url: string
}

export type BlockWith<T> = //
  T extends TText
    ? TextBlock
    : T extends TImage
    ? ImageBlock
    : T extends TLink
    ? LinkBlock
    : T extends TPage
    ? PageBlock
    : T extends TEmbed
    ? EmbedBlock
    : T extends TVideo
    ? VideoBlock
    : T extends TMap
    ? EmbedGoogleMapBlock
    : T extends TTemplate
    ? TemplateBlock
    : never

export interface SpaceList {
  spaceId: string
  mainPageId: string
  mainPageTitle: string
  participationType: ParticipationType
}

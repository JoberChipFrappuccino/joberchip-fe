import { type BlockWith } from '@/models/space'
import { type ResponseBase } from '@/utils/api'
import { backAuthAPI } from './api'

export type AddTemplateBlockAPIParams = Pick<BlockWith<TTemplate>, 'title' | 'description'> & {
  pageId: string
  x: number
  y: number
  w: number
  h: number
}

export const addTemplateBlockAPI = async (body: AddTemplateBlockAPIParams) => {
  const { pageId, ...res } = body
  const response = await backAuthAPI<ResponseBase<BlockWith<TTemplate>>>(`/v1/page/${pageId}/templateBlock`, {
    method: 'POST',
    data: res
  })
  return {
    data: response.data.data,
    status: 'success',
    message: '블록을 추가했습니다.'
  }
}

export type AddLinkBlockParams = {
  x?: number
  y?: number
  w?: number
  h?: number
  title: string
  link: string
}

export const addLinkBlockAPI = async (pageId: any, body: AddLinkBlockParams) => {
  const response = await backAuthAPI(`/v1/page/${pageId}/linkBlock`, {
    method: 'POST',
    data: body
  })
  return {
    data: response.data.response,
    status: 'success',
    message: '링크 블록을 추가했습니다.'
  }
}

export type EditLinkBlockParams = {
  title: string
  link: string
}

export const editLinkBlockAPI = async (pageId: any, blockId: any, body: EditLinkBlockParams) => {
  const response = await backAuthAPI(`/v1/page/${pageId}/linkBlock/${blockId}`, {
    method: 'PUT',
    data: body
  })
  return {
    data: response.data.response,
    status: 'success',
    message: '링크 블록을 수정했습니다.'
  }
}

export type AddImageBlockParams = {
  x?: number
  y?: number
  w?: number
  h?: number
  title: string
  attachedImage: File
}

export const addImageBlockAPI = async (pageId: any, form: any) => {
  const response = await backAuthAPI(`/v1/page/${pageId}/imageBlock`, {
    method: 'POST',
    data: form,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
  return {
    data: response.data.response,
    status: 'success',
    message: '이미지 블록을 추가했습니다.'
  }
}

export type EditImageBlockParams = {
  title: string
  attachedImage: File
}

export const editImageBlockAPI = async (pageId: any, blockId: any, form: any) => {
  const response = await backAuthAPI(`/v1/page/${pageId}/imageBlock/${blockId}`, {
    method: 'PUT',
    data: form
  })
  return {
    data: response.data.response,
    status: 'success',
    message: '이미지 블록을 수정했습니다.'
  }
}

export type AddVideoBlockParams = {
  x?: number
  y?: number
  w?: number
  h?: number
  title: string
  videoLink?: string
  attachedImage?: File
}

export const addVideoBlockAPI = async (pageId: any, form: any) => {
  const response = await backAuthAPI(`/v1/page/${pageId}/videoBlock`, {
    method: 'POST',
    data: form,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
  return {
    data: response.data.response,
    status: 'success',
    message: '비디오 블록을 추가했습니다.'
  }
}

export type EditVideoBlockParams = {
  title: string
  videoLink: string
  attachedImage: File
}

export const editVideoBlockAPI = async (pageId: any, blockId: any, form: any) => {
  const response = await backAuthAPI(`/v1/page/${pageId}/videoBlock/${blockId}`, {
    method: 'PUT',
    data: form
  })
  return {
    data: response.data.response,
    status: 'success',
    message: '비디오 블록을 수정했습니다.'
  }
}

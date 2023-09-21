import ImageBlockForm from '@/components/Forms/ImageBlockForm'
import LinkBlockForm from '@/components/Forms/LinkBlockForm'
import TextBlockForm from '@/components/Forms/TextBlockForm'
import VideoBlockForm from '@/components/Forms/VideoBlockForm'
import { type BlockType, type BlockWith } from '@/models/space'
import { type DrawerMode } from '@/store/formMode'

interface Props<T extends BlockType> {
  block: BlockWith<T>
  mode: DrawerMode
}
function getEditFormComponent<T extends BlockType>({ block, mode }: Props<T>) {
  switch (block.type) {
    case 'text':
      return <TextBlockForm block={block} />
    case 'image':
      return <ImageBlockForm block={block} />
    case 'link':
      return <LinkBlockForm block={block} />
    case 'embed':
      return <h1>Embed block form example</h1>
    case 'video':
      return <VideoBlockForm block={block} />
    case 'googleMap':
      return <h1>GoogleMap block form example</h1>
    case 'page':
      return <h1>Page block form example</h1>
    case 'template':
      return <h1>Template block form example</h1>
    default: {
      if (process.env.NODE_ENV === 'development') {
        throw new Error('Please add a component')
      }
      return null
    }
  }
}

export function DrawerEditForm<T extends BlockType>({ block, mode }: Props<T>) {
  return getEditFormComponent({ block, mode })
}

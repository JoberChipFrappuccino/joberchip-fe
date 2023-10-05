import { GoogleMapBlockForm } from '@/components/Forms/GoogleMapBlockForm'
import { ImageBlockForm } from '@/components/Forms/ImageBlockForm'
import { LinkBlockForm } from '@/components/Forms/LinkBlockForm'
import { PageBlockForm } from '@/components/Forms/PageBlockForm'
import { TemplateBlockEditForm } from '@/components/Forms/TemplateBlockEditForm'
import { TextBlockForm } from '@/components/Forms/TextBlockForm'
import { VideoBlockForm } from '@/components/Forms/VideoBlockForm'
import { EMBED, IMAGE, LINK, MAP, PAGE, TEMPLATE, TEXT, VIDEO } from '@/constants/blockTypeConstant'
import { type BlockType } from '@/models/space'
import { type BlockBaseWithBlockProps } from './ViewerBox'

export interface BlockBaseWithBlockFormProps<T extends BlockType> extends Partial<BlockBaseWithBlockProps<T>> {}

function getEditFormComponent<T extends BlockType>({ block }: BlockBaseWithBlockFormProps<T>) {
  switch (block?.type) {
    case TEXT:
      return <TextBlockForm block={block} />
    case IMAGE:
      return <ImageBlockForm block={block} />
    case LINK:
      return <LinkBlockForm block={block} key={block.objectId} />
    case EMBED:
      return <h1>Embed block form example</h1>
    case VIDEO:
      return <VideoBlockForm block={block} />
    case MAP:
      return <GoogleMapBlockForm block={block} />
    case PAGE:
      return <PageBlockForm block={block} />
    case TEMPLATE:
      return <TemplateBlockEditForm block={block} />
    default: {
      if (process.env.NODE_ENV === 'development') {
        throw new Error('Please add a component')
      }
      return null
    }
  }
}

export function DrawerEditForm<T extends BlockType>({ block, mode }: BlockBaseWithBlockFormProps<T>) {
  return getEditFormComponent({ block, mode })
}

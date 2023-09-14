import SwtichActionBlock from '@/components/SwitchCase/SwitchActionBlock'
import SwtichActionForm from '@/components/SwitchCase/SwitchActionForm'
import { useDrawerFormType } from '@/store/formMode'
import { Drawer as AntdDrawer } from 'antd'

export function Drawer() {
  const { formType, openDrawer, setOpenDrawer } = useDrawerFormType()

  return (
    <AntdDrawer
      title="Basic AntdDrawer"
      placement="right"
      onClose={() => {
        setOpenDrawer(false)
      }}
      open={openDrawer}
    >
      {formType === 'block' ? <SwtichActionBlock /> : <SwtichActionForm />}
    </AntdDrawer>
  )
}

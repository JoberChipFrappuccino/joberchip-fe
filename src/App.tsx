import loadable from '@loadable/component'
import { Route, Routes } from 'react-router-dom'
import './App.scss'
// HACK : webpack이 node_modules안에있는 css파일 해석하지 못하는 에러가 있어서 임시로 css파일을 카피해서 사용중입니다.
import './antd.scss'
import './reactGridLayout.scss'
import './toast.scss'

// * Layouts
const Layout = loadable(() => import('./components/Layouts/Layout'))
const SharePageLayout = loadable(() => import('./components/Layouts/SpaceLayout'))
const TempSharePageLayout = loadable(() => import('./components/Layouts/TempSharePageLayout'))

// * Pages
const Space = loadable(() => import('./pages/Space'))
const SharePage = loadable(() => import('./pages/SharePage'))
const SignUp = loadable(() => import('./pages/SignUp'))
const SignIn = loadable(() => import('./pages/SignIn'))
const TempSharePage = loadable(() => import('./pages/TempSharePage'))
const NotFound = loadable(() => import('./pages/NotFound'))

export default function App() {
  return (
    <Routes>
      <Route path="/temp" element={<TempSharePageLayout />}>
        <Route path="/temp/space/:pageId" element={<TempSharePage />} />
      </Route>
      <Route path="/" element={<Layout />}>
        <Route path="/" element={<Space />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
      </Route>
      <Route path="/" element={<SharePageLayout />}>
        <Route path="/space/:pageId" element={<SharePage />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

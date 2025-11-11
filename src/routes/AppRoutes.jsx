import { Route, Routes } from 'react-router-dom'
const Community = (() => import('../pages/Community'))
const Profile = React.lazy(() => import('../pages/Profile'))
const SinglePrompt = React.lazy(() => import('../pages/SinglePrompt'))
const CreatePrompt = React.lazy(() => import('../pages/CreatePrompt'))
const LikedPrompt = React.lazy(() => import('../pages/LikedPrompt'))
import React from 'react'
import { Suspense } from 'react'
import Loading from '../components/Loading'

const AppRoutes = () => {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path='/createPrompt' element={<CreatePrompt />} />
        <Route path='/likedPrompt' element={<LikedPrompt />} />
        <Route path='/' element={<Community />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/singleprompt/:id' element={<SinglePrompt />} />
      </Routes>
    </Suspense>
  )
}

export default AppRoutes
import { Route, Routes } from 'react-router-dom'
import Login from '../pages/Login'
import Register from '../pages/Register'
import Community from '../pages/Community'
import Profile from '../pages/Profile'
import SinglePrompt from '../pages/SinglePrompt'
import CreatePrompt from '../pages/CreatePrompt'
import LikedPrompt from '../pages/LikedPrompt'

const AppRoutes = () => {
  return (
    <Routes>
        <Route path='/createPrompt' element={<CreatePrompt/>}/>
        <Route path='/likedPrompt' element={<LikedPrompt/>}/>
        <Route path='/' element={<Community/>}/>
        <Route path='/profile' element={<Profile/>}/>
        <Route path='/singleprompt/:id' element={<SinglePrompt/>}/>
    </Routes>
  )
}

export default AppRoutes
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'
import Layout from './Layout.jsx'
import LandingPage from './components/LandingPage.jsx'
import Login from './components/Login.jsx'
import Register from './components/Register.jsx'
import Trending from './components/Trending.jsx'
import StickerDetailPage from './components/StickerDetailPage.jsx'
import Categories from './components/Categories.jsx'
import CreateFrom from './components/CreateForm.jsx'
import UserCollection from './components/UserCollection.jsx'




const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<Layout />}>
      <Route path='' element={<LandingPage />} />
      <Route path='login' element={<Login />} />
      <Route path='register' element={<Register />} />
      <Route path='trending' element={<Trending />} />
      <Route path='collection' element={<UserCollection/>}/>
      <Route path='stickers/:id' element={<StickerDetailPage />} />
      <Route path='categories' element={<Categories />} />
      <Route path='create' element={<CreateFrom />} />
    </Route>
  )
)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
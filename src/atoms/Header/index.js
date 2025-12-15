import React from 'react'
import SideBar from '../Navigation/Desktop'
import { MobileNavigation } from '../Navigation/Mobile'

const Header = () => {
  return (
    <div>
        <SideBar />
        <MobileNavigation />
    </div>
  )
}

export default Header

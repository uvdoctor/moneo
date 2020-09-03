import React from 'react'
import Logo from './logo'
import Menu from './menu'

export default function FixedHeader() {
    return (
        <nav
      className="fixed bg-white md:text-lg lg:text-xl flex w-full items-end justify-between flex-wrap py-1 cursor font-bold"
    >
      <Logo />
      <Menu />
    </nav>
    )
}
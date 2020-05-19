import React from 'react'
import { NextPage } from 'next'
import Link from 'next/link'

interface Props {}

const Dashboard: NextPage<Props> = () => (
  <ul>
      <li className="font-black">Dashboard</li>
      <li><Link href="/"><a>Home</a></Link></li>
  </ul>
)

export default Dashboard
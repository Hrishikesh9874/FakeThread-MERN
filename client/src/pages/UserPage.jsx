import React from 'react'
import UserHeader from '../components/UserHeader'
import UserPost from '../components/UserPost'

export default function UserPage() {
  return (
    <div>
        <UserHeader></UserHeader>
        <UserPost likes='1200' replies='361' postImg='/post1.png' postTitle='Lets talk about threads'></UserPost>
        <UserPost likes='740' replies='251' postImg='/post2.png' postTitle='The talking on any issue is addressable here..'></UserPost>
        <UserPost likes='1451' replies='84' postImg='/post3.png' postTitle='How are you guys doin, Wanna know about space tech with me!!?'></UserPost>
        <UserPost likes='1270' replies='169' postTitle='This is my very first post'></UserPost>
    </div>
  )
}
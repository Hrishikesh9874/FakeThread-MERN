import { Avatar, Flex, Text } from '@chakra-ui/react'
import React from 'react'

export default function Message({ownMessage}) {
  return (
    <>
      {ownMessage ? (
        <Flex gap='2' alignSelf={'flex-end'}>
          <Text maxW='350px' bg='blue.400' p='1' borderRadius='md'>Lorem ipsum </Text>
          <Avatar src='' w='7' h='7' />
        </Flex>
      ) : (
        <Flex gap='2'>
          <Avatar src='' w='7' h='7' />
          <Text maxW='350px' bg='gray.400' color='black' p='1' borderRadius='md'>Unde eligendi quibusdam facere ipsa adipisci, quos possimus quaerat consectetur culpa?</Text>
        </Flex>
      )}
    </>
  )
}

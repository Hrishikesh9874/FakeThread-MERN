import { useToast } from '@chakra-ui/react';

export default function useShowToast() {

    const toast = useToast();
    const showToast = (title, description, status) => {
        toast({
            title: title,
            description: description,
            status: status,
            duraton: 3000,
            isClosable: true
        })
    }

  return showToast;
}

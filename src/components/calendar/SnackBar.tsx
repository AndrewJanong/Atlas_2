import { Box, Flex } from '@chakra-ui/react'
import { CheckIcon } from '@chakra-ui/icons'
import { Text } from '@chakra-ui/react'

const SnackBar = (props: {title: string, content: string}) => {
    
    return (
        <Flex borderRadius='md' bg='#e1fce8' width='70%' height='72px' alignItems='center'>
            <CheckIcon color='#276749' height='36px' width='36px' mx='16px'/>
            <div>
                <Text fontWeight='bold' color='#276749'>{props.title}</Text>
                <Text color='#276749'>{props.content}</Text>
            </div>
        </Flex>
    )
}

export default SnackBar
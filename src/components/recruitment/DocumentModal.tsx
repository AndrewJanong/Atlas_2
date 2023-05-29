import {
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from '@chakra-ui/react'
import { getDownloadURL, listAll, ref } from 'firebase/storage'
import { useEffect, useState } from 'react'
import { BsFolder2Open } from 'react-icons/bs'
import { storage } from '~/../firebase'
import DocumentModalAdd from './DocumentModalAdd'
import DocumentModalCard from './DocumentModalCard'

const DocumentModal = ({
  applicantId,
  applicantName,
}: {
  applicantId: string
  applicantName: string
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [fileList, setFileList] = useState<string[]>([])
  const applicantListRef = ref(storage, `${applicantId}/`)

  // Hook to get the files associated with the applicant
  useEffect(() => {
    listAll(applicantListRef)
      .then((res) => {
        const urlList: string[] = []
        res.items.forEach((item) => {
          getDownloadURL(item).then((url) => {
            urlList.push(url)
          })
        })
        setFileList(urlList)
      })
      .catch((err) => {
        console.log(err)
      })
    console.log('fileList: ', fileList)
  }, [])

  return (
    <>
      <IconButton
        aria-label="Upload documents"
        icon={<BsFolder2Open />}
        bg="None"
        _hover={{ background: 'None' }}
        onClick={onOpen}
        fontSize="23px"
      />
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent
          pb={4}
          backgroundColor="#F1F3FF"
          borderRadius="20px"
          boxShadow="0px 4px 4px rgba(0, 0, 0, 0.25)"
        >
          <ModalHeader textAlign="center" fontSize="2xl">
            {applicantName} Documents
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <div className="my-5 mx-10 grid grid-cols-1 place-items-center gap-y-10 lg:grid-cols-2 ">
              {fileList.map((file) => {
                console.log('file: ', file)
                return <DocumentModalCard file={file} key={file} />
              })}
            </div>
            <DocumentModalAdd applicantId={applicantId} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export default DocumentModal

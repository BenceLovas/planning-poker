import React, { FunctionComponent } from 'react'
import { Modal, Text, Input, Button } from '@nextui-org/react'

type NameInputModalProps = {
  openModalForNameInput: boolean
  closeModal: () => void
  userNameInput: string
  setUserNameInput: (name: string) => void
}

export const NameInputModal: FunctionComponent<NameInputModalProps> = ({
  openModalForNameInput,
  closeModal,
  userNameInput,
  setUserNameInput,
}) => {
  return (
    <Modal
      aria-labelledby="modal-title"
      open={openModalForNameInput}
      onClose={closeModal}
      blur
      preventClose
    >
      <Modal.Header>
        <Text id="modal-title" size={18}>
          Choose your display name
        </Text>
      </Modal.Header>
      <Modal.Body>
        <Input
          clearable
          bordered
          fullWidth
          color="primary"
          size="lg"
          placeholder="Enter your display name"
          rounded
          onChange={(e) => setUserNameInput(e.target.value)}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button
          auto
          onClick={closeModal}
          rounded
          disabled={!Boolean(userNameInput?.length)}
        >
          Continue to game
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

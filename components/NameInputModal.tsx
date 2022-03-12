import React, { FunctionComponent } from 'react'
import { Modal, Text, Input, Button } from '@nextui-org/react'

type NameInputModalProps = {
  openModalForNameInput: boolean
  closeModal: () => void
  userNameInput: string
  setUserNameInput: (name: string) => void
}

const NameInputModal: FunctionComponent<NameInputModalProps> = ({
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
      preventClose
    >
      <form onSubmit={(e) => e.preventDefault()}>
        <Modal.Header>
          <Text id="modal-title" size={18}>
            Choose your display name
          </Text>
        </Modal.Header>
        <Modal.Body
          style={{
            paddingBottom: 24,
          }}
        >
          <Input
            autoFocus
            value={userNameInput}
            clearable
            bordered
            fullWidth
            color={'primary'}
            size="lg"
            placeholder="Enter your display name"
            rounded
            onChange={(e) => setUserNameInput(e.target.value)}
            maxLength={20}
            helperText={'Enter a name between 3 and 20 characters'}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button
            auto
            onClick={closeModal}
            rounded
            disabled={
              !Boolean(userNameInput?.trim().length >= 3) ||
              !Boolean(userNameInput?.trim().length <= 20)
            }
          >
            Continue to game
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  )
}

export default NameInputModal

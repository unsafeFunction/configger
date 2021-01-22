import React, { useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import DefaultModal from 'components/widgets/DefaultModal'
import actions from 'redux/modal/actions'

const ConfirmModal = props => {
  const modal = useSelector(state => state.modal)

  const dispatch = useDispatch()

  const onCancel = useCallback(() => {
    dispatch({ type: actions.HIDE_MODAL })
  }, [dispatch])

  const onOk = useCallback(() => {
    props.onOk()

    dispatch({ type: actions.HIDE_MODAL })
  }, [dispatch, props])

  const { message } = props

  return (
    <DefaultModal {...props} onOk={onOk} onCancel={onCancel} isOpen={modal.isOpen}>
      {message()}
    </DefaultModal>
  )
}

export default ConfirmModal

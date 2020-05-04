import React, { useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Modal } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'

import actions from 'redux/modal/actions'

const HelperModal = React.memo(props => {
  const modal = useSelector(state => state.modal)

  const dispatch = useDispatch()

  const onCancel = useCallback(() => {
    dispatch({ type: actions.HIDE_MODAL })
  }, [dispatch])

  const { message } = props

  switch (modal.modalType) {
    case 'WARNING_MODAL': {
      Modal.confirm({
        ...props,
        icon: <ExclamationCircleOutlined color="#faad14" />,
        onCancel,
        content: message(),
      })
      return null
    }
    default:
      return null
  }
})

export default HelperModal

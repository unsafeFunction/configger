/* eslint-disable react/require-default-props */
/* eslint-disable import/no-extraneous-dependencies */
import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import Confirm from './Confirm'
import HelperModal from './HelperModal'

const MODALS_COMPONENTS = {
  ERROR_MODAL: HelperModal,
  WARNING_MODAL: HelperModal,
  CONFIRM_MODAL: Confirm,
  COMPLIANCE_MODAL: HelperModal,
}

const Modals = ({ modalType, modalProps }) => {
  if (!modalType) {
    return <span />
  }
  const SelectedModal = MODALS_COMPONENTS[modalType]

  return <SelectedModal {...modalProps} />
}

Modals.propTypes = {
  modalType: PropTypes.string,
  modalProps: PropTypes.object,
}

export default connect(state => {
  return state.modal
})(Modals)

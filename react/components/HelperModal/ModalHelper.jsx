import React from "react"

//VTEX Resources
import { Modal } from 'vtex.styleguide'
import { useCssHandles } from 'vtex.css-handles'

//Local Contexts
import { ModalsContext } from '../../contexts/ModalsContext'

// VTEX External Apps
import RichText from 'vtex.rich-text/index'

//CSS Handles
const CSS_HANDLES = [
  "modalHelper",
  "modal__titleWrapper",
  "modal__title",
  "modal__content"
]

const ModalHelper = (props) => {

  //Use Hooks
  const handles = useCssHandles(CSS_HANDLES)

  //Variables Hooks
  const {isModalHelperOpen, setModalHelperOpen} = React.useContext(ModalsContext)

  return (
    <>
      <Modal
        responsiveFullScreen
        centered
        title={
          <div className={`${handles.modal__titleWrapper} ${handles.modalHelper}`}>
            <h3 className={`${handles.modal__title} flex items-center mt0 mb0 t-heading-3 c-on-base`}>
              {props.modalHelperTitle}
            </h3>
          </div>
        }
        children={
          <>
            <div className={`${handles.modal__content} ${handles.modalHelper} t-action--medium c-on-base`}>
              <RichText text="Lorem ipsum dolor ..." />
            </div>
          </>
        }
        isOpen={isModalHelperOpen}
        onClose={()=>setModalHelperOpen(false)}
      >
      </Modal>
    </>
  )
}


export default ModalHelper

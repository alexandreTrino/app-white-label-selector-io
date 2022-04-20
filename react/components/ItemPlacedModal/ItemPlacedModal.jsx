import React from "react"

//VTEX Resources
import { useCssHandles } from 'vtex.css-handles'
import { FormattedMessage } from 'react-intl'
import { useProduct } from 'vtex.product-context'
import { Modal, Button } from 'vtex.styleguide'

//Local Contexts
import { ModalsContext } from '../../contexts/ModalsContext'

//Local handles
import handles from './style.css'

// VTEX External Apps
import RichText from 'vtex.rich-text/index'

//CSS Handles
const CSS_HANDLES = [
  "itemPlacedModal",
  "modal__titleWrapper",
  "modal__title",
  "modal__content",
  "itemPlacedModal__title",
  "itemPlacedModal__subTitle",
  "itemPlacedModal__content",
  "ItemPlacedModal__details",
  "itemPlacedModal__img",
  "itemPlacedModal__skuName",
  "itemPlacedModal__selectedQtyWrapper",
  "itemPlacedModal__labelSelectedQty",
  "itemPlacedModal__selectedQty",
  "itemPlacedModal__bottomBar",
  "itemPlacedModal__toNavigate",
  "itemPlacedModal__toCheckout"
]

const ItemPlacedModal = (props) => {

  //Use Hooks
  const handles = useCssHandles(CSS_HANDLES)
  const productContextValue = useProduct()

  //Variables Hooks
  const {isItemPlacedModalOpen, setItemPlacedModalOpen} = React.useContext(ModalsContext)

  return (
    <>
      <Modal
        responsiveFullScreen
        centered
        title={
          <>
            <h3 className={`${handles.itemPlacedModal__title} flex items-center`}>
              <FormattedMessage id="store/subscription-modal.titleItemPlacedModal"/>
            </h3>
            <p className={`${handles.itemPlacedModal__subTitle} flex items-center`}>
              <FormattedMessage id="store/subscription-modal.subTitleItemPlacedModal"/>
            </p>
          </>
        }
        children={
          <>
          <div className={`${handles.itemPlacedModal__content} flex items-center`}>
            <div className={`${handles.itemPlacedModal__img} flex items-center`}>
              <img
                src={productContextValue.selectedItem.images[0].imageUrl}
                title={productContextValue.selectedItem.name}
                title={productContextValue.selectedItem.name}
              />
            </div>
            <div className={`${handles.ItemPlacedModal__details} flex flex-column`}>
              <b className={handles.itemPlacedModal__skuName}>
                {productContextValue.selectedItem.name}
              </b>
              <p className={handles.itemPlacedModal__selectedQtyWrapper}>
                <span className={handles.itemPlacedModal__labelSelectedQty}>
                  <FormattedMessage id="store/subscription-modal.selectedQuantity"/>
                </span>
                <span className={handles.itemPlacedModal__selectedQty}>
                  {productContextValue.selectedQuantity}
                </span>
              </p>
            </div>
          </div>
        </>
        }
        bottomBar={
          <div className={`${handles.itemPlacedModal__bottomBar} flex items-center`}>
            <Button
              className={handles.itemPlacedModal__toNavigate}
              variation="tertiary"
              onClick={()=>{setItemPlacedModalOpen(false)}
              }
            >
              <FormattedMessage id="store/subscription-modal.toNavigate"/>
            </Button>
            <Button
              variation="primary"
              className={handles.itemPlacedModal__toCheckout}
              onClick={()=>{window.location.href="/checkout/#/cart"}}
            >
              <FormattedMessage id="store/subscription-modal.toCheckout"/>
            </Button>
          </div>
        }
        isOpen={isItemPlacedModalOpen}
        onClose={()=>{setItemPlacedModalOpen(false)}}
      >
      </Modal>
    </>
  )
}


export default ItemPlacedModal

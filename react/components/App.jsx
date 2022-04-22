import React from "react"

//Local contexts
import { ModalsContext } from '../contexts/ModalsContext'

//VTEX Resources
import { useProduct } from 'vtex.product-context'
import { useCssHandles } from 'vtex.css-handles'
import { FormattedPrice } from 'vtex.formatted-price'
import { FormattedMessage } from 'react-intl'
import { Button } from 'vtex.styleguide'

// VTEX External Apps
import RichText from 'vtex.rich-text/index'

//style handles
import handles from './App.css'

//Utils
import { calcDiscount } from '../utils/functions'

//local apps
import SubscriptionModal from './SubscriptionModal/SubscriptionModal'
import ItemPlacedModal from './ItemPlacedModal/ItemPlacedModal'

//CSS Handles
const CSS_HANDLES = [
  "subscription__wrapper",
  "subscription__helper",
  "subscription__title",
  "subscription__iconHelper",
  "spinner",
  "modalHelperTitleSpan",
  "helperLabel",
  "modalHelperTitleStore",
  "content",
  "subscription__discountValue",
  "subscription__percentDiscountPercent",
  "subscription__percentDiscountPercent__label",
  "openModalSubscriberButtonWrapper",
  "subscribeModalSubtitle"
]

const App = (props) => {

  //Use Hooks
  const { setModalHelperOpen, setModalSubscriberOpen } = React.useContext(ModalsContext)
  const handles = useCssHandles(CSS_HANDLES)
  const productContextValue = useProduct()

  //Variables Hooks
  const currentPrice = productContextValue.selectedItem.sellers[0].commertialOffer.PriceWithoutDiscount

  return (
    <>
      <div className={`${handles.subscription__wrapper}`}>
        <div className={`${handles.content} flex items-center`}>
          <span className={`${handles.subscription__title}`}>
            <FormattedMessage id="store/subscription-modal.title"/>
          </span>
          <span className={handles.subscription__discountValue}>
            <FormattedPrice value={calcDiscount(currentPrice, props.percentOff)} />
          </span>
          <span className={`${handles.subscription__percentDiscountPercent}`}>
            <span className={`${handles.subscription__percentDiscountPercent__label}`}>
              {props.percentOff}% OFF
            </span>
          </span>
        </div>
        <div className={`${handles.openModalSubscriberButtonWrapper}`}>
          <Button onClick={()=>setModalSubscriberOpen(true)}>
            <FormattedMessage id="store/subscription-modal.openSubscriberButton"/>
          </Button>
        </div>
        {
          props.isHelperLabel && (
            <div className={`${handles.subscription__helper} flex items-center`}>
              <span className={`${handles.subscription__iconHelper} flex items-center`}>
                <svg width="14" height="14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7 .332a6.668 6.668 0 1 0 .003 13.335A6.668 6.668 0 0 0 7 .332Zm0 12.043a5.373 5.373 0 0 1-5.376-5.376 5.374 5.374 0 0 1 5.377-5.377A5.375 5.375 0 0 1 12.377 7a5.373 5.373 0 0 1-5.376 5.376Zm2.884-6.86c0 1.802-1.947 1.83-1.947 2.496v.17a.323.323 0 0 1-.323.323H6.387a.323.323 0 0 1-.322-.323V7.95c0-.961.728-1.345 1.279-1.654.472-.265.76-.445.76-.795 0-.464-.59-.771-1.069-.771-.623 0-.91.295-1.315.805a.323.323 0 0 1-.448.057l-.748-.567a.323.323 0 0 1-.071-.44c.635-.932 1.444-1.456 2.703-1.456 1.32 0 2.728 1.03 2.728 2.387ZM8.13 10.009A1.13 1.13 0 0 1 7 11.14a1.13 1.13 0 0 1-1.128-1.13c0-.622.506-1.129 1.129-1.129a1.13 1.13 0 0 1 1.129 1.13Z" fill="currentColor"></path></svg>
              </span>
              <RichText
                className={handles.helperLabel}
                text={props.helperLabel}
              />
            </div>
          )
        }
      </div>

      <SubscriptionModal
        frequencyList={props.frequencyList}
        noFrequencyText={props.noFrequencyText}
      />

      <ItemPlacedModal
        frequencyList={props.frequencyList}
        noFrequencyText={props.noFrequencyText}
      />

    </>
  )
}


export default App

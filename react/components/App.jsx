import React from "react"

//Local contexts
import { ModalsContext } from '../contexts/ModalsContext'

//VTEX Resources
import { useProduct } from 'vtex.product-context'
import { useCssHandles } from 'vtex.css-handles'
import { FormattedPrice } from 'vtex.formatted-price'
import { FormattedMessage } from 'react-intl'
import { Button } from 'vtex.styleguide'

//style handles
import handles from './App.css'

//Utils
import { calcDiscount } from '../utils/functions'

//local apps
import ModalHelper from './HelperModal/ModalHelper'
import SubscriptionModal from './SubscriptionModal/SubscriptionModal'
import ItemPlacedModal from './ItemPlacedModal/ItemPlacedModal'

//CSS Handles
const CSS_HANDLES = [
  "wrapperSubscription",
  "titleWrapper",
  "iconTitle",
  "iconHelper",
  "spinner",
  "modalHelperTitleSpan",
  "modalHelperTitleStore",
  "content",
  "valueWithDiscount",
  "percentOff",
  "percentOff__label",
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
      <div className={`${handles.wrapperSubscription}`}>
        <div className={`${handles.titleWrapper} flex items-center`}>
          <svg className={`${handles.iconTitle}`} xmlns="http://www.w3.org/2000/svg" stroke="currentColor" width="62" height="62" viewBox="0 0 62 62"> <g id="Grupo_3" data-name="Grupo 3" transform="translate(-929 -509)"> <g id="Grupo_1" data-name="Grupo 1" transform="translate(928 508)"> <path id="layer1" d="M2,62V20L14,2H50L62,20V62ZM2,20H62" fill="none" stroke="currentCollor" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="3"/> <path id="layer1-2" data-name="layer1" d="M32,2V20" fill="none" stroke="currentCollor" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="3"/> </g> <g id="Grupo_2" data-name="Grupo 2" transform="translate(947.406 532.694)"> <path id="layer1-3" data-name="layer1" d="M14.242,2,12,7.606l5.38,1.12" transform="translate(-5.517)" fill="none" stroke="currentCollor" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="3"/> <path id="layer2" d="M53.173,33.036,49.275,29,46,33.036" transform="translate(-24.273 -14.895)" fill="none" stroke="currentCollor" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="3"/> <path id="layer1-4" data-name="layer1" d="M4.242,40.411,9.62,39.245l-1.791-5.11m1.791,5.11a11.666,11.666,0,0,1-6.275-16.38" transform="translate(0 -11.51)" fill="none" stroke="currentCollor" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="3"/> <path id="layer2-2" data-name="layer2" d="M40.454,29A11.667,11.667,0,0,1,30.01,43.312" transform="translate(-15.452 -14.895)" fill="none" stroke="currentCollor" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="2"/> <path id="layer1-5" data-name="layer1" d="M12,11.467a11.66,11.66,0,0,1,16.361,2.014" transform="translate(-5.517 -3.861)" fill="none" stroke="currentCollor" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="2"/></g></g></svg>
          <span className={`${handles.title}`}>
            <FormattedMessage id="store/subscription-modal.title"/>
          </span>
          <span className={`${handles.iconHelper} flex items-center`} onClick={()=>setModalHelperOpen(true)}>
            <svg width="14" height="14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7 .332a6.668 6.668 0 1 0 .003 13.335A6.668 6.668 0 0 0 7 .332Zm0 12.043a5.373 5.373 0 0 1-5.376-5.376 5.374 5.374 0 0 1 5.377-5.377A5.375 5.375 0 0 1 12.377 7a5.373 5.373 0 0 1-5.376 5.376Zm2.884-6.86c0 1.802-1.947 1.83-1.947 2.496v.17a.323.323 0 0 1-.323.323H6.387a.323.323 0 0 1-.322-.323V7.95c0-.961.728-1.345 1.279-1.654.472-.265.76-.445.76-.795 0-.464-.59-.771-1.069-.771-.623 0-.91.295-1.315.805a.323.323 0 0 1-.448.057l-.748-.567a.323.323 0 0 1-.071-.44c.635-.932 1.444-1.456 2.703-1.456 1.32 0 2.728 1.03 2.728 2.387ZM8.13 10.009A1.13 1.13 0 0 1 7 11.14a1.13 1.13 0 0 1-1.128-1.13c0-.622.506-1.129 1.129-1.129a1.13 1.13 0 0 1 1.129 1.13Z" fill="currentColor"></path></svg>
          </span>
        </div>
        <div className={`${handles.content} flex items-start`}>
          <span className={handles.valueWithDiscount}>
            <FormattedPrice value={calcDiscount(currentPrice, props.percentOff)} />
          </span>
          <span className={`${handles.percentOff}`}>
            <span className={`${handles.percentOff__label}`}>
              {props.percentOff}% OFF
            </span>
          </span>
        </div>
        <div className={`${handles.openModalSubscriberButtonWrapper}`}>
          <Button onClick={()=>setModalSubscriberOpen(true)}>
            <FormattedMessage id="store/subscription-modal.openSubscriberButton"/>
          </Button>
        </div>
      </div>

      <ModalHelper
        modalHelperTitle={props.modalHelperTitle}
      />

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

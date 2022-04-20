import React, {useState} from "react"

//VTEX resources
import { useProduct } from 'vtex.product-context'
import { useCssHandles } from 'vtex.css-handles'
import { FormattedMessage } from 'react-intl'
import { useRuntime, canUseDOM } from 'vtex.render-runtime'
import {
  Modal,
  Button,
  Spinner
} from 'vtex.styleguide'

// External apps
import RichText from 'vtex.rich-text/index'

//Local handles
import handles from './style.css'

//Local components
import SubscriptionModalChildren from './components/SubscriptionModalChildren'


const CSS_HANDLES = [
  "wrapperSubscription",
  "titleWrapper",
  "iconTitle",
  "iconHelper",
  "spinner",
  "modalTitleHelperSpan",
  "modalTitleHelperStore",
  "content",
  "valueWithDiscount",
  "percentOff",
  "percentOff__label",
  "openModalSubscriberButtonWrapper",
  "subscribeModalSubtitle"
]

const SubscriptionModal = (props) => {

  const handles = useCssHandles(CSS_HANDLES)
  const productContextValue = useProduct()
  const { culture } = useRuntime()

  const isSubscribe = productContextValue.selectedItem.attachments.length > 0
  const currentPrice = productContextValue.selectedItem.sellers[0].commertialOffer.PriceWithoutDiscount
  const [isOpenModalHelper, setOpenModalHelper] = useState(false)
  const [isOpenModalSubscriber, setOpenModalSubscriber] = useState(false)

  const calcDiscount = (priceItem) => {
    const val = priceItem - priceItem * (props.percentOff / 100)
    return `${val.toLocaleString((culture.locale).toLowerCase(), {
      style: 'currency',
      currency: culture.currency,
    })}`
  }

  return (
    <>
      {
        canUseDOM ? (
          isSubscribe && (
            <>
              <div className={`${handles.wrapperSubscription}`}>
                <div className={`${handles.titleWrapper} flex items-center`}>
                  <svg className={`${handles.iconTitle}`} xmlns="http://www.w3.org/2000/svg" stroke="currentColor" width="62" height="62" viewBox="0 0 62 62"> <g id="Grupo_3" data-name="Grupo 3" transform="translate(-929 -509)"> <g id="Grupo_1" data-name="Grupo 1" transform="translate(928 508)"> <path id="layer1" d="M2,62V20L14,2H50L62,20V62ZM2,20H62" fill="none" stroke="currentCollor" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="3"/> <path id="layer1-2" data-name="layer1" d="M32,2V20" fill="none" stroke="currentCollor" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="3"/> </g> <g id="Grupo_2" data-name="Grupo 2" transform="translate(947.406 532.694)"> <path id="layer1-3" data-name="layer1" d="M14.242,2,12,7.606l5.38,1.12" transform="translate(-5.517)" fill="none" stroke="currentCollor" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="3"/> <path id="layer2" d="M53.173,33.036,49.275,29,46,33.036" transform="translate(-24.273 -14.895)" fill="none" stroke="currentCollor" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="3"/> <path id="layer1-4" data-name="layer1" d="M4.242,40.411,9.62,39.245l-1.791-5.11m1.791,5.11a11.666,11.666,0,0,1-6.275-16.38" transform="translate(0 -11.51)" fill="none" stroke="currentCollor" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="3"/> <path id="layer2-2" data-name="layer2" d="M40.454,29A11.667,11.667,0,0,1,30.01,43.312" transform="translate(-15.452 -14.895)" fill="none" stroke="currentCollor" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="2"/> <path id="layer1-5" data-name="layer1" d="M12,11.467a11.66,11.66,0,0,1,16.361,2.014" transform="translate(-5.517 -3.861)" fill="none" stroke="currentCollor" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="2"/></g></g></svg>
                  <span className={`${handles.title}`}>
                    <FormattedMessage id="store/subscription-modal.title"/>
                  </span>
                  <span className={`${handles.iconHelper} flex items-center`} onClick={()=>setOpenModalHelper(true)}>
                    <svg width="14" height="14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7 .332a6.668 6.668 0 1 0 .003 13.335A6.668 6.668 0 0 0 7 .332Zm0 12.043a5.373 5.373 0 0 1-5.376-5.376 5.374 5.374 0 0 1 5.377-5.377A5.375 5.375 0 0 1 12.377 7a5.373 5.373 0 0 1-5.376 5.376Zm2.884-6.86c0 1.802-1.947 1.83-1.947 2.496v.17a.323.323 0 0 1-.323.323H6.387a.323.323 0 0 1-.322-.323V7.95c0-.961.728-1.345 1.279-1.654.472-.265.76-.445.76-.795 0-.464-.59-.771-1.069-.771-.623 0-.91.295-1.315.805a.323.323 0 0 1-.448.057l-.748-.567a.323.323 0 0 1-.071-.44c.635-.932 1.444-1.456 2.703-1.456 1.32 0 2.728 1.03 2.728 2.387ZM8.13 10.009A1.13 1.13 0 0 1 7 11.14a1.13 1.13 0 0 1-1.128-1.13c0-.622.506-1.129 1.129-1.129a1.13 1.13 0 0 1 1.129 1.13Z" fill="currentColor"></path></svg>
                  </span>
                </div>
                <div className={`${handles.content} flex items-start`}>
                  <span className={handles.valueWithDiscount}>
                    {calcDiscount(currentPrice)}
                  </span>
                  <span className={`${handles.percentOff}`}>
                    <span className={`${handles.percentOff__label}`}>
                      {props.percentOff}% OFF
                    </span>
                  </span>
                </div>
                <div className={`${handles.openModalSubscriberButtonWrapper}`}>
                  <Button onClick={()=>setOpenModalSubscriber(true)}>
                    <FormattedMessage id="store/subscription-modal.openSubscriberButton"/>
                  </Button>
                </div>
              </div>

              <Modal
                responsiveFullScreen
                centered
                title={
                  <span className={`${handles.modalTitleHelperSpan} flex items-center`}>
                    {props.modalTitleHelper}
                  </span>
                }
                children={<RichText text="Lorem ipsum dolor ..." />}
                isOpen={isOpenModalHelper}
                onClose={()=>setOpenModalHelper(false)}
              >
              </Modal>

              <Modal
                responsiveFullScreen
                centered
                title={
                  <>
                    <h3 className={`${handles.modalTitleHelperSpan} flex items-center`}>
                      <FormattedMessage id="store/subscription-modal.schemaModalTitleSubscriber"/>
                    </h3>
                    <p className={handles.subscribeModalSubtitle}>
                      <FormattedMessage id="store/subscription-modal.schemaModalSubTitleSubscriber"/>
                    </p>
                  </>
                }
                isOpen={isOpenModalSubscriber}
                onClose={()=>setOpenModalSubscriber(false)}
                children={
                  <div id="modalSubscriber">
                    <SubscriptionModalChildren
                      noFrequencyText={props.noFrequencyText}
                      frequencyList={props.frequencyList}
                      setOpenModalSubscriber={setOpenModalSubscriber}
                    />
                  </div>
                }
              >
              </Modal>

            </>
          )
        ) : (
          <div className={`${handles.wrapper} ${handles.wrapperSubscription}`}>
            <Spinner className={handles.spinner} color="currentColor" size={20} />
          </div>
        )
      }
    </>
  )

}

SubscriptionModal.defaultProps = {
  modalTitleHelper: "Subscription Store",
  percentOff: 10,
  noFrequencyText: "There is still not purchase day options.",
}

SubscriptionModal.schema = {
  title: 'Subscription Modal',
  description: 'For users that wish to subscribe a product',
  type: 'object',
  properties: {
    modalTitleHelper:{
      type: 'string',
      title: 'Modal Helper title',
      default: SubscriptionModal.defaultProps.modalTitleHelper
    },
    percentOff: {
      type: 'number',
      title: 'Percent discount',
      default: SubscriptionModal.defaultProps.percentOff
    },
    noFrequencyText: {
      title: 'No Frequency items text',
      description: '',
      type: 'string',
      default: SubscriptionModal.defaultProps.noFrequencyText,
    },
    frequencyList: {
      title: 'Frequency options',
      description: 'Frequency list options',
      type: 'array',
      items: {
        type: 'object',
        properties: {
          label: {
            title: 'Label',
            description: 'Label of frecuency option that will show for users.',
            type: 'string',
          },
          attachmentLabel: {
            title: 'Attachment label',
            description: 'Attachment label for frecuency option. ex: "2 day" or "2 week" or "2 year" ',
            type: 'string',
          }
        },
      },
    },
  },
}

export default SubscriptionModal;

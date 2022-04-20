import React, {useState, useEffect} from "react"

//VTEX Resources
import { useProduct } from 'vtex.product-context'
import { useCssHandles } from 'vtex.css-handles'
import { FormattedMessage } from 'react-intl'
import { useOrderItems } from 'vtex.order-items/OrderItems'
import { useOrderForm } from 'vtex.order-manager/OrderForm'
import { Modal, Button, Spinner } from 'vtex.styleguide'

//Utils
import {
  addToCart,
  addAttachment,
  addRecurrencyPlan
} from '../../utils/functions'

//Local Contexts
import { ModalsContext } from '../../contexts/ModalsContext'

//Style handles
import handles from './style.css'

//CSS Handles
const CSS_HANDLES = [
  "modalSubscription",
  "modal__titleWrapper",
  "modal__title",
  "modal__subtitle",
  "modal__content",
  "frequencyList__wrapper",
  "frequencyList__item",
  "frequencyActive",
  "submitSubscription",
  "submitSubscriptionWrapper",
]

const SubscriptionModal = (props) => {

  //Use Hooks
  const {
    isModalSubscriberOpen ,
    setModalSubscriberOpen,
    setItemPlacedModalOpen
  } = React.useContext(ModalsContext)
  const handles = useCssHandles(CSS_HANDLES)
  const productContextValue = useProduct()
  const { addItems } = useOrderItems()
  const { orderForm } = useOrderForm()

  //Variables Hooks
  const [ isSelectedFrequency , setSelectedFrequency ] = useState(true)
  const [ isLoading, setLoading ] = useState(false)
  const [ cartItems, setCartItems ] = useState(orderForm.items)

  //localVariables
  const itemIndex = Number(cartItems.length)

  //local functions
  const submitFrequency = async () => {
    const frequency = document.querySelector('#frequencyList > li[class*=frequencyActive]').getAttribute("attachment_ref")
    setLoading(true)
    await addToCart(productContextValue, addItems)
    await addAttachment(frequency, orderForm, itemIndex)
    await addRecurrencyPlan(frequency, orderForm, cartItems)
    setLoading(false)
  }

  const clearCheckedStyles = async () => {
    var labels = document.querySelector('#modalSubscriber > ul').children
    for (var lb of labels) {
      lb.classList.remove(handles.frequencyActive)
    }
  }

  const selection = async (event) => {
    event.persist()
    setSelectedFrequency(false)
    await clearCheckedStyles()
    event.target.classList.add(handles.frequencyActive)
  }

  //When orderForm changes
  useEffect(()=>{
    setCartItems(orderForm.items) //set orderForm in the state hook
  },[orderForm])

  return (
    <>
      <Modal
        isOpen={isModalSubscriberOpen}
        onClose={()=>setModalSubscriberOpen(false)}
        responsiveFullScreen
        centered
        title={
          <>
            <h3 className={`${handles.modal__titleWrapper} ${handles.modalSubscription} mt0 mb0 t-heading-3 c-on-base`}>
              <FormattedMessage id="store/subscription-modal.schemaModalTitleSubscriber"/>
            </h3>
            <p className={`${handles.modal__subtitle} t-body lh-copy c-on-base`}>
              <FormattedMessage id="store/subscription-modal.schemaModalSubTitleSubscriber"/>
            </p>
          </>
        }
        children={
          <div id="modalSubscriber" className={`${handles.modal__content} ${handles.modalSubscription}`}>
            {
              !isLoading ? (
                props.frequencyList?.length > 0 ? (
                  <>
                    <ul id="frequencyList" className={handles.frequencyList__wrapper}>
                      {
                        props.frequencyList.map((item, idx) => {
                          return (
                            <>
                              <li
                                key={`f-${idx}`}
                                attachment_ref={item.attachmentLabel}
                                className={`${handles.frequencyList__item} flex items-center`}
                                onClick={(e)=>selection(e)}>
                                  {item.label}
                              </li>
                            </>
                          )
                        })
                      }
                    </ul>
                    <div className={`${handles.submitSubscriptionWrapper} flex items-center justify-end`}>
                      <Button disabled={isSelectedFrequency} onClick={async ()=>{
                        await submitFrequency()
                        setModalSubscriberOpen(false)
                        setItemPlacedModalOpen(true)
                      }}>
                        <FormattedMessage id="store/subscription-modal.submitSubscription"/>
                      </Button>
                    </div>
                  </>
                ) : (
                  <p className={handles.noFrequencyText}>
                    {props.noFrequencyText}
                  </p>
                )
              ) : (
                <div className={`flex items-center justify-center`}>
                  <Spinner className={handles.spinner} color="currentColor" size={30} />
                </div>
              )
            }
          </div>
        }
      >
      </Modal>
    </>
  )
}


export default SubscriptionModal

import React, { useEffect, useContext } from 'react'

//VTEX Resources
import { OrderFormProvider } from 'vtex.order-manager/OrderForm'
import { useCssHandles } from 'vtex.css-handles'
import { ButtonWithIcon, Spinner } from 'vtex.styleguide'
import { FormattedMessage } from 'react-intl'
import { OrderShippingProvider, useOrderShipping } from 'vtex.order-shipping/OrderShipping'

//style handles1
import handles from './App.css'

//Local Contexts
import { Context } from '../contexts/Context'

//local apps
import FranchiseModal from './FranchiseModal/FranchiseModal'

//Icons
import { PinIconApp } from './_Icons'

//CSS Handles
const CSS_HANDLES = [
  "wrapper",
  "spinner",
  "trigger__iconWrapper",
  "trigger__icon",
  "trigger__storeName",
  "trigger__title"
]

const App = (props) => (
  <OrderFormProvider>
    <OrderShippingProvider>
      <AppMain
        modalTitle={props.modalTitle}
        placeholderInputCP={props.placeholderInputCP}
        fakeSku={props.fakeSku}
      />
    </OrderShippingProvider>
  </OrderFormProvider>
)

const AppMain = (props) => {

  const handles = useCssHandles(CSS_HANDLES)
  const { selectDeliveryOption } = useOrderShipping()

  //Context State Hooks
  const {
    isZipLoading,
    setZipLoading,
    triggerText,
    setModalOpen,
    selectedStoreName,
    selectedDeliveryType
  } = useContext(Context)

  const init = async () => {

    //GET SESSION
    await fetch('/api/sessions?items=store.channel,profile.email,checkout.regionId,account.accountName')
    .then(response => response.json())
    .then((data) => {
      const regionId = data?.namespaces?.checkout?.regionId?.value || null
      if(regionId ==  null){
        setModalOpen(true)
      }else{
        setZipLoading(false)
      }
    })
    .catch(err => {
      console.error("ERROR AT GETTING SESSION --> ",err)
    });
  }

  //SET DELIVERY TYPE
  const setDeliveryTypeOrderform = (deliveryType) => {
    selectDeliveryOption(selectedDeliveryType)
  }

  //isDocumentReady?
  useEffect(()=>{
    init()
    setDeliveryTypeOrderform()
  },[])

  return (
    <>
      <div className={handles.wrapper}>
        <ButtonWithIcon icon={PinIconApp} variation="primary" onClick={()=>{setModalOpen(true)}}>
          <span className={`flex flex-column ${handles.trigger__wrapper}`}>
            {
              isZipLoading ?
                <Spinner className={handles.spinner} color="currentColor" size={20} />
              :
                <>
                  <span className={`flex pb2 flex-start ttn f7 ${handles.trigger__title}`}>
                    <FormattedMessage id="store/white-label-selector.buttonTitle"/>
                  </span>
                  <span className={handles.trigger__storeName}>{ selectedStoreName.toString().length > 0 ? selectedStoreName : triggerText }</span>
                </>
              }
          </span>
        </ButtonWithIcon>

      </div>

      <FranchiseModal
        modalTitle={props.modalTitle}
        placeholderInputCP={props.placeholderInputCP}
        fakeSku={props.fakeSku}
      />

    </>
  )
}


export default App

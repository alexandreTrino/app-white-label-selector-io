import React, { useState, useEffect } from 'react'

//VTEX Resources
import { Modal, SelectableCard, InputSearch, Dropdown, Spinner } from 'vtex.styleguide'
import { FormattedMessage } from 'react-intl'
import { useOrderItems } from 'vtex.order-items/OrderItems'
import { useOrderForm, loading } from 'vtex.order-manager/OrderForm'
import { useRuntime } from 'vtex.render-runtime'
import { useFullSession } from 'vtex.session-client'


//Local styles
import handles from '../../components/App.css'

//VTEX Resources
import { useCssHandles } from 'vtex.css-handles'

//Local Contexts
import { Context } from '../../contexts/Context'

//Utils
import {
  clearOrderFormItems,
  filterDelivery,
} from '../../utils/functions.js'

//CSS Handles
const CSS_HANDLES = [
  "franchise",
  "modal__titleWrapper",
  "modal__subtitle",
  "modal__title",
  "modal__content",
  "modal__selectableCards",
  "modal__card",
  "modal__card__iconWrapper",
  "card__iconEmail",
  "modal__card__icon",
  "card__subtitle",
  "subtitle__span",
  "modal__description",
  "input",
  "footer__wrapper",
  "footer__content",
  "footer__iconWrapper",
  "footer__icon",
  "footer__message",
  "modal__response"
]

const FranchiseModal = (props) => {

  //Variables Hooks
  const handles = useCssHandles(CSS_HANDLES)
  const { removeItem } = useOrderItems()
  const { orderForm } = useOrderForm()
  const { culture } = useRuntime()
  const { data } = useFullSession()
  const [ stores, setLoadingStores ] = useState([])

  //Get automatic user zipCode and stores
  useEffect(()=>{
    fetchDataStores()
  },[])

  async function fetchDataStores() {
    if (stores.length === 0)
      await (await fetch('/files/franchises.json'))
        .json()
        .then(res => setLoadingStores(res))
        .catch(err => console.error(err))
  }

  let storeNames = stores
    .map((store) => ({
      label: store.storeName,
      value: JSON.stringify({
        storeName: store.storeName,
        seller: store.seller,
        cp: store.cp,
      }),
    }))
    .filter((obj, pos, arr) => {
      return (
        arr.map((mapObj) => mapObj.label).indexOf(obj.label) === pos
      )
    })

  //Local states
  const [ cardSelected, setCardSelected ] = useState('card1')
  const [ txtResponse, setTxtResponse ] = useState("")

  const {
    isModalOpen,
    setModalOpen,
    isLoading,
    setLoading,
    zip,
    setZip,
    setSelectedStoreCP,
    setSelectedFranchise,
    setSelectedStoreName,
    setSelectedDeliveryType
  } = React.useContext(Context)

  //USER IS NOT ALLOWED CLOSE THE MODAL BEFORE CHOOSE A STORE
  const checkCloseModal = () => {
    if(!window.localStorage.getItem("selectedStoreName")?.length){
      setModalOpen(true)
    }else{
      setModalOpen(false)
    }
  }

  const setLocalStorage = (store, code, deliveryType, cp) => {
    setSelectedStoreCP(cp)
    setSelectedFranchise(code)
    setSelectedStoreName(store)
    setSelectedDeliveryType(deliveryType)
  }

  //FIND THE BEST WHITELABEL SELLER OPTION FOR THIS ZIPCODE
  const orderFormSimulation = async (postalCode) => {
    try{
      return await fetch('/api/checkout/pub/orderforms/simulation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(
          {
            "items":[{
              "id": props.fakeSku, //id test sku with infinite inventory
              "quantity":"11",
              "seller":"1"
            }],
            "country": culture.country,
            "postalCode": postalCode //use: postalCode
          }
        )
      })
      .then(res => res.json())
      .then(async (response) => {

        //log simulation
        console.log("RESPONSE SIMULATION --> ", response)

        //variable of the best delivery option SLA
        const slaResult = await filterDelivery(response.logisticsInfo[0].slas)

        console.log("slaResult --> ",slaResult)

        if(slaResult !== null){

          //clear txtResponse
          setTxtResponse("")

          // Set on Local Storage the selected franchise option
          setLocalStorage(slaResult.storeName, slaResult.storeCode, slaResult.deliveryType, zip)

          //LOG DeliveryType of selected SLA
          console.log("slaResult.deliveryType --> ", slaResult.deliveryType)

          //Set the new franchise catalog on the client session and reload
          await changeFranchise(slaResult.storeCode, zip)

        }else{

          setTxtResponse("The store does not deliver to the region of this zip code. Try another zip code or choose a store franchise manually to manually pick up the order.")

          //hide content loading and show the modal content again
          setLoading(false)

        }

      })
      .catch(error => {

        //log of error at get order simulaation
        console.log("ERROR TO GET BEST SELLER --> ", error)

        //hide content loading and show the modal content again
        setLoading(false)

      })

    }catch(e){
      console.log("Simulation Error --> ", e)
      setLoading(false)
      setTxtResponse("No encontramos una tienda cercaba a este código postal. Sugerimos insertar un código postal de la región o elegir manualmente una TIENDA para recoger tu pedido.")
    }
  }

  //CHANGE WHITE LABEL ON CLIENT SESSION
  const changeFranchise = async (franchise, zipCode) => {

    console.log("_______zipCode --> ", zipCode)

    //Remove all items from cart
    await clearOrderFormItems(orderForm, loading, removeItem)

    const tradePolicy = {
      public: {
        country: {
          value: 'MEX'
        },
        regionId: {
          value: btoa(`SW#${data?.session.namespaces.account.accountName.value}${franchise.replace("S","")}`),
        },
        postalCode: {
          value: `${zipCode}`,
        },
      },
    }
    fetch('/api/sessions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(tradePolicy)
    })
    .then(res => res.json())
    .then(data => {

      console.log("SUCCESSFULLY CHANGING FRANCHISE --> ",data)

      //make sure the new data session are being used
      window.location.reload()

    })
    .catch(error => {

      //hide content loading
      setLoading(false)
      console.log(error)

    })

  }

  return (
    <Modal
      isOpen={isModalOpen}
      onClose={()=>{checkCloseModal()}}
      responsiveFullScreen
      centered
      title={
        <>
          <div className={handles.modal__titleWrapper}>
            <h3 className={`${handles.modal__title} ${handles.franchise} mt0 mb0 t-heading-3 c-on-base`}>
              <FormattedMessage id="store/white-label-selector.titleFranchiseModal"/>
            </h3>
            <p className={`${handles.modal__subtitle} t-body lh-copy c-on-base`}>
              <FormattedMessage id="store/white-label-selector.subTitleFranchiseModal"/>
            </p>
          </div>
        </>
      }
      children={
        <>
          {isLoading ? (
            <div className={`pa6 flex justify-center ${handles.spinner}`}>
              <Spinner />
            </div>
          ) : (
            <div className={`pa5 ${handles.modal__content}`}>
              <div className={`pb7 flex justify-center ${handles.modal__selectableCards}`}>

                <SelectableCard
                  hasGroupRigth
                  noPadding
                  selected={cardSelected == 'card1'}
                  onClick={() => setCardSelected('card1')}>
                  <div className={`pa5 flex items-center-xl ${handles.modal__card}`}>
                    <span className={`pr3 ${handles.modal__card__iconWrapper} ${handles.card__iconEmail}`}>
                      <svg className={`${handles.emailIcon} ${handles.modal__card__icon}`} width="22" fill="currentColor" viewBox="0 0 27 21"><path transform="" d="M24.1935484,4.1509434 C24.1935484,2.3170566 22.7491935,0.830188679 20.9677419,0.830188679 C19.1862903,0.830188679 17.7419355,2.3170566 17.7419355,4.1509434 L17.7419355,14.1132075 L24.1935484,14.1132075 L24.1935484,4.1509434 Z M16.9354839,4.1509434 C16.9354839,2.84464151 17.5330645,1.61430189 18.5483871,0.830188679 L4.03225806,0.830188679 C2.25080645,0.830188679 0.806451613,2.3170566 0.806451613,4.1509434 L0.806451613,14.1132075 L16.9354839,14.1132075 L16.9354839,4.1509434 Z M25,4.1509434 L25,14.9433962 L11.2903226,14.9433962 L11.2903226,22 L10.483871,22 L10.483871,14.9433962 L0,14.9433962 L0,4.1509434 C0,1.85837736 1.80524194,0 4.03225806,0 L20.9677419,0 C23.1943548,0 25,1.85837736 25,4.1509434 L25,4.1509434 Z M8.06451613,9.13207547 L10.483871,9.13207547 L10.483871,5.81132075 L8.06451613,5.81132075 L8.06451613,9.13207547 Z M10.8870968,4.98113208 L14.1129032,4.98113208 L14.1129032,5.81132075 L11.2903226,5.81132075 L11.2903226,9.96226415 L7.25806452,9.96226415 L7.25806452,4.98113208 L10.8870968,4.98113208 Z M19.7580645,11.6226415 L22.1774194,11.6226415 L22.1774194,10.7924528 L19.7580645,10.7924528 L19.7580645,11.6226415 Z"></path></svg>
                    </span>
                    <span className={handles.card__subtitle}>
                      <FormattedMessage id="store/white-label-selector.titleCard1"/> <br />
                      <b class={`db f7 ${handles.subtitle__span}`}>
                        <FormattedMessage id="store/white-label-selector.subtitleCard1"/>
                      </b>
                    </span>
                  </div>
                </SelectableCard>

                <SelectableCard
                  hasGroupRigth
                  noPadding
                  selected={cardSelected == 'card2'}
                  onClick={() => setCardSelected('card2')}>
                  <div className={`pa5 flex items-center-xl ${handles.modal__card}`}>
                    <span className={`pr3 ${handles.modal__card__iconWrapper} ${handles.card__iconPickup}`}>
                      <svg className={`${handles.iconPickupCard} ${handles.modal__card__icon}`} viewBox="0 0 64 64" width="22" fill="currentColor"><path stroke-width="2" stroke-miterlimit="10" stroke="currentColor" fill="none" d="M32 62c0-17.1 16.3-25.2 17.8-39.7A18 18 0 1 0 14 20a18.1 18.1 0 0 0 .2 2.2C15.7 36.8 32 44.9 32 62z" data-name="layer2" stroke-linejoin="round" stroke-linecap="round"></path><circle stroke-width="2" stroke-miterlimit="10" stroke="currentColor" fill="none" r="6" cy="20" cx="32" data-name="layer1" stroke-linejoin="round" stroke-linecap="round"></circle></svg>
                    </span>
                    <span className={handles.card__subtitle}>
                      <FormattedMessage id="store/white-label-selector.titleCard2"/> <br />
                      <b class={`db f7 ${handles.subtitle__span}`}>
                        <FormattedMessage id="store/white-label-selector.subtitleCard2"/>
                      </b>
                    </span>
                  </div>
                </SelectableCard>

              </div>

              {cardSelected === "card1" ? (

                <div className={`${handles.modalContent} flex flex-column items-center`}>
                  <span className={`db pb6 ${handles.modal__description}`}>Buscaremos la tienda más <b className={`${handles.highlightSpan}`}> cercana y económica</b>.</span>
                  <div className={`pb5 ${handles.formWrapper}`}>
                    <InputSearch
                      placeholder={props.placeholderInputCP}
                      className={`${handles.input}`}
                      value={zip}
                      size="large"
                      maxLength={5}
                      onClear={() => {
                        setZip('')
                      }}
                      onChange={e =>{setZip(e.target.value.replace(/\D/g, ""))}}
                      onSubmit={(e)=>{
                        e.preventDefault()
                        setLoading(true)
                        orderFormSimulation(zip)
                      }}
                    />
                  </div>
                  {txtResponse.length>0 && (
                    <div className={`${handles.modal__response} pa4 f7-xl tc-xl`}>
                      {txtResponse}
                    </div>
                  )}
                </div>

              ) : (

                <div className={`${handles.modalContent} flex flex-column items-center`}>
                  <span className={`db pb6 ${handles.modal__description}`}>Elige la tienda más cercana a ti para ver su catalogo.</span>
                  <div className={`pb5 ${handles.formWrapper}`}>
                    {<Dropdown
                      placeholder="Elegir sucursal"
                      size="large"
                      value=""
                      options={storeNames}
                      onChange={(e) => {
                        const val = JSON.parse(e.target.value)
                        setSelectedStoreName(val.storeName)
                        setSelectedStoreCP(val.cp)
                        setSelectedDeliveryType("pickup-in-point")
                        setLoading(true)
                        changeFranchise(`${val.seller.split("calimaxmx")[1]}`, zip)
                      }}
                    />}
                  </div>
                </div>

              )}

            </div>
          )}
        </>
      }
      bottomBar={
        <div className={handles.footer__wrapper}>
          <div className={`flex items-center ${handles.footer__content}`}>
            <div className={`pr3 flex items-center ${handles.footer__iconWrapper}`}>
              <svg className={handles.footer__icon} width="22" fill="currentColor" viewBox="0 0 13 13" id="icon-alert"><path transform="" d="M5.84 7.14a.116.116 0 0 1-.085-.035.116.116 0 0 1-.035-.085l-.11-4.4c0-.033.012-.062.035-.085A.116.116 0 0 1 5.73 2.5h.92c.033 0 .062.012.085.035a.116.116 0 0 1 .035.085l-.11 4.4a.116.116 0 0 1-.035.085.116.116 0 0 1-.085.035h-.7zm.29 2.34a.674.674 0 0 1-.7-.71c0-.207.065-.375.195-.505a.683.683 0 0 1 .505-.195.674.674 0 0 1 .71.7.69.69 0 0 1-.2.51.69.69 0 0 1-.51.2zM6 12A6 6 0 1 1 6 0a6 6 0 0 1 0 12zm0-1A5 5 0 1 0 6 1a5 5 0 0 0 0 10z"></path></svg>
            </div>
            <span className={handles.footer__message}>
            <FormattedMessage id="store/white-label-selector.footerMessage"/>
            </span>
          </div>
        </div>
      }
    />
  )
}

export default FranchiseModal

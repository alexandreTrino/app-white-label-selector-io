import React, { useState, useEffect } from "react"

//VTEX resources
import { useCssHandles } from 'vtex.css-handles'
import { FormattedMessage } from 'react-intl'
import { useProduct } from 'vtex.product-context'
import { useOrderItems } from 'vtex.order-items/OrderItems'
import { useOrderForm } from 'vtex.order-manager/OrderForm'
import {
  Button,
  Spinner,
  Modal
} from 'vtex.styleguide'

//Local handles
import handles from './style.css'

const CSS_HANDLES = [
  "frequencyListWrapper",
  "frequencyItem",
  "frequencyActive",
  "submitSubscription",
  "submitSubscriptionWrapper",
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

const SubscriptionModalChildren = (props) => {

  const handles = useCssHandles(CSS_HANDLES)
  const productContextValue = useProduct()
  const { addItems } = useOrderItems()
  const { orderForm } = useOrderForm()

  //native states
  const [isSelectedFrequency, setSelectedOption] = useState(true)
  const [isLoading , setLoading] = useState(false)
  const [cartItems, setCartItems] = useState(orderForm.items)
  const [isOpenModalItemPlaced, setOpenModalItemPlaced] = useState(false)

  //console.log("ITEMS_LIST --> ", props.frequencyList)

  const selection = async (event) => {
    //console.log("EVENT --> ", event)
    event.persist()
    setSelectedOption(false)
    await clearCheckedStyles()
    event.target.classList.add(handles.frequencyActive)
  }

  const clearCheckedStyles = async () => {
    var labels = document.querySelector('#modalSubscriber > ul').children
    for (var lb of labels) {
      lb.classList.remove(handles.frequencyActive)
    }
  }

  const submitFrequency = async () => {

    const frequency = document.querySelector('#frequencyList > li[class*=frequencyActive]').getAttribute("attachment_ref")

    setLoading(true)
    await addToCart()
    // setTimeout(()=>{addAttachment(frequency)},1000)
    await addAttachment(frequency)
    await addRecurrencyPlan(frequency)
    setLoading(false)
  }

  const addToCart = async () => {
    const item = [
      {
        aditionalInfo: {
          brandName: productContextValue.product.brand,
          __typename: 'ItemAdditionalIndo',
        },
        availability: productContextValue.selectedItem.sellers[0].commertialOffer.AvailableQuantity > 0 ? true : false,
        id: productContextValue.selectedItem.itemId,
        imageUrls: {
          at1x: productContextValue.selectedItem.images[0].imageUrl,
          __typename: 'ImageUrls',
        },
        listPrice: productContextValue.selectedItem.sellers[0].commertialOffer.ListPrice,
        measurementUnit: productContextValue.selectedItem.measurementUnit,
        name: productContextValue.selectedItem.name,
        price: productContextValue.selectedItem.sellers[0].commertialOffer.Price,
        productId: productContextValue.product.productId,
        quantity: productContextValue.selectedQuantity,
        seller: productContextValue.selectedItem.sellers[0].sellerId,
        sellingPrice: productContextValue.selectedItem.sellers[0].commertialOffer.PriceWithoutDiscount,
        skuName: productContextValue.selectedItem.name,
        unitMultiplier: productContextValue.selectedItem.unitMultiplier,
        uniqueId: productContextValue.selectedItem.itemId,
        isGift: false,
        __typename: 'Item'
      }
    ]
    await addItems(item)
  }

  const formatDate = (date) => {
    var
        day  = date.getDate().toString(),
        dayF = (day.length == 1) ? '0'+day : day,
        month  = (date.getMonth()+1).toString(),
        monthF = (month.length == 1) ? '0'+month : month,
        yearF = date.getFullYear();

      return yearF+"-"+monthF+"-"+dayF;
  }

  const frequencyDate = {
    initDate: ()=>{
      return formatDate(new Date())
    },
    endDate: ()=>{
      let endDate = new Date();
      endDate.setDate(endDate.getDate()+1095);
      console.log("endDate --> ",endDate)
      return endDate // + 8 years from current day
      /*
        There is no specific end of recurrency, so the end is after 8 years.
        ADD MORE LOGIC HERE BY PRODUCT FIELD IF THERE AN SPECIFIC END OF RECURRENCY
      */

    }
  }

  const addAttachment = async (frequency) => {
    const itemIndex = Number(cartItems.length)
    const content = {
      "content": {
        "vtex.subscription.frequency": frequency
      }
    }
    fetch(`/api/checkout/pub/orderForm/${orderForm.id}/items/${itemIndex}/attachments/vtex.subscription.recurrency`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(content)
    })
      .then(res => res.json())
      .then(data => {
        console.log("SEND ATTACHMENT SUCCESSFULLY! -> ", data)
        // --> ", JSON.stringify(cartItems))
      })
      .catch(error => {
        console.log("ERROR TO SENDING ATTACHMENT -> ",error)
      })
  }

  const addRecurrencyPlan = async (frequency) => {
    var fields = {
      "subscriptions":[
        {
        "itemIndex": cartItems.length,
        "plan": {
            "frequency": {
              "interval": frequency.split(' ')[0],
              "periodicity": (frequency.split(' ')[1]).toString().toUpperCase()
            },
            "validity":{
              "begin": frequencyDate.initDate(),
              "end": frequencyDate.endDate()
            },
            "type":"RECURRING_PAYMENT"
            }
        }
      ],
      "expectedOrderFormSections":["items","totalizers","clientProfileData","shippingData","paymentData","sellers","messages","marketingData","clientPreferencesData","storePreferencesData","giftRegistryData","ratesAndBenefitsData","openTextField","commercialConditionData","customData"]
    }

    fetch('/api/checkout/pub/orderForm/'+orderForm.id+'/attachments/subscriptionData', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(fields)
    })
      .then(res => res.json())
      .then(data => {
        console.log("SENT FREQUENCY ATTACHMENT SUCCESSFULLY! -> ", data)
        setLoading(false)
        setOpenModalItemPlaced(true) //open item placed modal
      })
      .catch(error => {
        console.log("ERROR TO SENDING ATTACHMENT -> ",error)
      })
  }

  useEffect(()=>{
    setCartItems(orderForm.items)
  },[orderForm])

  return (

    <>
      {
        !isLoading ? (
          props.frequencyList?.length > 0 ? (
            <>
              <ul id="frequencyList" className={handles.frequencyListWrapper}>
                {
                  props.frequencyList.map((item, idx) => {
                    return (
                      <>
                        <li
                          key={`f-${idx}`}
                          attachment_ref={item.attachmentLabel}
                          className={`${handles.frequencyItem} flex items-center`}
                          onClick={(e)=>selection(e)}>
                            {item.label}
                        </li>
                      </>
                    )
                  })
                }
              </ul>
              <div className={`${handles.submitSubscriptionWrapper} flex items-center justify-end`}>
                <Button disabled={isSelectedFrequency} onClick={()=>{submitFrequency()}}>
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
              onClick={
                ()=>{
                  setOpenModalItemPlaced(false)
                  props.setOpenModalSubscriber(false)
                }
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
        isOpen={isOpenModalItemPlaced}
        onClose={
          ()=>{
            setOpenModalItemPlaced(false)
            props.setOpenModalSubscriber(false)
          }
        }
      >
      </Modal>

    </>
  )

}


export default SubscriptionModalChildren;

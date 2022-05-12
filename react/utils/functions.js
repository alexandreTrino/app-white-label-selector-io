import { useState } from 'react'

//LOCAL STORAGE HOOK
export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      return initialValue
    }
  })
  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      window.localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch (error) {
      console.log(error)
    }
  }
  return [storedValue, setValue]
}

//CLEAR ORDERFORM ITEMS
export const clearOrderFormItems = async (orderForm, loading, removeItem) => {
  let items = !loading && orderForm ? orderForm.items : "undefined"
  if(typeof items != "undefined"){
    if (!items.length) return
    items.forEach(async (element) => {
      await removeItem(element)
    })
    console.log("___OK_____")
  }
}

export const filterDelivery = async (json) => {

  //find the best seller option
  const slaResult = json.find((sla) => sla.deliveryChannel === "delivery")

  console.log("slaResult --> ",slaResult)

  if(slaResult == undefined || slaResult == "undefined"){
    return null
  }else{
    const objResult = {
      storeCode: slaResult.deliveryIds[0].warehouseId,
      storeName: slaResult.deliveryIds[0].courierName,
      deliveryType: slaResult.deliveryChannel,
      selectedSla: (slaResult.deliveryIds[0].warehouseId).replace("S","")
    }
    return objResult
  }

}

//SET LOGISTIC INFO AND ADDRESS ON ORDERFORM
export const setOrderForm = (orderForm, postalCode, runTime, selectedDeliveryType) => {

  console.log("____orderForm____", JSON.stringify(orderForm))
  // console.log("____postalCode____", JSON.stringify(postalCode))
  // console.log("____runTime____", JSON.stringify(runTime))
  console.log("____selectedDeliveryType____", selectedDeliveryType)

  //Set body request
  var bodyShipping = {
    "clearAddressIfPostalCodeNotFound":false,
    "selectedAddresses":
      [{
        "country": runTime.country,
        "postalCode": postalCode,
      }],
      "logisticsInfo":[
      {
        "selectedDeliveryChannel": selectedDeliveryType
      }
    ]
  }

  fetch(`${window.location.origin}/api/checkout/pub/orderForm/${orderForm.id}/attachments/shippingData`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(bodyShipping)
  })
  .then(res => res.json())
  .then(data => {
    console.log("____SUCCESSFULLY TO SET ORDERFORM ATTACHMENTS____",data)
  })
  .catch(error => {
    console.log("____ERROR TO SET ORDERFORM ATTACHMENTS____",data)
  })

}

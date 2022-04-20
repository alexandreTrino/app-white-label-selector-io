export const calcDiscount = (priceItem, discount) => {
  return priceItem - priceItem * (discount / 100)
}

export const addAttachment = async (frequency, orderForm, itemIndex) => {
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
      console.log("SENT ATTACHMENT SUCCESSFULLY! -> ", data)
    })
    .catch(error => {
      console.log("ERROR TO SENDING ATTACHMENT -> ",error)
    })
}

export const addRecurrencyPlan = async (frequency, orderForm, cartItems) => {
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
    })
    .catch(error => {
      console.log("ERROR TO SENDING ATTACHMENT -> ",error)
    })
}

export const addToCart = async (productContextValue, addToCart) => {
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
  await addToCart(item)
}

export const formatDate = (date) => {
  var
      day  = date.getDate().toString(),
      dayF = (day.length == 1) ? '0'+day : day,
      month  = (date.getMonth()+1).toString(),
      monthF = (month.length == 1) ? '0'+month : month,
      yearF = date.getFullYear();

    return yearF+"-"+monthF+"-"+dayF;
}

export const frequencyDate = {
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

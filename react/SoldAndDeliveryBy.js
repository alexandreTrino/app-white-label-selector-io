import React from "react"
import { useProduct } from 'vtex.product-context'
import { useCssHandles } from 'vtex.css-handles'

const CSS_HANDLES = [
  "wrapper",
  "paragraph",
  "icon",
  "highlight"
]

const SoldAndDeliveryBy = () => {

  const handles = useCssHandles(CSS_HANDLES)
  const productContextValue = useProduct()

  console.log("productContextValue --> ", productContextValue)

  return (
    <>
      <div className={`${handles.wrapper}`}>

        <p className={`${handles.paragraph} flex`}>
          <span className={`${handles.icon}`}></span>
          Vendido e entregue por: <span className={`${handles.highlight}`}>{productContextValue?.selectedItem?.sellers[0].sellerName}</span>
        </p>

      </div>

    </>
  )

}

export default SoldAndDeliveryBy;

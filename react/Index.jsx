import React from "react"

//VTEX Resources
import { canUseDOM } from 'vtex.render-runtime'
import { useCssHandles } from 'vtex.css-handles'
import { Spinner } from 'vtex.styleguide'

//local contexts
import ContextProvider from './contexts/Context'

//local apps
import App from './components/App'

const Index = (props) => {

  //Local CSS Handles
  const handles = useCssHandles(["wrapper,spinner"])

  return (
    canUseDOM ? (
      <ContextProvider>
        <App
          modalTitle={props.modalTitle}
          placeholderInputCP={props.placeholderInputCP}
          fakeSku={props.fakeSku}
        />
      </ContextProvider>
    ) : (
      <div className={`${handles.wrapper}`}>
        <Spinner className={handles.spinner} color="currentColor" size={20} />
      </div>
    )
  )
}

Index.defaultProps = {
  modalTitle: "Buscar Tienda",
  placeholderInputCP: "Ingresa tu código postal",
  fakeSku: 3575
}

Index.schema = {
  title: 'White Label Selector',
  description: 'Select a franchise catalog',
  type: 'object',
  properties: {
    fakeSKU: {
      title: 'Fake SKU',
      description: 'ID of fake SKU with infinity inventory to complete a orderForm simulation.',
      type: 'number',
      default: Index.defaultProps.fakeSku,
    },
    placeholderInputCP:{
      title: 'placeholder postal-code input',
      description: '',
      type: 'string',
      default: Index.defaultProps.placeholderInputCP
    }
  },
}

export default Index

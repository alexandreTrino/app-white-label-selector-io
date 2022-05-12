import React, { useState, createContext } from 'react'

export const Context = createContext({})

//Utils
import {
  useLocalStorage
} from '../utils/functions.js'

export default function ContextProvider(props){

  const [ isZipLoading, setZipLoading ] = useState(true)
  const [ triggerText , setTiggerText] = useState("Elegir sucursal")
  const [ selectedStoreCP, setSelectedStoreCP ] = useLocalStorage('selectedCP', '')
  const [ selectedFranchise, setSelectedFranchise ] = useLocalStorage('selectedFranchise', '')
  const [ selectedStoreName, setSelectedStoreName ] = useLocalStorage('selectedStoreName', '')
  const [ selectedDeliveryType, setSelectedDeliveryType ] = useLocalStorage('selectedDeliveryType', '')
  const [ isModalOpen, setModalOpen ] = useState(false)
  const [ isLoading, setLoading ] = useState(false)
  const [ zip, setZip ] = useState("")

  return(
      <Context.Provider value=
        {{
          zip,
          setZip,
          isZipLoading,
          setZipLoading,
          triggerText,
          setTiggerText,
          selectedStoreCP,
          setSelectedStoreCP,
          selectedFranchise,
          setSelectedFranchise,
          selectedStoreName,
          setSelectedStoreName,
          selectedDeliveryType,
          setSelectedDeliveryType,
          isModalOpen,
          setModalOpen,
          isLoading,
          setLoading
        }}
      >
        {props.children}
      </Context.Provider>
  )
}

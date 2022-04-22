import React, { useState } from 'react'

export const ModalsContext = React.createContext({})

export default function ModalsProvider(props){

  const [ isModalSubscriberOpen, setModalSubscriberOpen ] = useState(false)
  const [ isItemPlacedModalOpen, setItemPlacedModalOpen ] = useState(false)

  return(
      <ModalsContext.Provider value=
        {{
          isModalSubscriberOpen,
          setModalSubscriberOpen,
          isItemPlacedModalOpen,
          setItemPlacedModalOpen
        }}
      >
        {props.children}
      </ModalsContext.Provider>
  )
}

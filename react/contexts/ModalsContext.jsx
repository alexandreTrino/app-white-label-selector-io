import React, {useState} from 'react'

export const ModalsContext = React.createContext({})

export default function ModalsProvider(props){

  const [ isModalHelperOpen, setModalHelperOpen ] = useState(false)
  const [ isModalSubscriberOpen , setModalSubscriberOpen ] = useState(false)
  const [ isItemPlacedModalOpen, setItemPlacedModalOpen] = useState(false)

  return(
      <ModalsContext.Provider value=
        {{
          isModalHelperOpen,
          setModalHelperOpen,
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

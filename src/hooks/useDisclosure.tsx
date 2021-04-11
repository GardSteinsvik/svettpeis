import React from 'react'

const useDisclosure = (defaultOpen=false) => {
    const [isOpen, setOpen] = React.useState(defaultOpen)
    const onOpen = React.useCallback(() => setOpen(true), [])
    const onClose = React.useCallback(() => setOpen(false), [])
    const onToggle = React.useCallback(
        () => setOpen(prev => !prev),
        []
    ); return { isOpen, onOpen, onClose, onToggle }
}

export default useDisclosure
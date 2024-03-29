import { chatConvoSelector, chatRoomSelector, updateChatRoomStatus } from "@components/chat/reducers/slice"
import { ReduxState, useAppSelector } from "@reducers"
import { createSelector, EntityId } from "@reduxjs/toolkit"
import useFuncWithTimeout from "hooks/counter/function-with-timeout"
import { useRouter } from "next/router"
import { useEffect, useMemo, useRef } from "react"
import { useDispatch } from "react-redux"
import createConvoIdSelector from "./createConvoIdSelector"

const useViewportLatestConvo = (editorLoaded:boolean) => {
    const
        {query} = useRouter(),
        roomID = query.roomid as string,
        latestConvoID = useRef<EntityId>(),
        chatWindowMeasurement = useRef({w:0,h:0,t:0,b:0}),
        chatWindow = useRef<HTMLElement>(),
        chatContainerMeasurement = useRef({h:0}),
        chatContainer = useRef<HTMLElement>(),
        dispatch = useDispatch(),
        convoIDselector = useMemo(()=>createConvoIdSelector(roomID),[roomID]),
        convoIDs = useAppSelector(state => convoIDselector(state)),
        roomObserving = useRef<string>(),
        onScroll = () => {
            if (chatContainerMeasurement.current.h <= chatWindowMeasurement.current.h) return

            let arr:{occupancy:number;bottom:number;id:EntityId}[] = []

            for (let convoID of convoIDs){
                const elem = document.getElementById(`${convoID}`)
                if (!elem) continue
                const {top,bottom,height} = elem.getBoundingClientRect()
                if (top <= chatWindowMeasurement.current.t && bottom >= chatWindowMeasurement.current.b) {
                    latestConvoID.current = convoID
                    return
                } else if (top < chatWindowMeasurement.current.b && bottom > chatWindowMeasurement.current.t){
                    arr.push({
                        id:convoID,
                        bottom,
                        occupancy: top >= chatWindowMeasurement.current.t && bottom <= chatWindowMeasurement.current.b ? 1 
                            : top <= chatWindowMeasurement.current.t ? (bottom - chatWindowMeasurement.current.t) / height
                                : (chatWindowMeasurement.current.b - top) / height
                    })
                }
            }
            if (!arr.length) return
            const filteredArr = arr.filter(e=>e.occupancy > 0.5)
            if (!!filteredArr.length) latestConvoID.current = filteredArr.reduce((a,b)=>!!a && !!b ? a.bottom > b.bottom ? a : b : a || b).id
            else latestConvoID.current = filteredArr.reduce((a,b)=>!!a && !!b ? a.occupancy > b.occupancy ? a : b : a || b).id
        },
        [runOnScroll] = useFuncWithTimeout(onScroll,100),
        onResize = () => {
            const {width,height,bottom,top} = chatWindow.current.getBoundingClientRect()
            if (
                chatWindowMeasurement.current.w !== width 
                || chatWindowMeasurement.current.h !== height
                || chatWindowMeasurement.current.b !== bottom
            ){
                chatWindowMeasurement.current = {w:width,h:height,b:bottom,t:top}

                if (!!latestConvoID.current) {
                    const {bottom} = document.getElementById(`${latestConvoID.current}`).getBoundingClientRect()
                    chatWindow.current.scrollBy({top: - chatWindow.current.getBoundingClientRect().bottom + bottom,behavior:'auto'})
                } else chatContainer.current.scrollIntoView({block:'end',behavior:'auto'})
            }
        },
        [runOnResize] = useFuncWithTimeout(onResize,100)

    useEffect(()=>{
        chatWindow.current = document.getElementById('convo-window')
        chatContainer.current = document.getElementById('chat-content')
    },[])

    useEffect(()=>{
        if (editorLoaded){
            onResize()
            window.addEventListener('resize',runOnResize,{passive:true})
        }
        return () => window.removeEventListener('resize',runOnResize)
    },[editorLoaded])

    useEffect(()=>{
        if (editorLoaded && !!roomID){
            chatContainerMeasurement.current = {h:chatContainer.current.getBoundingClientRect().height}
            if (roomID !== roomObserving.current){
                latestConvoID.current = undefined
                roomObserving.current = roomID
            }
            chatWindow.current.addEventListener('scroll',runOnScroll,{passive:true})
        } 
        return () => {
            chatWindow.current.removeEventListener('scroll',runOnScroll)
        }
    },[editorLoaded,roomID,convoIDs])

    useEffect(()=>{
        return () => {
            if (!!roomID) dispatch(updateChatRoomStatus({id:roomID,changes:{viewportLatestConvoID:latestConvoID.current}}))
        }
    },[roomID])
}

export default useViewportLatestConvo
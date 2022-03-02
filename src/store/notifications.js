import { writable, derived } from "svelte/store"

const timeout=1500

function createNotificationStore () {
    const _notifications = writable([])
    
    function send (message) {
        _notifications.update(state => {
            return [...state, { id: id(), message, timeout }]
        })
    }
    function reset(){
        _notifications.update(state=>[])
    }
    function remove(index){
        _notifications.update(state=>{
            state.splice(index,1)
            return state
        })
    }

    const notifications = derived(_notifications, ($_notifications, set) => {
        set($_notifications)
        if ($_notifications.length > 0) {
            const timer = setTimeout(() => {
                _notifications.update(state => {
                    state.shift()
                    return state
                })
            }, $_notifications[0].timeout)
            return () => {
                clearTimeout(timer)
            }
        }
    })
    const { subscribe } = notifications

    return {
        subscribe,
        send,
        reset,
        remove,
    }
}

function id() {
    return '_' + Math.random().toString(36).substring(2,9);
};

export const notifications = createNotificationStore()

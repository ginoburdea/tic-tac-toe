import store from '@/store'
import { set } from '@/store/loadingSlice'
import { httpsCallable } from 'firebase/functions'

export default function buildCloudFunction(functions, functionName) {
    return async (...args) => {
        const timer = setTimeout(() => {
            store.dispatch(set(true))
        }, 500)

        const res = await httpsCallable(
            functions,
            functionName
        )(...args).finally(() => {
            store.dispatch(set(false))
            clearTimeout(timer)
        })

        return res
    }
}

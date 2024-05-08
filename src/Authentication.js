import './App.css'
import { AuthenticatedTemplate,UnauthenticatedTemplate,useMsal,MsalProvider } from '@azure/msal-react'
import { loginRequest } from './authConfig'
const wrappedView=()=>{
    const {instance}=useMsal()
    const activeAccount=instance.getActiveAccount()
    const handleRedirect=()=>{
        instance.loginRedirect({
            ...loginRequest,
            prompt:'create'
        })
        .catch((error)=>console.log(error))
    }
return(
    <div className='App'>
        <AuthenticatedTemplate>
            {activeAccount?(
                <p>Authenticated Successfully</p>
            ):null}
        </AuthenticatedTemplate>
        <UnauthenticatedTemplate>
            <button onClick={handleRedirect}>
                SignUp
            </button>
        </UnauthenticatedTemplate>
    </div>
)
}
const App=({instance})=>{
    return(
        <MsalProvider instance={instance}>
            <wrappedView />
        </MsalProvider>
    )
}
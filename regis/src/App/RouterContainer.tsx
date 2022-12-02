import { cloneElement } from "react"

export const RouterContainer = (props:any)=>{
    return(
        <div>
            {cloneElement(props.children)}
        </div>
    )
}
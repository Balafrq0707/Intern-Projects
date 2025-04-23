import react from 'react'

export function App(){


    const handleSubmit =async(e)=>{
        const res = await fetch("   ", {
            method: 'POST', 
            headers: {
                'content-type':' application/json'
            }, 
            body: Json.stringify(newInfo)
        })
    }
}
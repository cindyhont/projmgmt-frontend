import React, { useEffect } from "react";
import { GetServerSideProps } from 'next'

export const getServerSideProps: GetServerSideProps = async () => {
    let 
        // result:any = null, 
        link = process.env.SSR_API_URL.substring(0);
    // try {
    //     const 
    //         response = await fetch(`${link}/`, {
    //             method: 'GET',
    //             headers: { 
    //                 'Content-Type': 'application/json',
    //             },
    //         })
    //         result = await response.json()
    // } catch (error) {
    //     return {props:{
    //         result,
    //         link
    //     }}
    // }

    return {props:{
        // result,
        link
    }}
}

const Testpage = (
    {
        // result,
        link
    }:{
        // result:any;
        link:string;
    }
) => {
    // useEffect(()=>console.log('result:',result),[result])
    useEffect(()=>console.log('link:',link),[link])

    return (
        <>
        <pre>{link}</pre>
        </>
    )
}

export default Testpage
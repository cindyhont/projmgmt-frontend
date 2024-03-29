import React, { useEffect } from 'react';
import { GetServerSideProps } from 'next'

export const getServerSideProps: GetServerSideProps = async () => {
    // let links:any = null
    let resultA:any = null
    try {
        /*
        const 
            testLink = (url:string) => new Promise<any>(resolve=>{
                fetch(url,{
                    headers: { 
                        'Content-Type': 'application/json',
                    },
                })
                .then(res=>{
                    res.json()
                })
                .then(r=>resolve(r))
                .catch(e=>resolve(e))
            })
        links = await Promise.all([
            testLink(process.env.NEXT_PUBLIC_SSR_API_URL_A),
            testLink(process.env.NEXT_PUBLIC_SSR_API_URL_B),
        ])
        */

        const responseA = await fetch(process.env.NEXT_PUBLIC_SSR_API_URL, {
            headers: { 
                'Content-Type': 'application/json',
            },
        })
        resultA = await responseA.json()
    } catch {}

    return {
        props:{
            apiA:process.env.NEXT_PUBLIC_SSR_API_URL,
            // links,
            resultA,
        }
    }
}

const TestPage = ({apiA,resultA,}:{apiA:string;resultA:any;}) => {
    useEffect(()=>{
        console.log(apiA)
        console.log(resultA)
    },[])
    return <></>
}

export default TestPage
import Axios from 'axios'
import React, {useEffect, useState} from 'react'

function Subscribe(props) {

    const userTo = props.userTo
    const userFrom = props.userFrom
    
    const [SubscribeNumber, setSubscribeNumber] = useState(0);
    const [Subscribed, setSubscribed] = useState(false);

    useEffect(() => {
 

        const subscribeNumberVariables = { userTo: userTo, userFrom: userFrom }
        Axios.post('/api/subscribe/subscribeNumber', subscribeNumberVariables)
            .then(response => {
                if(response.data.success){
                    setSubscribeNumber(response.data.subscribeNumber);
                }else {
                    alert('구독자 수 정보를 받아오지 못했습니다');
                }
            })

        Axios.post('/api/subscribe/subscribed', subscribeNumberVariables)
            .then(response => {
                if(response.data.success){
                    console.log(response.data.subcribed);
                    setSubscribed(response.data.subcribed);
                } else{
                    alert('정보를 받아오지 못했습니다.')
                }
            })
    }, [])

    const onSubscribe = () => {

        let subscribedVariable = {
            userTo: userTo,
            userFrom: userFrom
        }

        // 이미 구독 중
        console.log(Subscribed)
        if(Subscribed){
            Axios.post('/api/subscribe/unSubscribe', subscribedVariable)
            .then(response => {
                if(response.data.success){
                    console.log(response.data);
                    setSubscribeNumber(SubscribeNumber-1);
                    setSubscribed(!Subscribed);
                }else {
                    alert('구독 취소 하는데 실패 했습니다')
                }
            })
        }
        // 아직 구독 중 아님
        else {
            Axios.post('/api/subscribe/subscribe', subscribedVariable)
            .then(response => {
                if(response.data.success){
                    console.log(response.data);
                    setSubscribeNumber(SubscribeNumber+1);
                    setSubscribed(!Subscribed);
                }else {
                    alert('구독 하는데 실패 했습니다')
                }
            })
        }
    }

    return (
        <button 
            onClick={onSubscribe}
            style={{
                backgroundColor: `${Subscribed ?  '#AAAAAA': '#CC0000'  }`,
                borderRadius: '4px', color: 'white',
                padding: '10px 16px', fontWeight: '500', fontSize: '1rem', textTransform: 'uppercase'
            }}>
            {SubscribeNumber} {Subscribed ? 'Subscribe' : 'Subscribed'} 
        </button>
    )
}

export default Subscribe

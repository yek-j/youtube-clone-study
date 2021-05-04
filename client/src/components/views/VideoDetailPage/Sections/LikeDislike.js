import React, {useEffect, useState} from 'react'
import {Tooltip, Icon} from 'antd'
import Axios from 'axios'

function LikeDislike(props) {

    const [Likes, setLikes] = useState(0);
    const [Dislikes, setDislikes] = useState(0)
    const [LikeAction, setLikeAction] = useState(null)
    const [DislikeAction, setDislikeAction] = useState(null)

    let variable = {}

    if(props.video){
        variable = {videoId: props.videoId, userId: props.userId}
    }else {
        variable = {commentId: props.commentId, userId: props.userId}
    }

    

    useEffect(() => {
        Axios.post('/api/like/getLikes', variable)
        .then(response => {
            if(response.data.success){
                // 얼마나 많은 좋아요를 받았는지?
                setLikes(response.data.likes.length)

                // 내가 이미 그 좋아요를 눌렀는지?
                response.data.likes.map(like => {
                    // like의 userId 중 내 userId가 있으면, 이미 누른 Like
                    if(like.userId === props.userId){
                        setLikeAction('liked');
                    }
                })
            }else{
                alert('Likes에 정보를 가져오지 못했습니다.');
            }
        })

        Axios.post('/api/like/getDisikes', variable)
        .then(response => {
            if(response.data.success){
                // 얼마나 많은 좋아요를 받았는지?
                setDislikes(response.data.dislikes.length)

                // 내가 이미 그 좋아요를 눌렀는지?
                response.data.dislikes.map(dislike => {
                    // like의 userId 중 내 userId가 있으면, 이미 누른 Like
                    if(dislike.userId === props.userId){
                        setDislikeAction('disliked');
                    }
                })
            }else{
                alert('Dislikes에 정보를 가져오지 못했습니다.');
            }
        })
    }, [])

    const onLike = () =>{
        if(LikeAction === null) {

            Axios.post('/api/like/upLike', variable)
            .then(response => {
                if(response.data.success){
                    setLikes(Likes + 1);
                    setLikeAction('liked');

                    if(DislikeAction != null){
                        setDislikeAction(null);
                        setDislikes(Dislikes - 1);
                    }
                }else {
                    alert('Likes에 실패했습니다.');
                }
            })
        }else{
            Axios.post('/api/like/unLike', variable)
            .then(response => {
                if(response.data.success){
                    setLikes(Likes -1);
                    setLikeAction(null);
                }else {
                    alert('Likes 해제에 실패했습니다.');
                }
            })
        }
    }

    const onDislike = () => {
        if(DislikeAction === null) {

            Axios.post('/api/like/upDislike', variable)
            .then(response => {
                if(response.data.success){
                    setDislikes(Dislikes + 1);
                    setDislikeAction('disliked');

                    if(LikeAction != null){
                        setLikeAction(null);
                        setLikes(Likes - 1);
                    }
                }else {
                    alert('DisLikes에 실패했습니다.');
                }
            })
        }else{
            Axios.post('/api/like/unDislike', variable)
            .then(response => {
                if(response.data.success){
                    setDislikes(Dislikes -1);
                    setDislikeAction(null);
                }else {
                    alert('DisLikes 해제에 실패했습니다.');
                }
            })
        }
    }

    return (
        <div>
            <span key="comment-basic-like">
                <Tooltip title="Like">
                    <Icon type="like"
                        theme={LikeAction === 'liked' ? 'filled' : 'outlined'}
                        onClick={onLike}
                    />
                </Tooltip>
                <span style={{paddingLeft: '8px', cursor: 'auto'}}>{Likes} </span>
            </span> &nbsp; &nbsp;

            <span key="comment-basic-dislike">
                <Tooltip title="Disike">
                    <Icon type="dislike"
                        theme={DislikeAction === 'disliked' ? 'filled' : 'outlined'}
                        onClick={onDislike}
                    />
                </Tooltip>
                <span style={{paddingLeft: '8px', cursor: 'auto'}}>{Dislikes}</span>
            </span>&nbsp; &nbsp;
        </div>
    )
}

export default LikeDislike

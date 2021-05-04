import React, {useState} from 'react'
import Axios from 'axios';
import {useSelector} from 'react-redux';
import SingleComment from './SingleComment'
import ReplyComment from './ReplyComment';

function Comment(props) {
    const videoId = props.postId;
    const user = useSelector(state => state.user);
    const [CommentLists, setCommentLists] = useState("");

    const handleClick = (event) => {
        setCommentLists(event.currentTarget.value);
    }

    const onSubmit = (event) =>{
        event.preventDefault();

        const variables = {
            content: CommentLists,
            writer: user.userData._id,
            postId: videoId
        }

        Axios.post('/api/comment/saveComment', variables)
        .then(response => {
            if(response.data.success){
                console.log(response.data.result);
                
                setCommentLists("");
                props.refreshFunction(response.data.result);
                
            }else {
                alert('댓글을 저장하지 못했습니다')
            }
        })
    }

    return (
        <div>
            <br />
            <p>Replise</p>
            <hr />

            {/* Comment Lists */}
            {console.log(props.CommentLists)}

            {props.CommentLists && props.CommentLists.map((comment, index) => (
                (!comment.responseTo &&
                    <React.Fragment>
                        <SingleComment comment={comment} postId={props.postId} refreshFunction={props.refreshFunction} />
                        <ReplyComment CommentLists={props.CommentLists} postId={props.postId} parentCommentId={comment._id} refreshFunction={props.refreshFunction} />
                    </React.Fragment>
                )
            ))}

            {/*Root Comment Form */}
            <form style={{display: 'flex'}} onSubmit={onSubmit}>
                <textarea
                    style={{width: '100%', borderRadius: '5px'}}
                    onChange={handleClick}
                    value={CommentLists}
                    placeholder="코멘트를 작성해 주세요"
                />
                <br />
                <button style={{width: '20%', height:'52px'}} onClick={onSubmit}>Sumit</button>
            </form>
        </div>
    )
}

export default Comment

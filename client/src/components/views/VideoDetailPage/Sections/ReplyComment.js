import React, {useEffect, useState} from 'react'
import SingleComment from './SingleComment'

function ReplyComment(props) {
    
    const [ChildCommentNumber, setChildCommentNumber] = useState(0);
    const [OpenReplyComments, setOpenReplyComments] = useState(false);

    useEffect(() => {
        console.log(props.CommentLists)
        let commentNumber = 0;
        props.CommentLists.map((comment, index)=>{
            
        console.log("responseTo:" + comment.responseTo + " parent : "+props.parentCommentId)
            if(comment.responseTo === props.parentCommentId){
                commentNumber ++;
            }
        })

        setChildCommentNumber(commentNumber);
    }, [props.CommentLists])

    let renderReplyComment = (parentCommentId) =>
        props.CommentLists.map((comment, index) => (
            <React.Fragment>
                {comment.responseTo === parentCommentId &&
                    <div style={{ width: '80%', marginLeft: '40px' }}>
                        <SingleComment comment={comment} postId={props.postId} refreshFunction={props.refreshFunction} />
                        <ReplyComment CommentLists={props.CommentLists} parentCommentId={comment._id} postId={props.postId} refreshFunction={props.refreshFunction} />
                    </div>
                }
            </React.Fragment>
        ))

        const onHandlerChange = () => {
            setOpenReplyComments(!OpenReplyComments);
        }
    
    return (
        <div>
            {ChildCommentNumber > 0 && 
                <p style={{fontSize:'14px', margin:0, color: 'gray'}} onClick={onHandlerChange}>
                View {ChildCommentNumber} more comment(s)
                </p>
            }

            {OpenReplyComments &&
                renderReplyComment(props.parentCommentId)
            }
            
        </div>
    )
}

export default ReplyComment

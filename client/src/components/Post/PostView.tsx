import React, { useContext, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp, faPaperPlane } from "@fortawesome/free-regular-svg-icons";
import { Post, Comment } from "../../@types/posts";
import baseUrl from "../../utils/baseurl";
import { AuthContext } from "../../context/AuthContext";

type Props = {
  post: Post;
};

function PostView({ post }: Props) {
  const [isCommenting, setIsCommenting] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [showAllComments, setShowAllComments] = useState(false);
  const [isCommentDelete, setIsCommentDelete] = useState(false);
  const [updatedComments, setUpdatedComments] = useState();
  const [isCommentDeleteFail, setIsCommentDeleteFail] = useState(false);

  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (post.comments) {
      setComments([...post.comments]);
    }
  }, [post.comments]);

  console.log("post", post);

  const handleDeleteComment = async (postId: string, commentId: string) => {
    console.log("commentId", postId);
    setIsCommentDelete(false);
    try {
      const token = localStorage.getItem("token");
      const myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${token}`);
      myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

      // console.log("comment._id :>> ", comment._id);
      const urlencoded = new URLSearchParams();
      urlencoded.append("commentId", commentId);
      urlencoded.append("postId", postId);
      // const raw = JSON.stringify({
      //   commentId: commentId,
      // });

      if (!commentId) {
        // console.log("comment._id is undefined");
        return;
      }

      const requestOptions = {
        method: "DELETE",
        headers: myHeaders,
        body: urlencoded,
      };

      fetch(`${baseUrl}/api/posts/deleteacomment/`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
          // console.log("result :>> ", result);
          setIsCommentDelete(true);
          setUpdatedComments(result.post.comments);
          setComments(comments.filter((item) => item._id !== commentId));
        })
        .catch((error) => console.log("error", error));
      setIsCommentDeleteFail(true);

      // console.log("comment", comment._id);
    } catch (error) {
      // console.log("error", error);
      setIsCommentDeleteFail(true);
    }
  };

  const onSubmit = async () => {
    const token = localStorage.getItem("token");
    console.log("token", token);
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);
    const formdata = new URLSearchParams();

    formdata.append("comment", newComment);
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: formdata,
    };
    try {
      const response = await fetch(
        `${baseUrl}/api/posts/addacomment/${post._id}`,
        requestOptions
      );
      const resJson = await response.json();
      const tempComment: Comment = {
        comment: newComment,
        commentorId: user?._id ?? "",
        commentorName: user?.username ?? "",
        commentorPicture: user?.userpicture ?? "",
        time: new Date(),
        _id: resJson.newCommentId,
      };
      console.log("tempcomment", tempComment);
      setComments([...comments, tempComment]);
      setNewComment("");
    } catch (error) {
      console.log("error creating comment", error);
      alert("Couldn't create comment");
    }
  };

  const handleShowMoreComments = () => {
    setShowAllComments(true);
  };

  return (
    <div key={post._id}>
      <div className="wholepost">
        <div className="usernamepicture">
          <img
            style={{ width: "50px", height: "50px" }}
            src={post.ownedbyuser?.userpicture}
          ></img>
          <p>{post.ownedbyuser?.username}</p>
        </div>
        <div className="caption">
          <p style={{ marginBottom: "10px" }}>{post.caption}</p>
        </div>
        <img className="postimage" src={post.image} alt="Post" />

        <div className="likecomment">
          <FontAwesomeIcon
            className="thumbsupicon"
            icon={faThumbsUp}
            style={{ marginRight: "100px" }}
          />
          <p
            style={{ cursor: "pointer", marginRight: "100px" }}
            onClick={() => setIsCommenting(true)}
          >
            Comment
          </p>
          <p>({comments.length} comments)</p>
        </div>

        {comments && comments.length > 0 && (
          <div>
            {showAllComments
              ? comments.map((comment, index: number) => (
                  <div key={index}>
                    <div className="commentornameimage">
                      <img
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "50%",
                        }}
                        src={comment.commentorPicture}
                        alt="Commentor"
                      />
                      {comment.commentorName}: {comment.comment}
                    </div>
                  </div>
                ))
              : comments.slice(0, 2).map((comment, index: number) => (
                  <div className="allcomments" key={index}>
                    <img
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                      }}
                      src={comment.commentorPicture}
                      alt="Commentor"
                    />
                    {comment.commentorName}: {comment.comment}
                    <button
                      onClick={() => {
                        handleDeleteComment(post._id, comment._id);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                ))}

            {!showAllComments && comments.length > 2 && (
              <button
                className="showmorecomments"
                onClick={handleShowMoreComments}
              >
                Show more comments
              </button>
            )}
          </div>
        )}

        {isCommenting && (
          <div
            style={{
              width: "500px",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <input
              value={newComment}
              onChange={(e) => {
                setNewComment(e.target.value);
              }}
              placeholder="what do you say about this post?"
              type="text"
              style={{ width: "90%", borderRadius: "10px", fontSize: "16px" }}
            />
            <button className="postcomment" onClick={onSubmit}>
              <FontAwesomeIcon icon={faPaperPlane} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default PostView;

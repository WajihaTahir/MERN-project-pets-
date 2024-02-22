import React, { useContext, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import moment from "moment";
import {
  faThumbsUp,
  faPaperPlane,
  faTrashCan,
} from "@fortawesome/free-regular-svg-icons";
import { Post, Comment } from "../../@types/posts";
import baseUrl from "../../utils/baseurl";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router";
import getToken from "../../utils/getToken.ts";
import likePost from "../../utils/favorites.ts";

type Props = {
  post: Post;
};

function PostView({ post }: Props) {
  const { user } = useContext(AuthContext);
  const [isCommenting, setIsCommenting] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [showAllComments, setShowAllComments] = useState(false);
  const [, setIsCommentDelete] = useState(false);
  const [, setUpdatedComments] = useState();
  const [, setIsCommentDeleteFail] = useState(false);
  const [poster, setPoster] = useState(false);
  const [likes, setLikes] = useState<string[]>([]);

  const navigate = useNavigate();

  //like button
  const handleLikeButton = async (post: Post) => {
    if (!poster) {
      try {
        await likePost({ post });
        if (user?._id) {
          setLikes([...likes, user?._id]);
        }
      } catch (error) {
        alert("problem liking a comment");
      }
    }
  };
  //for instant change on comments
  useEffect(() => {
    if (post.comments) {
      setComments([...post.comments]);
    }
  }, [post.comments]);

  //for instant change on likes without refreshing the page
  useEffect(() => {
    if (post.likes) {
      setLikes([...post.likes]);
    }
  }, [post.likes]);

  console.log("post", post);

  //delete a comment
  const handleDeleteComment = async (postId: string, commentId: string) => {
    console.log("commentId", postId);
    setIsCommentDelete(false);
    try {
      const token = getToken();
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

  //addding a comment
  const onSubmit = async () => {
    const token = getToken();
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

  //show more comments

  const handleShowMoreComments = () => {
    setShowAllComments(true);
  };

  return (
    <>
      {user ? (
        <div key={post._id} className="flexingpost">
          <div className="wholepost">
            <div className="usernamepicture">
              <img
                style={{
                  width: "70px",
                  height: "70px",
                  marginTop: "10px",
                  marginRight: "10px",
                  borderRadius: "50%",
                }}
                src={post.ownedbyuser?.userpicture}
              ></img>
              <p style={{ marginRight: "10px", marginTop: "40px" }}>
                {post.ownedbyuser?.username},
              </p>

              <p style={{ marginTop: "40px" }}>
                {""}
                Posted On: {moment(post.time).format("MMMM Do YYYY, h:mm:ss a")}
              </p>
            </div>
            <div className="caption">
              <p style={{ marginBottom: "10px" }}>{post.caption}</p>
            </div>
            <img className="postimage" src={post.image} alt="Post" />

            <div className="likecomment">
              <div style={{ display: "flex", marginRight: "100px" }}>
                <FontAwesomeIcon
                  onClick={() => {
                    handleLikeButton(post);
                  }}
                  color={likes.includes(user._id) ? "blue" : "black"}
                  className="thumbsupicon"
                  icon={faThumbsUp}
                  style={{ marginRight: "5px", cursor: "pointer" }}
                />
                {likes.length > 0 && <p>{likes?.length}</p>}
              </div>
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
                      <div key={index} className="allcomments">
                        <div className="commentContainer">
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
                        {(post.ownedbyuser?._id === user._id ||
                          comment.commentorName === user.username) && (
                          <div className="trashcan">
                            <FontAwesomeIcon
                              style={{
                                fontSize: "large",
                                textAlign: "end",
                                color: "red",
                                cursor: "pointer",
                              }}
                              className="thumbsupicon"
                              onClick={() => {
                                handleDeleteComment(post._id, comment._id);
                              }}
                              icon={faTrashCan}
                            />
                          </div>
                        )}
                      </div>
                    ))
                  : comments.slice(0, 2).map((comment, index: number) => (
                      <div className="allcomments" key={index}>
                        <div className="commentContainer">
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
                        {(post.ownedbyuser?._id === user._id ||
                          comment.commentorName === user.username) && (
                          <div className="trashcan">
                            <FontAwesomeIcon
                              style={{
                                fontSize: "large",
                                textAlign: "end",
                                color: "red",
                                cursor: "pointer",
                              }}
                              className="thumbsupicon"
                              onClick={() => {
                                handleDeleteComment(post._id, comment._id);
                              }}
                              icon={faTrashCan}
                            />
                          </div>
                        )}
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
                  width: "700px",
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
                  style={{
                    width: "90%",
                    borderRadius: "10px",
                    fontSize: "16px",
                  }}
                />
                <button className="postcomment" onClick={onSubmit}>
                  <FontAwesomeIcon icon={faPaperPlane} />
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        navigate("/")
      )}
    </>
  );
}

export default PostView;

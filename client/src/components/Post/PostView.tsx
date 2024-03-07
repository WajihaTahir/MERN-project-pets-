import { useContext, useEffect, useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import moment from "moment";
import {
  faThumbsUp,
  faPaperPlane,
  faTrashCan,
  faPenToSquare,
} from "@fortawesome/free-regular-svg-icons";
import { faThumbsUp as faSolid } from "@fortawesome/free-solid-svg-icons";
import { Post, Comment } from "../../@types/posts";
import baseUrl from "../../utils/baseurl";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router";
import getToken from "../../utils/getToken.ts";
import { likePost, unlikePost } from "../../utils/likes.ts";
import { User } from "../../@types/users.ts";

type Props = {
  post: Post;
  onDelete: (post: Post) => void;
};
function PostView({ post, onDelete }: Props) {
  const { user } = useContext(AuthContext);
  const [isCommenting, setIsCommenting] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [showAllComments, setShowAllComments] = useState(false);
  const [likes, setLikes] = useState<string[]>([]);
  const navigate = useNavigate();

  const handleUsernameClick = async (user: User) => {
    navigate("/userposts", {
      state: {
        user: user, //will carry the state information of the user
      },
    });
  };

  const handleUpdateClick = () => {
    navigate("/updatepost", {
      state: {
        image: post.image,
        caption: post.caption,
        editing: true,
        id: post._id,
      },
    });
  };
  const alreadyLiked = useMemo(
    //to optimize re-render or when the values in the dependency array change
    //keeping a memoization of the users liked posts
    () => likes.includes(user?._id ?? ""),
    [likes, user] //will be run if any of these state changes. for example it will keep the value of likes even if user or likes change.
  );
  //like button
  const handleLikeButton = async (post: Post) => {
    if (!alreadyLiked) {
      try {
        await likePost({ post });
        if (user?._id) {
          //if the user id exists
          setLikes([...likes, user?._id]); //add the user to already likes
        }
      } catch (error) {
        alert("problem liking a post");
      }
    } else {
      try {
        await unlikePost({ post });
        if (user?._id) {
          setLikes(likes.filter((item) => item !== user._id)); //filter out and display only the left ones
        }
      } catch (error) {
        alert("problem unliking a post");
      }
    }
  };
  //for instant change on comments
  useEffect(() => {
    if (post.comments) {
      console.log("postcomms", post.comments);
      setComments([...post.comments]); //Adding comments to component state so we can add remove from it later
    }
  }, [post.comments]);
  //for instant change on likes without refreshing the page
  useEffect(() => {
    if (post.likes) {
      setLikes([...post.likes]); //adding to the original likes and changing without refresh
    }
  }, [post.likes]);

  useEffect(() => {
    console.log("comments...", comments);
  }, [comments]);

  //delete a comment
  const handleDeleteComment = async (postId: string, commentId: string) => {
    console.log("commentId", postId);
    try {
      const token = getToken();
      const myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${token}`);
      myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

      const urlencoded = new URLSearchParams();
      urlencoded.append("commentId", commentId);
      urlencoded.append("postId", postId);

      if (!commentId) {
        return;
      }

      const requestOptions = {
        method: "DELETE",
        headers: myHeaders,
        body: urlencoded,
      };

      fetch(`${baseUrl}/api/posts/deleteacomment/`, requestOptions)
        .then((response) => response.json())
        .then(() => {
          //deleting comment in component state temporarily
          //so we don't have to fetch all posts again on delete
          setComments(comments.filter((item) => item._id !== commentId));
        })
        .catch((error) => console.log("error", error));
      // console.log("comment", comment._id);
    } catch (error) {
      console.log("error", error);
      // setIsCommentDeleteFail(true);
    }
  };

  //adding a comment
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
      //Creating comment object temporarily to add in component state
      //on same structure as comes from server.
      const tempComment: Comment = {
        //just given name so when it will refresh, the server one will come.
        comment: newComment,
        commentor: user,
        time: new Date(),
        _id: resJson.newCommentId,
      };
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
      <div key={post._id}>
        <div className="wholepost">
          <div className="usernamepicture">
            <img
              className="userpicturepost"
              src={post.ownedbyuser?.userpicture}
            ></img>
            <p
              className="username"
              onClick={() => handleUsernameClick(post.ownedbyuser as User)}
            >
              {post.ownedbyuser?.username},
            </p>

            <p style={{ marginTop: "40px" }}>
              {""}
              Posted On: {moment(post.time).format("MMMM Do YYYY, h:mm:ss a")}
            </p>
            {post.ownedbyuser?._id === user?._id && (
              <div className="deleteeditpost">
                <FontAwesomeIcon
                  className="editpost"
                  icon={faPenToSquare}
                  onClick={handleUpdateClick}
                />
                <FontAwesomeIcon
                  className="deletepost"
                  onClick={() => onDelete(post)}
                  icon={faTrashCan}
                />
              </div>
            )}
          </div>
          <div className="caption">
            <p>{post.caption}</p>
          </div>
          <img className="postimage" src={post.image} alt="Post" />

          <div className="likecomment">
            <>
              <div style={{ display: "flex", marginRight: "100px" }}>
                <FontAwesomeIcon
                  onClick={() => {
                    handleLikeButton(post);
                  }}
                  className="thumbsupicon"
                  icon={alreadyLiked ? faSolid : faThumbsUp}
                />
                {likes.length > 0 && <p>{likes?.length}</p>}
              </div>
            </>
            <p
              style={{ cursor: "pointer", marginRight: "100px" }}
              onClick={() => setIsCommenting(true)}
            >
              Comment
            </p>
            <p>{comments.length} comment(s)</p>
          </div>
          {comments && comments.length > 0 && (
            <div>
              {showAllComments
                ? comments.map((comment, index: number) => {
                    return (
                      <div key={index} className="allcomments">
                        <div className="commentContainer">
                          <img
                            className="commentUserPicture"
                            src={comment.commentor?.userpicture}
                            alt="Commentor"
                          />
                          {comment.commentor?.username}: {comment.comment}
                        </div>
                        {(post.ownedbyuser?._id === user?._id ||
                          comment.commentor?._id === user?._id) && (
                          <div className="trashcan">
                            <FontAwesomeIcon
                              className="trashcomment"
                              onClick={() => {
                                handleDeleteComment(post._id, comment._id);
                              }}
                              icon={faTrashCan}
                            />
                          </div>
                        )}
                      </div>
                    );
                  })
                : comments.slice(0, 2).map((comment, index: number) => (
                    <div className="allcomments" key={index}>
                      <div className="commentContainer">
                        <img
                          className="commentUserPicture"
                          src={comment.commentor?.userpicture}
                          alt="Commentor"
                        />
                        {comment.commentor?.username}: {comment.comment}
                      </div>
                      {(post.ownedbyuser?._id === user?._id ||
                        comment.commentor?._id === user?._id) && (
                        <div className="trashcan">
                          <FontAwesomeIcon
                            className="trashcomment"
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
            <div className="isCommenting">
              <input
                value={newComment}
                onChange={(e) => {
                  setNewComment(e.target.value);
                }}
                placeholder="what do you say about this post?"
                className="whatdoyousay"
                type="text"
              />
              <button className="postcomment" onClick={onSubmit}>
                <FontAwesomeIcon icon={faPaperPlane} />
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default PostView;

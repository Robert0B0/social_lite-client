import React, { Fragment, useContext, useState, useRef } from "react";
import gql from "graphql-tag";
import { useMutation, useQuery } from "@apollo/react-hooks";
import {
	Card,
	Grid,
	Button,
	Image,
	Icon,
	Label,
	Form,
} from "semantic-ui-react";
import moment from "moment";

import { AuthContext } from "../context/auth";
import LikeButton from "../components/LikeButton";
import EditButton from "../components/EditButton";
import DeleteButton from "../components/DeleteButton";
import MyPopup from "../util/MyPopup";

export default function SinglePost(props) {
	const postId = props.match.params.postId;
	const { user } = useContext(AuthContext);
	const commentInputRef = useRef(null);
	const [comment, setComment] = useState("");

	const { data: { getPost } = {} } = useQuery(FETCH_POST_QUERY, {
		variables: {
			postId,
		},
	});

	/* const { data: { getPic: pic } = {} } = useQuery(FETCH_USER_PIC, {
		variables: {
			username: post.username,
		},
	}); */

	const [submitComment] = useMutation(SUBMIT_COMMENT_MUTATION, {
		update() {
			setComment("");
			commentInputRef.current.blur();
		},
		variables: {
			postId,
			body: comment,
		},
	});

	function deletePostCallback() {
		props.history.push("/");
	}

	let postMarkup;
	if (!getPost) {
		postMarkup = <p>Loading Post...</p>;
	} else {
		const {
			id,
			body,
			createdAt,
			username,
			tags,
			comments,
			likes,
			likeCount,
			commentCount,
		} = getPost;
		postMarkup = (
			<Grid>
				<Grid.Row>
					<Grid.Column width="2">
						{/* <Image src={pic} size="small" fload="right" /> */}
					</Grid.Column>
					<Grid.Column width="10">
						<Card fluid>
							<Card.Content>
								<Card.Header>{username}</Card.Header>
								<Card.Meta>
									{moment(new Date(createdAt)).fromNow(true)}
								</Card.Meta>
								<Card.Meta>
									{tags &&
										tags.map((tag, index) => {
											return (
												<h4 style={{ display: "inline-block" }} key={index}>
													{tag},{" "}
												</h4>
											);
										})}
								</Card.Meta>
								<Card.Description>{body}</Card.Description>
							</Card.Content>
							<hr />
							<Card.Content extra>
								<LikeButton user={user} post={{ id, likeCount, likes }} />
								<MyPopup content="Comment on Post">
									<Button as="div" labelPosition="right">
										<Button color="blue">
											<Icon name="comments" />
										</Button>
										<Label basic color="blue" pointing="left">
											{commentCount}
										</Label>
									</Button>
								</MyPopup>
								{user && user.username === username && (
									<DeleteButton postId={id} callback={deletePostCallback} />
								)}
							</Card.Content>
						</Card>
						{user && (
							<Card fluid>
								<Card.Content>
									<p>Post a Comment</p>
									<Form>
										<div className="ui action input fluid">
											<input
												type="text"
												placeholder="Wrtie a Comment..."
												name="comment"
												value={comment}
												onChange={(event) => setComment(event.target.value)}
												ref={commentInputRef}
											/>
											<button
												type="submit"
												className="ui button blue"
												disabled={comment.trim() === ""}
												onClick={submitComment}
											>
												Submit
											</button>
										</div>
									</Form>
								</Card.Content>
							</Card>
						)}
						{comments.map((comment) => (
							<Card fluid key={comment.id}>
								<Card.Content>
									{user && user.username === comment.username && (
										<Fragment>
											<EditButton postId={id} commentId={comment.id} />
											<DeleteButton postId={id} commentId={comment.id} />
										</Fragment>
									)}
									<Card.Header>{comment.username}</Card.Header>
									<Card.Meta>
										{moment(new Date(createdAt)).fromNow(true)}
									</Card.Meta>
									<Card.Description>{comment.body}</Card.Description>
								</Card.Content>
							</Card>
						))}
					</Grid.Column>
				</Grid.Row>
			</Grid>
		);
	}

	return postMarkup;
}

const FETCH_POST_QUERY = gql`
	query ($postId: ID!) {
		getPost(postId: $postId) {
			id
			body
			createdAt
			username
			tags
			likeCount
			likes {
				username
			}
			commentCount
			comments {
				id
				username
				createdAt
				body
			}
		}
	}
`;

const FETCH_USER_PIC = gql`
	query ($username: String!) {
		getUserPic(username: $username)
	}
`;

const SUBMIT_COMMENT_MUTATION = gql`
	mutation ($postId: ID!, $body: String!) {
		createComment(postId: $postId, body: $body) {
			id
			comments {
				id
				body
				createdAt
				username
			}
			commentCount
		}
	}
`;

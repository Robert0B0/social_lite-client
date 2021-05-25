import React, { useState, useEffect } from "react";
import { Button, Label, Icon } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { useMutation } from "@apollo/react-hooks";
import MyPopup from "../util/MyPopup";
import gql from "graphql-tag";

export default function LikeButton({ user, post: { id, likeCount, likes } }) {
	const [liked, setLiked] = useState(false);

	useEffect(() => {
		if (user && likes.find((like) => like.username === user.username)) {
			setLiked(true);
		} else {
			setLiked(false);
		}
	}, [user, likes]);

	const [likePost] = useMutation(LIKE_POST_MUTATION, {
		variables: { postId: id },
	});

	const likeButton = user ? (
		liked ? (
			<Button color="green">
				<Icon name="heart" />
			</Button>
		) : (
			<Button color="green" basic>
				<Icon name="heart" />
			</Button>
		)
	) : (
		<Button as={Link} to="/login" color="green" basic>
			<Icon name="heart" />
		</Button>
	);

	return (
		<MyPopup content={liked ? "Unlike" : "Like"}>
			<Button as="div" labelPosition="right" onClick={likePost}>
				{likeButton}
				<Label basic color="green" pointing="left">
					{likeCount}
				</Label>
			</Button>
		</MyPopup>
	);
}

const LIKE_POST_MUTATION = gql`
	mutation likePost($postId: ID!) {
		likePost(postId: $postId) {
			id
			likes {
				id
				username
			}
			likeCount
		}
	}
`;

import React, { Fragment, useState } from "react";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";
import { Button, Icon, Confirm, Popup } from "semantic-ui-react";
import { FETCH_POSTS_QUERY } from "../util/graphql";
import MyPopup from "../util/MyPopup";

export default function DeleteButton({ postId, commentId, callback }) {
	const [confirmOpen, setConfirmOpen] = useState(false);

	const mutation = commentId ? DELETE_COMMENT_MUTAION : DELETE_POST_MUTATION;

	const [deletePostOrMutaion] = useMutation(mutation, {
		update(proxy) {
			setConfirmOpen(false);
			if (!commentId) {
				//const data = proxy.readQuery({ query: FETCH_POSTS_QUERY });
				const oldPosts = proxy.readQuery({ query: FETCH_POSTS_QUERY });
				const newData = oldPosts.getPosts.filter((p) => p.id !== postId);
				proxy.writeQuery({
					query: FETCH_POSTS_QUERY,
					data: { getPosts: newData },
				});
			}
			if (callback) callback();
		},
		variables: {
			postId,
			commentId,
		},
	});

	return (
		<Fragment>
			<MyPopup content={commentId ? "Delete Commnet" : "Delete Post"}>
				<Button
					as="div"
					color="red"
					floated="right"
					onClick={() => {
						setConfirmOpen(true);
					}}
					basic
				>
					<Icon name="trash" style={{ margin: 0 }} />
				</Button>
			</MyPopup>
			<Confirm
				open={confirmOpen}
				onCancel={() => setConfirmOpen(false)}
				onConfirm={deletePostOrMutaion}
			/>
		</Fragment>
	);
}

const DELETE_POST_MUTATION = gql`
	mutation deletePost($postId: ID!) {
		deletePost(postId: $postId)
	}
`;

const DELETE_COMMENT_MUTAION = gql`
	mutation deleteComment($postId: ID!, $commentId: ID!) {
		deleteComment(postId: $postId, commentId: $commentId) {
			id
			comments {
				id
				username
				createdAt
				body
			}
			commentCount
		}
	}
`;

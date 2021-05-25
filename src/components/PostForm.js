import React, { Fragment } from "react";
import { Button, Form } from "semantic-ui-react";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";

import { useForm } from "../util/hooks";
import { FETCH_POSTS_QUERY } from "../util/graphql";

function PostForm() {
	const { values, onChange, onSubmit } = useForm(createPostCallback, {
		body: "",
	});

	const [createPost, { error }] = useMutation(CREATE_POST_MUTATION, {
		variables: values,
		update(proxy, result) {
			const data = proxy.readQuery({
				query: FETCH_POSTS_QUERY,
			});
			data.getPosts = [result.data.createPost, ...data.getPosts];
			proxy.writeQuery({
				query: FETCH_POSTS_QUERY,
				data: { getPosts: [result.data.createPost, ...data.getPosts] },
			});
			values.body = "";
		},
	});

	function createPostCallback() {
		createPost();
	}

	return (
		<Fragment>
			<Form onSubmit={onSubmit}>
				<h2>Share your Thoughs:</h2>
				<Form.Field>
					<Form.Input
						placeholder="Hi World! #tags..."
						name="body"
						onChange={onChange}
						value={values.body}
						error={error ? true : false}
					/>
					<Button type="submit" color="blue">
						Submit
					</Button>
				</Form.Field>
			</Form>
			{error && (
				<div className="ui error message" style={{ marginBottom: 20 }}>
					<ul className="list">
						<li>{error.graphQLErrors[0].message}</li>
					</ul>
				</div>
			)}
		</Fragment>
	);
}

const CREATE_POST_MUTATION = gql`
	mutation createPost($body: String!) {
		createPost(body: $body) {
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

export default PostForm;

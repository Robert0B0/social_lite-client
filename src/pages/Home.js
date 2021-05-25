import React, { useContext } from "react";
import { useQuery } from "@apollo/react-hooks";
import { FETCH_POSTS_QUERY, FETCH_USERS_QUERY } from "../util/graphql";

import { Container, Grid, Transition } from "semantic-ui-react";
import { AuthContext } from "../context/auth";
import PostCard from "../components/PostCard";
import PostForm from "../components/PostForm";

export default function Home() {
	const { user } = useContext(AuthContext);
	const { loading, data: { getPosts: posts } = {} } =
		useQuery(FETCH_POSTS_QUERY);
	const { uloading, data: { getUsers: users } = {} } =
		useQuery(FETCH_USERS_QUERY);

	let userPics = [];
	if (users) {
		for (let i = 0; i < users.length; i++) {
			const user = { name: users[i].username, pic: users[i].imageUrl };
			userPics.push(user);
		}
	}

	return (
		<Grid columns={3}>
			<Grid.Row className="page-title" textAlign="left">
				<h1>Recent Posts</h1>
			</Grid.Row>
			{user && (
				<div>
					<Container
						style={{ paddingBottom: "25px" }}
						textAlign="left"
						style={{ width: "500px" }}
					>
						<PostForm />
					</Container>
					<hr />
				</div>
			)}
			<Grid.Row>
				{loading && uloading ? (
					<h1>Loading Posts...</h1>
				) : (
					<Transition.Group>
						{posts &&
							posts.map((post) => {
								const foundUser = userPics.find(
									(user) => user.name === post.username
								);
								let image = "";
								if (foundUser) {
									image = foundUser.pic;
								}
								return (
									<Grid.Column key={post.id} style={{ marginBottom: 20 }}>
										<PostCard post={post} image={image} />
									</Grid.Column>
								);
							})}
					</Transition.Group>
				)}
			</Grid.Row>
		</Grid>
	);
}

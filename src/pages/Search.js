import React, { useContext } from "react";
import { useQuery } from "@apollo/react-hooks";
import { Grid, Container, Form, Button, Transition } from "semantic-ui-react";
import PostCard from "../components/PostCard";
import { AuthContext } from "../context/auth";
import { FETCH_SERACH_QUERY } from "../util/graphql";

export default function Search() {
	const onSubmit = () => {};
	const onChange = () => {};

	const { user } = useContext(AuthContext);
	const { loading, data: { getSearchPosts: posts } = {} } = useQuery(
		FETCH_SERACH_QUERY,
		{
			variables: { content: "#admin" },
		}
	);

	return (
		<Grid columns={3}>
			<Grid.Row className="page-title" textAlign="left">
				<Container
					style={{ paddingBottom: "25px" }}
					textAlign="left"
					style={{ width: "500px" }}
				>
					<h1>Search Posts:</h1>
					<Form onSubmit={onSubmit}>
						<h2>Share your Thoughs:</h2>
						<Form.Field>
							<Form.Input
								placeholder="Posts, #tags"
								name="serach"
								onChange={onChange}
							/>
							<Button type="submit" color="blue">
								Search
							</Button>
						</Form.Field>
					</Form>
				</Container>
			</Grid.Row>
			<Grid.Row>
				<Transition.Group>
					{loading ? (
						<h1>Loading Posts...</h1>
					) : (
						<Transition.Group>
							{posts &&
								posts.map((post) => (
									<Grid.Column key={post.id} style={{ marginBottom: 20 }}>
										<PostCard
											post={post}
											image={
												"https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
											}
										/>
									</Grid.Column>
								))}
						</Transition.Group>
					)}
				</Transition.Group>
			</Grid.Row>
		</Grid>
	);
}

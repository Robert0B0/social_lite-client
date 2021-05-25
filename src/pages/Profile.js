import React, { useContext, useState, useEffect } from "react";
import { useMutation, useQuery } from "@apollo/react-hooks";
import { AuthContext } from "../context/auth";
import {
	Container,
	Card,
	Button,
	Image,
	Grid,
	Transition,
	Form,
	Modal,
} from "semantic-ui-react";
import PostCard from "../components/PostCard";
import { FETCH_USER_POSTS_QUERY } from "../util/graphql";
import MyPopup from "../util/MyPopup";
import gql from "graphql-tag";

export default function Profile() {
	const [openModal, setOpenModal] = useState(false);
	const { user } = useContext(AuthContext);
	const [newEmail, setNewEmail] = useState("");
	const [newPic, setNewPic] = useState("");

	if (!user) {
		window.location.href = "/";
	}
	const { loading, data: { getUserPosts: posts } = {} } = useQuery(
		FETCH_USER_POSTS_QUERY,
		{
			variables: { userName: user.username },
		}
	);

	const [editUser] = useMutation(MODIFY_USER, {
		efetchQueries: [{ query: FETCH_USER_POSTS_QUERY }],
	});

	useEffect(() => {
		setNewEmail(user.email);
		setNewPic(user.imageUrl);
	}, []);

	const submitEdit = (e) => {
		e.preventDefault();

		editUser({
			variables: {
				userId: user.id,
				new_imageUrl: newPic,
				new_email: newEmail,
			},
		});

		setOpenModal(false);
	};

	return (
		<div>
			<Container>
				<Card fluid style={{ width: "300px" }}>
					<Card.Content>
						<Image src={user.imageUrl} />
						<h1>{user.username}</h1>
						<MyPopup content="Change username">
							<Modal
								onClose={() => setOpenModal(false)}
								onOpen={() => setOpenModal(true)}
								open={openModal}
								size={"tiny"}
								trigger={<Button color="yellow">Edit:</Button>}
							>
								<Modal.Header>Change Profile Settings:</Modal.Header>
								<Modal.Content>
									<Image
										size="medium"
										src={user.imageUrl}
										wrapped
										style={{ paddingBottom: "10px" }}
									/>
									<Modal.Description>
										<Form>
											<Form.Field>
												<label>Image link location:</label>
												<input
													placeholder="image url"
													value={newPic}
													onChange={(e) => setNewPic(e.target.value)}
												/>
											</Form.Field>
											<Form.Field>
												<label>Email</label>
												<input
													placeholder="Email"
													value={newEmail}
													onChange={(e) => setNewEmail(e.target.value)}
												/>
											</Form.Field>

											<Button type="submit" onClick={submitEdit}>
												Submit
											</Button>
										</Form>
									</Modal.Description>
								</Modal.Content>
								<Modal.Actions>
									<Button color="grey" onClick={() => setOpenModal(false)}>
										Cancel
									</Button>
								</Modal.Actions>
							</Modal>
						</MyPopup>
					</Card.Content>
				</Card>
			</Container>

			<Container>
				<h2 style={{ paddingTop: "25px" }}>Your Posts:</h2>
				<Grid.Row>
					<Transition.Group>
						{loading ? (
							<h1>Loading Posts...</h1>
						) : (
							<Transition.Group>
								{posts &&
									posts.map((post) => (
										<Grid.Column key={post.id} style={{ marginBottom: 20 }}>
											<PostCard post={post} image={user.imageUrl} />
										</Grid.Column>
									))}
							</Transition.Group>
						)}
					</Transition.Group>
				</Grid.Row>
			</Container>
		</div>
	);
}

const MODIFY_USER = gql`
	mutation modifyUser(
		$userId: String!
		$new_imageUrl: String
		$new_email: String!
	) {
		id
		email
		username
		imageUrl
		createdAt
	}
`;

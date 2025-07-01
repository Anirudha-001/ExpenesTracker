import { useState, useContext } from "react";
import { Form, Button, Container, Card } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await register({ name, email, password }); // ✅ fixed
    if (success) {
      toast.success("Registration successful!");
      setTimeout(() => navigate("/login"), 1500);
    } else {
      toast.error("Registration failed!");
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
      <Card className="p-4 shadow" style={{ width: "100%", maxWidth: "400px" }}>
        <h3 className="text-center mb-4">Register</h3>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="name" className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control type="text" value={name} required onChange={(e) => setName(e.target.value)} />
          </Form.Group>

          <Form.Group controlId="email" className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" value={email} required onChange={(e) => setEmail(e.target.value)} />
          </Form.Group>

          <Form.Group controlId="password" className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" value={password} required onChange={(e) => setPassword(e.target.value)} />
          </Form.Group>

          <Button type="submit" variant="success" className="w-100">Register</Button>
        </Form>
      </Card>
    </Container>
  );
}

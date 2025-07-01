import { useState } from "react";
import { Container, Card, Form, Button } from "react-bootstrap";
import axios from "../api";
import { useNavigate } from "react-router-dom";

function AddTransaction() {
  const [form, setForm] = useState({
    amount: "",
    type: "Expense",
    category: "",
    date: "",
    description: ""
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post("/transactions", form);
    navigate("/dashboard");
  };

  return (
    <Container className="mt-5 d-flex justify-content-center">
      <Card className="p-4 shadow" style={{ width: "100%", maxWidth: "600px" }}>
        <h3 className="text-center mb-3">Add Transaction</h3>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Amount</Form.Label>
            <Form.Control type="number" name="amount" required value={form.amount} onChange={handleChange} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Type</Form.Label>
            <Form.Select name="type" value={form.type} onChange={handleChange}>
              <option>Income</option>
              <option>Expense</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Category</Form.Label>
            <Form.Control type="text" name="category" required value={form.category} onChange={handleChange} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Date</Form.Label>
            <Form.Control type="date" name="date" required value={form.date} onChange={handleChange} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control type="text" name="description" required value={form.description} onChange={handleChange} />
          </Form.Group>

          <Button type="submit" variant="primary" className="w-100">Add Transaction</Button>
        </Form>
      </Card>
    </Container>
  );
}

export default AddTransaction;

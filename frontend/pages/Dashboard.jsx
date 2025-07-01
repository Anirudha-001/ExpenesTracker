import { useEffect, useState, useContext } from "react";
import { Container, Row, Col, Card, Table, Button } from "react-bootstrap";
import axios from "../api";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";

export default function Dashboard() {
  const [summary, setSummary] = useState({ income: 0, expense: 0, total: 0 });
  const [transactions, setTransactions] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    axios.get("/transactions/summary").then((res) => setSummary(res.data));
    axios.get("/transactions").then((res) => setTransactions(res.data));
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/transactions/${id}`);
      setTransactions((prev) => prev.filter((t) => t._id !== id));
      toast.success("Transaction deleted!");
    } catch (err) {
      toast.error("Failed to delete transaction");
    }
  };

  return (
    <Container className="my-4">
      <h3 className="mb-4 fw-bold text-primary">Welcome, {user?.name}</h3>

      <Row className="mb-4">
        <Col md={4}>
          <Card className="dashboard-card income shadow-sm border-0 rounded-4 p-3">
            <h6 className="text-success fw-bold">Total Income</h6>
            <h3>₹ {summary.income}</h3>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="dashboard-card expense shadow-sm border-0 rounded-4 p-3">
            <h6 className="text-danger fw-bold">Total Expense</h6>
            <h3>₹ {summary.expense}</h3>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="dashboard-card balance shadow-sm border-0 rounded-4 p-3">
            <h6 className="text-primary fw-bold">Balance</h6>
            <h3>₹ {summary.total}</h3>
          </Card>
        </Col>
      </Row>

      <Card className="p-4 shadow-sm border-0 rounded-4">
        <h5 className="mb-4 fw-semibold text-dark">📋 Recent Transactions</h5>

        {transactions.length === 0 ? (
          <p className="text-muted">No transactions yet.</p>
        ) : (
          <Table responsive bordered hover>
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Amount</th>
                <th>Category</th>
                <th>Type</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx._id}>
                  <td>{new Date(tx.date).toLocaleDateString()}</td>
                  <td>{tx.description}</td>
                  <td className={tx.type === "Income" ? "text-success fw-bold" : "text-danger fw-bold"}>
                    ₹ {tx.amount}
                  </td>
                  <td>
                    <span className="badge bg-info text-dark">{tx.category}</span>
                  </td>
                  <td>{tx.type}</td>
                  <td>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDelete(tx._id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card>
    </Container>
  );
}


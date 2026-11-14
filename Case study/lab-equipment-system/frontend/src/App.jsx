import { useCallback, useEffect, useState } from "react";
import "./style.css";

const API = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "") + "/api";

const emptyForm = {
  equipmentCode: "",
  name: "",
  category: "",
  unitCost: "",
  quantity: "",
  supplier: "",
  lab: ""
};

const labels = {
  equipmentCode: "Equipment Code",
  name: "Equipment Name",
  category: "Category",
  unitCost: "Unit Cost (₹)",
  quantity: "Quantity",
  supplier: "Supplier",
  lab: "Lab / Location"
};

const money = (n) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n || 0);

// Small helper: calls the API and turns failures into readable errors
async function request(path, options) {
  let response;
  try {
    response = await fetch(`${API}${path}`, options);
  } catch {
    throw new Error("Cannot reach the server. Check that the backend is running.");
  }
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || "Request failed");
  return data;
}

export default function App() {
  const [items, setItems] = useState([]);
  const [summary, setSummary] = useState([]);
  const [overview, setOverview] = useState({ totalEquipment: 0, totalUnits: 0, inventoryValue: 0 });
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState(null); // { type: "ok" | "error", text }
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  const refresh = useCallback(async () => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (categoryFilter) params.set("category", categoryFilter);
    const [list, report, totals] = await Promise.all([
      request(`/equipment?${params.toString()}`),
      request("/reports/category-summary"),
      request("/reports/overview")
    ]);
    setItems(list);
    setSummary(report);
    setOverview(totals);
  }, [search, categoryFilter]);

  useEffect(() => {
    refresh().catch((err) => setMessage({ type: "error", text: err.message }));
  }, [refresh]);

  function handleChange(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const payload = { ...form, unitCost: Number(form.unitCost), quantity: Number(form.quantity) };
    try {
      await request(editingId ? `/equipment/${editingId}` : "/equipment", {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      setMessage({ type: "ok", text: editingId ? "Equipment updated" : "Equipment added" });
      setForm(emptyForm);
      setEditingId(null);
      await refresh();
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    }
  }

  function startEdit(item) {
    setEditingId(item._id);
    setForm({
      equipmentCode: item.equipmentCode,
      name: item.name,
      category: item.category,
      unitCost: String(item.unitCost),
      quantity: String(item.quantity),
      supplier: item.supplier,
      lab: item.lab
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
  }

  async function removeItem(id) {
    if (!window.confirm("Delete this equipment record?")) return;
    try {
      await request(`/equipment/${id}`, { method: "DELETE" });
      setMessage({ type: "ok", text: "Equipment deleted" });
      await refresh();
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    }
  }

  return (
    <main className="container">
      <h1>Department Laboratory Equipment Management</h1>
      <p className="subtitle">Track lab equipment, stock levels and inventory value.</p>

      {message && (
        <p role="status" className={`message ${message.type}`}>
          {message.text}
        </p>
      )}

      <section className="cards">
        <div className="card"><span>Equipment Types</span><strong>{overview.totalEquipment}</strong></div>
        <div className="card"><span>Total Units</span><strong>{overview.totalUnits}</strong></div>
        <div className="card"><span>Inventory Value</span><strong>{money(overview.inventoryValue)}</strong></div>
      </section>

      <h2>{editingId ? "Edit Equipment" : "Add Equipment"}</h2>
      <form onSubmit={handleSubmit}>
        {Object.keys(emptyForm).map((key) => (
          <label key={key}>
            {labels[key]}
            <input
              name={key}
              value={form[key]}
              onChange={handleChange}
              type={key === "unitCost" || key === "quantity" ? "number" : "text"}
              min={key === "unitCost" || key === "quantity" ? "0" : undefined}
              step={key === "unitCost" ? "0.01" : key === "quantity" ? "1" : undefined}
              required
            />
          </label>
        ))}
        <div className="actions">
          <button type="submit">{editingId ? "Update Equipment" : "Add Equipment"}</button>
          {editingId && (
            <button type="button" className="secondary" onClick={cancelEdit}>
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      <h2>Equipment Records</h2>
      <div className="filters">
        <input
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
          <option value="">All categories</option>
          {summary.map((row) => (
            <option key={row._id} value={row._id}>{row._id}</option>
          ))}
        </select>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Code</th><th>Name</th><th>Category</th><th>Unit Cost</th>
              <th>Qty</th><th>Supplier</th><th>Lab</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 && (
              <tr><td colSpan="8">No equipment found.</td></tr>
            )}
            {items.map((item) => (
              <tr key={item._id}>
                <td>{item.equipmentCode}</td>
                <td>{item.name}</td>
                <td>{item.category}</td>
                <td>{money(item.unitCost)}</td>
                <td>{item.quantity}</td>
                <td>{item.supplier}</td>
                <td>{item.lab}</td>
                <td>
                  <button onClick={() => startEdit(item)}>Edit</button>
                  <button className="danger" onClick={() => removeItem(item._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>Category-wise Inventory Summary</h2>
      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>Category</th><th>Equipment Count</th><th>Total Units</th><th>Inventory Value</th></tr>
          </thead>
          <tbody>
            {summary.map((row) => (
              <tr key={row._id}>
                <td>{row._id}</td>
                <td>{row.equipmentCount}</td>
                <td>{row.totalUnits}</td>
                <td>{money(row.inventoryValue)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}

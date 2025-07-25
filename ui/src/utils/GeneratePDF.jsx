import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const generatePDF = (order) => {
  const doc = new jsPDF();
  const { id, created_at, user, items, shipping_address } = order;

  const total = items.reduce(
    (acc, item) => acc + parseFloat(item.product.price) * item.quantity,
    0
  );

  // 🧾 Header
  doc.setFontSize(18);
  doc.text("Payment Receipt", 20, 20);

  doc.setFontSize(12);
  doc.text(`Order ID: ${id}`, 20, 35);
  doc.text(`Date: ${new Date(created_at).toLocaleString()}`, 20, 42);
  doc.text(`Customer Email: ${user?.email}`, 20, 49);

  // 📦 Product Table
  const tableData = items.map((item, index) => [
    index + 1,
    item.product.name,
    item.quantity,
    `₹${item.product.price}`,
    `₹${(item.quantity * parseFloat(item.product.price)).toFixed(2)}`
  ]);

  autoTable(doc, {
    startY: 60,
    head: [["#", "Product", "Qty", "Price", "Subtotal"]],
    body: tableData,
  });

  // 💳 Total
  let finalY = doc.lastAutoTable?.finalY || 80;
  doc.setFontSize(13);
  doc.text(`Total Amount: ₹${total.toFixed(2)}`, 20, finalY + 10);

  // 🏠 Shipping Address
  if (shipping_address) {
    doc.setFontSize(12);
    doc.text("Shipping Address:", 20, finalY + 25);

    const addressLines = [
      shipping_address.full_name,
      shipping_address.phone_number,
      shipping_address.address_line1,
      shipping_address.address_line2,
      `${shipping_address.city}, ${shipping_address.state} - ${shipping_address.postal_code}`,
      shipping_address.country,
    ];

    addressLines.forEach((line, index) => {
      doc.text(line, 20, finalY + 32 + index * 7);
    });
  }

  // 🧾 Save PDF
  doc.save(`receipt-order-${id}.pdf`);
};

export default generatePDF;

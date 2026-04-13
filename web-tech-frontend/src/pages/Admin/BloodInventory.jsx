import { useEffect, useState } from "react";
import api from "../../services/api";
import Card from "../../components/cards/admin/Card";
import BloodCard from "../../components/cards/admin/BloodCard";

export default function BloodInventory() {
  const [bloodData, setBloodData] = useState([]);
  const [summary, setSummary] = useState({
    totalUnits: 0,
    lowStockCount: 0,
    normalStockCount: 0,
    highStockCount: 0,
  });
  const [pendingUnits, setPendingUnits] = useState(0);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchInventory = async () => {
    try {
      const res = await api.get("/inventory/summary");
      const data = res.data;

      setSummary(
        data.summary || {
          totalUnits: 0,
          lowStockCount: 0,
          normalStockCount: 0,
          highStockCount: 0,
        }
      );

      setPendingUnits(data.pending?.units || 0);
      setLastUpdated(data.lastUpdated || null);

      const mappedBlood = (data.bloodTypes || []).map((b) => ({
        type: b.bloodType,
        units: b.units,
        status: b.status,
      }));

      setBloodData(mappedBlood);
    } catch (error) {
      console.error("Failed to fetch inventory:", error);

      // keep cards visible even if request fails
      setSummary({
        totalUnits: 0,
        lowStockCount: 0,
        normalStockCount: 0,
        highStockCount: 0,
      });
      setPendingUnits(0);
      setLastUpdated(null);
      setBloodData([
        { type: "A+", units: 0, status: "low" },
        { type: "A-", units: 0, status: "low" },
        { type: "B+", units: 0, status: "low" },
        { type: "B-", units: 0, status: "low" },
        { type: "AB+", units: 0, status: "low" },
        { type: "AB-", units: 0, status: "low" },
        { type: "O+", units: 0, status: "low" },
        { type: "O-", units: 0, status: "low" },
      ]);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

// ginawang 3xl and text(font)
  return (
    <div className="p-6 -ml-10">
      <h1 className="text-3xl font-bold">Blood Inventory</h1>
      <p className="text-gray-500 mb-6">
        Monitor and manage available blood supply
      </p>

      {/* SUMMARY */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card
          type="total"
          title="Blood Units"
          value={summary.totalUnits}
          subtitle="Total inventory"
          color="bg-[linear-gradient(135deg,#FF6971,#FF656E,#FF616B,#FF5D68,#FF5965,#FB515F,#F64859,#F23F53,#EE354E,#E92A48,#E51B42)]"
        />

        <Card
          type="low"
          title="Low Stock"
          value={summary.lowStockCount}
          subtitle="Types need restock"
          color="bg-[linear-gradient(135deg,#DC2626,#D92525,#D52323,#D22222,#CF2121,#CB1F1F,#C81E1E,#C11E1E,#BA1D1D,#B41D1D,#AD1D1C)]"
        />

        <Card
          type="normal"
          title="Normal Stock"
          value={summary.normalStockCount}
          subtitle="Types at normal level"
          color="bg-[linear-gradient(135deg,#F59E0B,#F1980A,#ED9309,#E98D09,#E58808,#E18207,#DD7D07,#D97706)]"
        />

        <Card
          type="high"
          title="High Stock"
          value={summary.highStockCount}
          subtitle="Types well stocked"
          color="bg-[linear-gradient(135deg,#10B981,#0EB47E,#0DAF7A,#0BAA77,#09A573,#08A070,#069B6C,#059669)]"
        />
      </div>

      {/* HEADER */}
      <div className="flex items-center gap-3 mb-3">
        <h2 className="font-semibold text-lg">Blood Type Inventory</h2>
        <span className="text-sm text-gray-400">{bloodData.length} types</span>

        <span className="ml-2 text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-md font-medium">
          {pendingUnits} pending
        </span>
      </div>

      {/* GRID */}
      {/* ito bago div */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {bloodData.map((blood, index) => (
          <BloodCard key={index} {...blood} />
        ))}

        {/* PENDING CARD */}
        {/* ito bago div */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-blue-400 flex flex-col justify-between min-h-[200px]">
          <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-blue-100 text-blue-600 mb-3">
            🧪
          </div>

          <h3 className="font-semibold">Pending Classification</h3>
          <p className="text-xs text-gray-400 mb-3">
            Awaiting lab results
          </p>

          <p className="text-xs text-gray-400 uppercase">
            Units in Process
          </p>

          <div className="flex items-baseline gap-1 mt-1">
            <p className="text-3xl font-bold text-blue-600">{pendingUnits}</p>
            <span className="text-gray-400 text-sm">units</span>
          </div>

          <div className="border-t my-4"></div>

          <p className="text-xs text-gray-400">
            ⏱ Updated{" "}
            {lastUpdated
              ? new Date(lastUpdated).toLocaleDateString("en-GB")
              : "—"}
          </p>
        </div>
      </div>
    </div>
  );
}
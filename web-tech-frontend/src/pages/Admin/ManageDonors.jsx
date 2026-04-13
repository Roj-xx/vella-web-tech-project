import { FiEye, FiEdit, FiTrash, FiSearch } from "react-icons/fi";
import { useState, useEffect } from "react";
import api from "../../services/api";
import ViewDonorModal from "../../components/modals/admin/ViewDonorModal";
import AddDonorModal from "../../components/modals/admin/AddDonorModal";
import EditDonorModal from "../../components/modals/admin/EditDonorModal";
import DeleteDonorModal from "../../components/modals/admin/DeleteDonorModal";

const ManageDonors = () => {
  const [donors, setDonors] = useState([]);
  const [counts, setCounts] = useState({complete: 0,incomplete: 0,});
  const [activeTab, setActiveTab] = useState("complete");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [bloodFilter, setBloodFilter] = useState("all");
  const [selectedDonor, setSelectedDonor] = useState(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editingDonor, setEditingDonor] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingDonor, setDeletingDonor] = useState(null);

  const fetchDonors = async () => {
    try {
      const params = {
        search: search || undefined,
        bloodType: bloodFilter !== "all" ? bloodFilter : undefined,
        isProfileComplete: activeTab === "complete" ? true : false,
        page: 1,
        limit: 50,
      };

      const response = await api.get("/donors", { params });

      setDonors(response.data.data);
    } catch (error) {
      console.error("Failed to fetch donors:", error);
    }
  };
  const fetchCounts = async () => {
    try {
      const completeRes = await api.get("/donors", {
        params: { isProfileComplete: true, page: 1, limit: 1 },
      });

      const incompleteRes = await api.get("/donors", {
        params: { isProfileComplete: false, page: 1, limit: 1 },
      });

      setCounts({
        complete: completeRes.data.totalItems,
        incomplete: incompleteRes.data.totalItems,
      });

    } catch (error) {
      console.error("Failed to fetch counts:", error);
    }
  };
  const [formData, setFormData] = useState({
    name: "",
    blood: "",
    contact: "",
    address: "",
    date: "",
  });

  useEffect(() => {
    fetchDonors();
  }, [search, bloodFilter, activeTab]);
  useEffect(() => {
    fetchCounts();
  }, []);
  const handleChange = (e) => {
  const { name, value } = e.target;

  setFormData((prev) => ({
    ...prev,
    [name]: value,
  }));
};

  const handleBloodChange = (e) => {
  const { value } = e.target;

  setFormData((prev) => ({
    ...prev,
    blood: value,
  }));
};

  const handleAddDonor = async () => {
    if (!formData.name) return;

    try {
      await api.post("/donors/manual", {
        fullName: formData.name,
        bloodType: formData.blood || "unknown",
        contactNumber: formData.contact,
        address: formData.address,
        lastDonationDate: formData.date,
      });

      fetchDonors();

      setFormData({
        name: "",
        blood: "",
        contact: "",
        address: "",
        date: "",
      });

      setShowModal(false);

    } catch (error) {
      console.error("Failed to add donor:", error);
    }
  };

  // ✅ ADDED VIEW FUNCTION
  const handleView = (donor) => {
    setSelectedDonor(donor);
    setViewOpen(true);
  };

  const handleEdit = (donor) => {
    setEditingDonor(donor);
    setFormData({
      name: donor.displayName || "",
      blood: donor.bloodType || "",
      contact: donor.contactNumber || "",
      address: donor.address || "",
      date: donor.lastDonationDate || "",
    });
    setEditOpen(true);
  };

const handleDeleteClick = (donor) => {
  setDeletingDonor(donor);
  setDeleteOpen(true);
};

const handleUpdateDonor = async () => {
  try {
    await api.put(`/donors/${editingDonor._id}`, {
      fullName: formData.name,
      bloodType: formData.blood,
      contactNumber: formData.contact,
      address: formData.address,
      lastDonationDate: formData.date,
    });

    fetchDonors();
    setEditOpen(false);

  } catch (error) {
    console.error("Failed to update donor:", error);
  }
};

const handleConfirmDelete = async () => {
  try {
    await api.delete(`/donors/${deletingDonor._id}`);

    fetchDonors();
    setDeleteOpen(false);

  } catch (error) {
    console.error("Failed to delete donor:", error);
  }
};

  
// add ng p-6, font ginawang bold - ml-10
  return (
    <div className="space-y-6 p-6 -ml-10"> 

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Manage Donors
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Manage donor profiles and track completion status
        </p>
      </div>

      {/* CONTROL BAR  ginawang sticky div classname lang ang bago div*/}
      <div className="sticky top-0 z-10 bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-wrap items-center gap-3">
        {/* ito bago div */}
        <div className="flex items-center gap-2 flex-1 min-w-[180px] border border-gray-200 rounded-xl px-3 py-2">
          <FiSearch className="text-gray-400" />
          <input
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 outline-none text-sm"
          />
        </div>

        <select
          value={bloodFilter}
          onChange={(e) => setBloodFilter(e.target.value)}
          // ito bago className
          className="border border-gray-200 rounded-xl px-4 py-2 text-sm text-gray-600 outline-none min-w-[140px]"
        >
          <option value="all">All Blood Types</option>
          <option value="O+">O+</option>
          <option value="O-">O-</option>
          <option value="A+">A+</option>
          <option value="A-">A-</option>
          <option value="B+">B+</option>
          <option value="B-">B-</option>
          <option value="AB+">AB+</option>
          <option value="AB-">AB-</option>
        </select>

        <button
          onClick={() => setShowModal(true)}
          // ito bago className
          className="bg-gradient-to-r from-[#FF6971] to-[#E0003C] text-white px-4 sm:px-6 py-2 rounded-xl font-medium shadow-sm whitespace-nowrap"
        >
          + Add Donor
        </button>
      </div>

      {/* TABLE */}
      {/* ito bago div */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-x-auto">

        <div className="flex">
          <button
            onClick={() => setActiveTab("complete")}
            className={`flex-1 py-3 text-center text-sm font-semibold ${
              activeTab === "complete"
                ? "text-[#E0003C] border-b-2 border-[#E0003C] bg-[#FDECEC]"
                : "text-gray-500 border-b"
            }`}
          >
            List of Donors ({counts.complete})
          </button>

          <button
            onClick={() => setActiveTab("incomplete")}
            className={`flex-1 py-3 text-center text-sm font-semibold ${
              activeTab === "incomplete"
                ? "text-[#E0003C] border-b-2 border-[#E0003C] bg-[#FDECEC]"
                : "text-gray-500 border-b"
            }`}
          >
            Incomplete Profiles ({counts.incomplete})
          </button>
        </div>
        {/* ito bago table */}
        <table className="w-full min-w-[900px] text-sm">
          <thead className="bg-[#F9FAFB] text-gray-500 uppercase text-xs tracking-wide">
            <tr>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Blood Type</th>
              <th className="p-4 text-left">Contact Number</th>
              <th className="p-4 text-left">Address</th>
              <th className="p-4 text-left">Last Donation</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {donors.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-10 text-gray-400">
                  No result Found
                </td>
              </tr>
            ) : (
              donors.map((d) => (
                <tr key={d._id} className="border-t border-gray-200">
                  {/* ito bago td */}
                  <td className="p-4 flex items-center gap-3 min-w-[200px]">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#FF6971] to-[#E0003C] text-white flex items-center justify-center font-semibold">
                      {d.displayName.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div>
                      {/* ito bago p */}
                      <p className="font-semibold text-gray-800 truncate max-w-[140px]">{d.displayName}</p>
                      <p className="text-xs text-gray-400">{d.email}</p>
                    </div>
                  </td>

                  <td className="p-4">
                    {d.bloodType ? (
                      <span className="px-2 sm:px-3 py-1 rounded-lg text-[10px] sm:text-xs font-semibold bg-[#FDECEC] text-[#E0003C] whitespace-nowrap">
                        {d.bloodType}
                      </span>
                    ) : (
                      <span className="text-gray-400 text-xs">Not Set</span>
                    )}
                  </td>
                  {/* ito bago td */}
                  <td className="p-4 text-gray-700 whitespace-nowrap">
                    {d.contactNumber || <span className="text-gray-400 text-xs">Not Provided</span>}
                  </td>
                  {/* ito bago td */}
                  <td className="p-4 text-gray-700 max-w-[180px] truncate">
                    {d.address || <span className="text-gray-400 text-xs">Not Provided</span>}
                  </td>

                  <td className="p-4 text-gray-700">
                    {d.lastDonationDate ? (
                      new Date(d.lastDonationDate).toLocaleDateString("en-GB")
                    ) : (
                      <span className="text-gray-400 text-xs">No Record</span>
                    )}
                  </td>
                  {/* ito bago td */}
                  <td className="p-4 flex gap-3 sm:gap-4 shrink-0 whitespace-nowrap">
                    <FiEye 
                      className="text-blue-500 cursor-pointer" 
                      onClick={() => handleView(d)}
                    /><FiEdit
                      className="text-gray-500 cursor-pointer"
                      onClick={() => handleEdit(d)}
                    />
                    <FiTrash
                    className="text-red-500 cursor-pointer"
                    onClick={() => handleDeleteClick(d)}
                  />
                  </td>

                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ✅ ADD MODAL */}
      <AddDonorModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        formData={formData}
        handleChange={handleChange}
        handleBloodChange={handleBloodChange}
        handleSubmit={handleAddDonor}
      />

      {/* ✅ VIEW MODAL */}
      <ViewDonorModal
        isOpen={viewOpen}
        onClose={() => setViewOpen(false)}
        donor={selectedDonor}
      />

      {/* ✅ EDIT MODAL (MOVE HERE INSIDE) */}
      <EditDonorModal
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        formData={formData}
        handleChange={handleChange}
        handleBloodChange={handleBloodChange}
        handleSubmit={handleUpdateDonor}
      />

      <DeleteDonorModal
      isOpen={deleteOpen}
      onClose={() => setDeleteOpen(false)}
      donor={deletingDonor}
      onConfirm={handleConfirmDelete}
    />

    </div>
    
  );
};

export default ManageDonors;
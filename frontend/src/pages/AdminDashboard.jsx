import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { useAdmin } from "../context/AdminContext";
import { useSocket } from "../context/SocketContext";
import { toast } from "react-toastify";
import {
  StatCard,
  AdminHeader,
  FilterGroup,
  UserTableRow,
  UserCard,
  Pagination,
  Modal,
  Loading,
  UserProfile,
  DetailCard,
  EmptyState,
  UserSummary,
  DateDisplay,
} from "../components/ui";
import { useDashboardStats } from "../hooks/useDashboardStats";
import { useFilteredUsers } from "../hooks/useFilteredUsers";
import { usePagination } from "../hooks/usePagination";
import "../styles/AdminDashboard.css";

const AdminDashboard = React.memo(() => {
  const { user } = useAuth();
  const {
    users,
    loading,
    stats: adminStats,
    getUsers,
    getStats,
    updateUserStatus,
    banUser,
    unbanUser,
  } = useAdmin();
  const { connected } = useSocket();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showBanModal, setShowBanModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [banReason, setBanReason] = useState("");
  const [viewMode, setViewMode] = useState("table");

  useEffect(() => {
    if (!loading) {
      getUsers();
      getStats();
    }
  }, []);
  // Custom hooks for business logic
  const dashboardStats = useDashboardStats(users);
  const filteredAndSortedUsers = useFilteredUsers(
    users, 
    searchTerm, 
    statusFilter, 
    roleFilter, 
    sortBy, 
    sortOrder
  );
  const { paginatedItems: paginatedUsers, totalPages } = usePagination(
    filteredAndSortedUsers, 
    currentPage, 
    itemsPerPage
  );

  const handleBanUser = useCallback(
    async (userId, reason) => {
      try {
        const userToBan = users.find((u) => u._id === userId);
        if (userToBan?.role === "admin") {
          toast.error("Cannot ban admin users");
          setShowBanModal(false);
          setSelectedUser(null);
          setBanReason("");
          return;
        }

        await banUser(userId, reason || banReason);
        toast.success("User banned successfully");
        setShowBanModal(false);
        setSelectedUser(null);
        setBanReason("");
        getUsers();
      } catch (error) {
        toast.error("Failed to ban user");
      }
    },
    [users, banUser, banReason, getUsers]
  );

  const handleUnbanUser = useCallback(
    async (userId) => {
      try {
        await unbanUser(userId);
        toast.success("User unbanned successfully");
        getUsers();
      } catch (error) {
        toast.error("Failed to unban user");
      }
    },
    [unbanUser, getUsers]
  );

  const handleStatusChange = useCallback(
    async (userId, newStatus) => {
      try {
        await updateUserStatus(userId, newStatus);
        toast.success("User status updated");
        getUsers();
      } catch (error) {
        toast.error("Failed to update user status");
      }
    },
    [updateUserStatus, getUsers]
  );

  const resetFilters = useCallback(() => {
    setSearchTerm("");
    setStatusFilter("all");
    setRoleFilter("all");
    setSortBy("name");
    setSortOrder("asc");
    setCurrentPage(1);
  }, []);

  const closeModals = useCallback(() => {
    setShowBanModal(false);
    setShowUserModal(false);
    setSelectedUser(null);
    setBanReason("");
  }, []);

  const handleViewDetails = useCallback((user) => {
    setSelectedUser(user);
    setShowUserModal(true);
  }, []);

  const handleBanUserModal = useCallback((user) => {
    setSelectedUser(user);
    setShowBanModal(true);
  }, []);

  const refreshData = useCallback(() => {
    getUsers();
    getStats();
  }, [getUsers, getStats]);

  if (loading) {
    return <Loading fullScreen text="Loading admin dashboard..." />;
  }

  return (
    <div
      className="container-fluid py-4"
      style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        minHeight: "100vh",
      }}
    >
      <div className="row mb-4">
        <div className="col-12">
          <AdminHeader
            title="Admin Dashboard"
            user={user}
            stats={dashboardStats}
            connected={connected}
            onRefresh={refreshData}
          />
        </div>
      </div>

      <div className="row g-4 mb-4">
        <StatCard
          icon="bi bi-people"
          iconBg="primary"
          value={dashboardStats.total}
          title="Total Users"
          subtitle={
            dashboardStats.newThisMonth > 0 ? (
              <>
                <i className="bi bi-arrow-up me-1"></i>+
                {dashboardStats.newThisMonth} this month
              </>
            ) : null
          }
          progressValue={100}
          progressColor="primary"
        />

        <StatCard
          icon="bi bi-person-check"
          iconBg="success"
          value={dashboardStats.active}
          title="Active Users"
          subtitle={
            dashboardStats.total > 0
              ? `${Math.round(
                  (dashboardStats.active / dashboardStats.total) * 100
                )}% of total`
              : null
          }
          progressValue={
            dashboardStats.total > 0
              ? (dashboardStats.active / dashboardStats.total) * 100
              : 0
          }
          progressColor="success"
        />

        <StatCard
          icon="bi bi-person-dash"
          iconBg="warning"
          value={dashboardStats.inactive}
          title="Inactive Users"
          subtitle={
            dashboardStats.total > 0
              ? `${Math.round(
                  (dashboardStats.inactive / dashboardStats.total) * 100
                )}% of total`
              : null
          }
          progressValue={
            dashboardStats.total > 0
              ? (dashboardStats.inactive / dashboardStats.total) * 100
              : 0
          }
          progressColor="warning"
        />

        <StatCard
          icon="bi bi-person-x text-danger"
          iconBg="danger"
          value={dashboardStats.banned}
          title="Banned Users"
          subtitle={
            dashboardStats.banned > 0 ? (
              <>
                <i className="bi bi-exclamation-triangle me-1"></i>
                Requires attention
              </>
            ) : (
              <>
                <i className="bi bi-check-circle me-1"></i>
                All clear
              </>
            )
          }
          progressValue={
            dashboardStats.banned > 0
              ? Math.min(
                  (dashboardStats.banned / dashboardStats.total) * 100,
                  100
                )
              : 5
          }
          progressColor="danger"
        />
      </div>

      <div className="row mb-4">
        <div className="col-12">
          <FilterGroup
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
            roleFilter={roleFilter}
            onRoleChange={setRoleFilter}
            sortBy={sortBy}
            onSortChange={setSortBy}
            sortOrder={sortOrder}
            onSortOrderChange={setSortOrder}
            onResetFilters={resetFilters}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            itemsPerPage={itemsPerPage}
            onItemsPerPageChange={(value) => {
              setItemsPerPage(value);
              setCurrentPage(1);
            }}
          />
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white border-bottom">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">
                  Users Management ({filteredAndSortedUsers.length} users)
                </h5>
              </div>
            </div>

            <div className="card-body p-0">
              {paginatedUsers.length > 0 ? (
                viewMode === "table" ? (
                  <div className="table-responsive">
                    <table className="table table-hover mb-0">
                      <thead className="table-light">
                        <tr>
                          <th>User</th>
                          <th>Status</th>
                          <th>Role</th>
                          <th>Joined</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedUsers.map((user) => (
                          <UserTableRow
                            key={user._id}
                            user={user}
                            onBanUser={handleBanUserModal}
                            onUnbanUser={handleUnbanUser}
                            onViewDetails={handleViewDetails}
                          />
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="p-3">
                    <div className="row g-3">
                      {paginatedUsers.map((user) => (
                        <UserCard
                          key={user._id}
                          user={user}
                          onBanUser={handleBanUserModal}
                          onUnbanUser={handleUnbanUser}
                          onViewDetails={handleViewDetails}
                        />
                      ))}
                    </div>
                  </div>
                )
              ) : (
                <EmptyState
                  icon="bi-people"
                  title="No users found"
                  description="Try adjusting your search criteria"
                />
              )}
            </div>

            {totalPages > 1 && (
              <div className="card-footer bg-light">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  totalItems={filteredAndSortedUsers.length}
                  itemsPerPage={itemsPerPage}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <Modal
        isOpen={showBanModal}
        onClose={closeModals}
        title={
          <>
            <i className="bi bi-exclamation-triangle text-warning me-2"></i>
            Ban User: {selectedUser?.name}
          </>
        }
        footer={
          <>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={closeModals}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => handleBanUser(selectedUser?._id, banReason)}
            >
              <i className="bi bi-lock me-1"></i>
              Confirm Ban
            </button>
          </>
        }
      >
        <div className="alert alert-warning">
          <i className="bi bi-info-circle me-2"></i>
          <strong>Warning:</strong> This action will ban the user from accessing
          the system. You can unban them later if needed.
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleBanUser(selectedUser?._id, banReason);
          }}
        >
          <div className="mb-3">
            <label htmlFor="banReason" className="form-label">
              Reason for ban (optional):
            </label>
            <textarea
              className="form-control"
              id="banReason"
              rows="3"
              value={banReason}
              onChange={(e) => setBanReason(e.target.value)}
              placeholder="Enter the reason for banning this user..."
            ></textarea>
          </div>
          <UserSummary user={selectedUser} />
        </form>
      </Modal>

      <Modal
        isOpen={showUserModal && selectedUser}
        onClose={closeModals}
        title={`User Details: ${selectedUser?.name}`}
        size="lg"
      >
        {selectedUser && (
          <div className="row g-4">
            <div className="col-md-4">
              <UserProfile
                user={selectedUser}
                layout="vertical"
                avatarSize="xl"
                showBadges={true}
              />
            </div>
            <div className="col-md-8">
              <div className="row g-3">
                <div className="col-6">
                  <DetailCard
                    icon="bi-calendar-plus"
                    iconColor="success"
                    label="Joined Date"
                    value={
                      <DateDisplay
                        date={selectedUser.createdAt}
                        format="long"
                        className="text-muted small"
                      />
                    }
                  />
                </div>
                <div className="col-6">
                  <DetailCard
                    icon="bi-person-badge"
                    iconColor="primary"
                    label="User ID"
                    value={
                      <small className="text-muted font-monospace">
                        {selectedUser._id?.slice(-8)}...
                      </small>
                    }
                  />
                </div>
              </div>
              {selectedUser.status === "banned" && (
                <div className="alert alert-danger mt-3">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  <strong>User Banned:</strong> This user is currently banned
                  from the system.
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
});

export default AdminDashboard;
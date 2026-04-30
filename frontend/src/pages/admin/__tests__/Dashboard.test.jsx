import React from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import AdminDashboard from "../Dashboard";

const renderDashboard = () => render(<AdminDashboard />);

// ── Helpers ────────────────────────────────────────────────────────────────────

const openAddModal = async () => {
  await userEvent.click(screen.getByRole("button", { name: /add user/i }));
};

const fillForm = async ({ firstName = "Jane", lastName = "Doe", email = "jane@example.com", role = "Applicant" } = {}) => {
  await userEvent.clear(screen.getByPlaceholderText("Jane"));
  if (firstName.trim()) await userEvent.type(screen.getByPlaceholderText("Jane"), firstName);
  await userEvent.clear(screen.getByPlaceholderText("Doe"));
  if (lastName.trim()) await userEvent.type(screen.getByPlaceholderText("Doe"), lastName);
  await userEvent.clear(screen.getByPlaceholderText("jane.doe@example.com"));
  if (email) await userEvent.type(screen.getByPlaceholderText("jane.doe@example.com"), email);
  await userEvent.selectOptions(screen.getByRole("combobox"), role);
};

// Scoped to the modal to avoid matching the header "Add User" button
const submitModal = async () => {
  const modal = screen.getByTestId("user-modal");
  await userEvent.click(within(modal).getByRole("button", { name: /^(add user|save changes)$/i }));
};

// ── Tests ──────────────────────────────────────────────────────────────────────

describe("AdminDashboard", () => {

  // ── Initial render ──────────────────────────────────────────────────────────

  describe("initial render", () => {
    it("renders the page heading", () => {
      renderDashboard();
      expect(screen.getByText("User Management")).toBeInTheDocument();
    });

    it("renders all 6 seed users by default", () => {
      renderDashboard();
      expect(screen.getAllByRole("row")).toHaveLength(7); // 1 header + 6 data
    });

    it("renders filter tabs for All, Admin, Employee, Applicant", () => {
      renderDashboard();
      ["All", "Admin", "Employee", "Applicant"].forEach((label) => {
        expect(screen.getByRole("button", { name: new RegExp(label) })).toBeInTheDocument();
      });
    });

    it("shows correct counts on filter tabs", () => {
      renderDashboard();
      expect(screen.getByRole("button", { name: /all/i })).toHaveTextContent("6");
      expect(screen.getByRole("button", { name: /^admin/i })).toHaveTextContent("2");
      expect(screen.getByRole("button", { name: /employee/i })).toHaveTextContent("2");
      expect(screen.getByRole("button", { name: /applicant/i })).toHaveTextContent("2");
    });

    it("shows locked badge for locked users", () => {
      renderDashboard();
      expect(screen.getAllByText(/locked/i)).toHaveLength(2); // Carol and Eva
    });

    it("shows active badge for unlocked users", () => {
      renderDashboard();
      expect(screen.getAllByText(/active/i)).toHaveLength(4);
    });
  });

  // ── Filter tabs ─────────────────────────────────────────────────────────────

  describe("filter tabs", () => {
    it("filters to only Admin users", async () => {
      renderDashboard();
      await userEvent.click(screen.getByRole("button", { name: /^admin/i }));
      expect(screen.getByText("Alice Johnson")).toBeInTheDocument();
      expect(screen.getByText("Frank Miller")).toBeInTheDocument();
      expect(screen.queryByText("Bob Smith")).not.toBeInTheDocument();
    });

    it("filters to only Employee users", async () => {
      renderDashboard();
      await userEvent.click(screen.getByRole("button", { name: /employee/i }));
      expect(screen.getByText("Bob Smith")).toBeInTheDocument();
      expect(screen.getByText("Eva Davis")).toBeInTheDocument();
      expect(screen.queryByText("Alice Johnson")).not.toBeInTheDocument();
    });

    it("filters to only Applicant users", async () => {
      renderDashboard();
      await userEvent.click(screen.getByRole("button", { name: /applicant/i }));
      expect(screen.getByText("Carol White")).toBeInTheDocument();
      expect(screen.getByText("David Brown")).toBeInTheDocument();
      expect(screen.queryByText("Bob Smith")).not.toBeInTheDocument();
    });

    it("shows all users again when All tab is clicked", async () => {
      renderDashboard();
      await userEvent.click(screen.getByRole("button", { name: /employee/i }));
      await userEvent.click(screen.getByRole("button", { name: /all/i }));
      expect(screen.getAllByRole("row")).toHaveLength(7);
    });

    it("updates the footer count when filtered", async () => {
      renderDashboard();
      await userEvent.click(screen.getByRole("button", { name: /^admin/i }));
      expect(screen.getByText(/showing 2 of 6/i)).toBeInTheDocument();
    });
  });

  // ── Add user ────────────────────────────────────────────────────────────────

  describe("add user modal", () => {
    it("opens the add modal when Add User is clicked", async () => {
      renderDashboard();
      await openAddModal();
      expect(screen.getByText("Add New User")).toBeInTheDocument();
    });

    it("closes the modal when Cancel is clicked", async () => {
      renderDashboard();
      await openAddModal();
      await userEvent.click(within(screen.getByTestId("user-modal")).getByRole("button", { name: /cancel/i }));
      expect(screen.queryByText("Add New User")).not.toBeInTheDocument();
    });

    it("closes the modal when X is clicked", async () => {
      renderDashboard();
      await openAddModal();
      await userEvent.click(within(screen.getByTestId("user-modal")).getByRole("button", { name: "" }));
      expect(screen.queryByText("Add New User")).not.toBeInTheDocument();
    });

    it("adds a new user and shows them in the table", async () => {
      renderDashboard();
      await openAddModal();
      await fillForm({ firstName: "Jane", lastName: "Doe", email: "jane@example.com", role: "Applicant" });
      await submitModal();

      expect(screen.queryByText("Add New User")).not.toBeInTheDocument();
      expect(screen.getByText("Jane Doe")).toBeInTheDocument();
      expect(screen.getByText("jane@example.com")).toBeInTheDocument();
    });

    it("increments the All count after adding a user", async () => {
      renderDashboard();
      await openAddModal();
      await fillForm();
      await submitModal();

      expect(screen.getByRole("button", { name: /all/i })).toHaveTextContent("7");
    });

    it("shows validation error when first name is empty", async () => {
      renderDashboard();
      await openAddModal();
      await fillForm({ firstName: " ", lastName: "Doe", email: "jane@example.com" });
      await submitModal();

      expect(screen.getByText("First name is required.")).toBeInTheDocument();
    });

    it("shows validation error when last name is empty", async () => {
      renderDashboard();
      await openAddModal();
      await fillForm({ firstName: "Jane", lastName: " ", email: "jane@example.com" });
      await submitModal();

      expect(screen.getByText("Last name is required.")).toBeInTheDocument();
    });

    it("shows validation error when email is empty", async () => {
      renderDashboard();
      await openAddModal();
      await fillForm({ firstName: "Jane", lastName: "Doe", email: "" });
      await submitModal();

      expect(screen.getByText("Email is required.")).toBeInTheDocument();
    });

    it("shows validation error for an invalid email format", async () => {
      renderDashboard();
      await openAddModal();
      await fillForm({ firstName: "Jane", lastName: "Doe", email: "not-an-email" });
      await submitModal();

      expect(screen.getByText("Enter a valid email address.")).toBeInTheDocument();
    });

    it("does not close modal when validation fails", async () => {
      renderDashboard();
      await openAddModal();
      await submitModal();

      expect(screen.getByText("Add New User")).toBeInTheDocument();
    });
  });

  // ── Edit user ───────────────────────────────────────────────────────────────

  describe("edit user modal", () => {
    it("opens the edit modal pre-filled with the user's data", async () => {
      renderDashboard();
      await userEvent.click(screen.getAllByTitle("Edit user")[0]); // Alice Johnson

      expect(screen.getByText("Edit User")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Jane")).toHaveValue("Alice");
      expect(screen.getByPlaceholderText("Doe")).toHaveValue("Johnson");
      expect(screen.getByPlaceholderText("jane.doe@example.com")).toHaveValue("alice@example.com");
    });

    it("saves edited user data back to the table", async () => {
      renderDashboard();
      await userEvent.click(screen.getAllByTitle("Edit user")[0]); // Alice Johnson

      const firstNameInput = screen.getByPlaceholderText("Jane");
      await userEvent.clear(firstNameInput);
      await userEvent.type(firstNameInput, "Alicia");
      await submitModal();

      expect(screen.queryByText("Edit User")).not.toBeInTheDocument();
      expect(screen.getByText("Alicia Johnson")).toBeInTheDocument();
      expect(screen.queryByText("Alice Johnson")).not.toBeInTheDocument();
    });

    it("does not save when validation fails in edit mode", async () => {
      renderDashboard();
      await userEvent.click(screen.getAllByTitle("Edit user")[0]);

      const emailInput = screen.getByPlaceholderText("jane.doe@example.com");
      await userEvent.clear(emailInput);
      await userEvent.type(emailInput, "bad-email");
      await submitModal();

      expect(screen.getByText("Enter a valid email address.")).toBeInTheDocument();
    });
  });

  // ── Delete user ─────────────────────────────────────────────────────────────

  describe("delete user", () => {
    it("opens a confirmation dialog when delete is clicked", async () => {
      renderDashboard();
      await userEvent.click(screen.getAllByTitle("Delete user")[0]);

      expect(screen.getByText("Delete User")).toBeInTheDocument();
      expect(screen.getByText(/this action cannot be undone/i)).toBeInTheDocument();
    });

    it("cancels deletion and keeps the user in the table", async () => {
      renderDashboard();
      await userEvent.click(screen.getAllByTitle("Delete user")[0]);
      await userEvent.click(screen.getByRole("button", { name: /cancel/i }));

      expect(screen.queryByText("Delete User")).not.toBeInTheDocument();
      expect(screen.getAllByRole("row")).toHaveLength(7);
    });

    it("confirms deletion and removes the user from the table", async () => {
      renderDashboard();
      await userEvent.click(screen.getAllByTitle("Delete user")[0]); // Alice Johnson
      await userEvent.click(screen.getByRole("button", { name: /^delete$/i }));

      expect(screen.queryByText("Alice Johnson")).not.toBeInTheDocument();
      expect(screen.getAllByRole("row")).toHaveLength(6);
    });

    it("decrements the All count after deleting a user", async () => {
      renderDashboard();
      await userEvent.click(screen.getAllByTitle("Delete user")[0]);
      await userEvent.click(screen.getByRole("button", { name: /^delete$/i }));

      expect(screen.getByRole("button", { name: /all/i })).toHaveTextContent("5");
    });
  });

  // ── Lock / Unlock toggle ────────────────────────────────────────────────────

  describe("lock / unlock toggle", () => {
    it("unlocks a locked user when the unlock button is clicked", async () => {
      renderDashboard();
      // Carol White (index 2) is locked
      const lockButtons = screen.getAllByTitle(/lock account|unlock account/i);
      expect(lockButtons[2]).toHaveAttribute("title", "Unlock account");

      await userEvent.click(lockButtons[2]);

      expect(screen.getAllByTitle(/lock account|unlock account/i)[2]).toHaveAttribute("title", "Lock account");
    });

    it("locks an active user when the lock button is clicked", async () => {
      renderDashboard();
      // Alice Johnson (index 0) is active
      const lockButtons = screen.getAllByTitle(/lock account|unlock account/i);
      expect(lockButtons[0]).toHaveAttribute("title", "Lock account");

      await userEvent.click(lockButtons[0]);

      expect(screen.getAllByTitle(/lock account|unlock account/i)[0]).toHaveAttribute("title", "Unlock account");
    });

    it("updates the locked badge count after locking a user", async () => {
      renderDashboard();
      await userEvent.click(screen.getAllByTitle(/lock account|unlock account/i)[0]); // Lock Alice

      expect(screen.getAllByText(/locked/i)).toHaveLength(3); // Carol, Eva + Alice
    });

    it("updates the active badge count after unlocking a user", async () => {
      renderDashboard();
      // Carol (index 2) is locked — unlock her
      await userEvent.click(screen.getAllByTitle(/lock account|unlock account/i)[2]);

      expect(screen.getAllByText(/active/i)).toHaveLength(5);
    });
  });

  // ── Empty state ─────────────────────────────────────────────────────────────

  describe("empty state", () => {
    it("shows 'No users found' when all users are deleted", async () => {
      renderDashboard();
      for (let i = 0; i < 6; i++) {
        await userEvent.click(screen.getAllByTitle("Delete user")[0]);
        await userEvent.click(screen.getByRole("button", { name: /^delete$/i }));
      }
      expect(screen.getByText("No users found.")).toBeInTheDocument();
    });
  });
});

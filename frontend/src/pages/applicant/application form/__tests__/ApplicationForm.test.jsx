﻿import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import { describe, it, expect, vi, beforeEach } from "vitest";
import ApplicationForm from "../ApplicationForm";
import { applicationApi } from "../../../../services/applicationApi";
// ─── Mocks ───────────────────────────────────────────────────────────────────
vi.mock("../../../../services/applicationApi", () => ({
  applicationApi: { submitApplication: vi.fn() },
}));
vi.mock("../../../../context/AuthContext", () => ({
  useAuth: () => ({
    user: {
      id: 42,
      firstName: "Jane",
      lastName: "Doe",
      username: "jane@example.com",
    },
  }),
}));
// ─── Helpers ─────────────────────────────────────────────────────────────────
const renderForm = () =>
  render(
    <BrowserRouter>
      <ApplicationForm />
    </BrowserRouter>,
  );
/** Fill every required field on step 1 and press Continue. */
const fillStep1AndAdvance = () => {
  fireEvent.change(screen.getByLabelText(/date of birth/i), {
    target: { name: "dob", value: "1990-06-15" },
  });
  fireEvent.change(screen.getByLabelText(/household size/i), {
    target: { name: "householdSize", value: "3" },
  });
  fireEvent.change(screen.getByLabelText(/last 4 digits of ssn/i), {
    target: { name: "ssnLast4", value: "1234" },
  });
  fireEvent.change(screen.getByLabelText(/street address/i), {
    target: { name: "streetAddress", value: "123 Main St" },
  });
  fireEvent.change(screen.getByLabelText(/^city/i), {
    target: { name: "city", value: "Kansas City" },
  });
  fireEvent.change(screen.getByLabelText(/^state/i), {
    target: { name: "state", value: "MO" },
  });
  fireEvent.change(screen.getByLabelText(/zip code/i), {
    target: { name: "zipCode", value: "64101" },
  });
  fireEvent.click(
    screen.getByRole("checkbox", {
      name: /I confirm the above address is my primary Missouri residence/i,
    }),
  );
  fireEvent.click(screen.getByRole("button", { name: /continue/i }));
};
/** Fill every required field on step 2 and press Continue. */
const fillStep2AndAdvance = () => {
  fireEvent.click(screen.getByRole("button", { name: /employment/i }));
  fireEvent.change(screen.getByLabelText(/employer name/i), {
    target: { name: "organizationName", value: "Acme Corp" },
  });
  fireEvent.change(screen.getByLabelText(/hours per month/i), {
    target: { name: "hoursPerMonth", value: "80" },
  });
  fireEvent.click(screen.getByRole("button", { name: /continue/i }));
};
/** Upload a valid file on step 3 and press Continue. */
const uploadFileAndAdvance = async () => {
  const file = new File(["data"], "proof.pdf", { type: "application/pdf" });
  await userEvent.upload(document.querySelector('input[type="file"]'), file);
  fireEvent.click(screen.getByRole("button", { name: /continue/i }));
};
/** Navigate through all 4 steps to reach the Review page. */
const reachReview = async () => {
  renderForm();
  fillStep1AndAdvance();
  await waitFor(() =>
    expect(screen.getByText("Activity Information")).toBeInTheDocument(),
  );
  fillStep2AndAdvance();
  await waitFor(() =>
    expect(screen.getByText(/upload required documents/i)).toBeInTheDocument(),
  );
  await uploadFileAndAdvance();
  await waitFor(() =>
    expect(screen.getByText("Review & Submit")).toBeInTheDocument(),
  );
};
// ─── Progress bar & step navigation ──────────────────────────────────────────
describe("ApplicationForm – ProgressBar & navigation", () => {
  beforeEach(() => vi.clearAllMocks());
  it("starts on step 1 and shows Personal Details heading", () => {
    renderForm();
    expect(screen.getByText("Personal Details")).toBeInTheDocument();
  });
  it("shows all four step labels in the progress bar", () => {
    renderForm();
    expect(screen.getByText("Personal Info")).toBeInTheDocument();
    expect(screen.getByText("Activity")).toBeInTheDocument();
    expect(screen.getByText("Document")).toBeInTheDocument();
    expect(screen.getByText("Review")).toBeInTheDocument();
  });
  it("does NOT advance when required step-1 fields are empty", async () => {
    renderForm();
    fireEvent.click(screen.getByRole("button", { name: /continue/i }));
    await waitFor(() =>
      expect(
        screen.getByText(/please fix the following before continuing/i),
      ).toBeInTheDocument(),
    );
    expect(screen.getByText("Personal Details")).toBeInTheDocument();
  });
  it("advances to step 2 when all step-1 fields are valid", async () => {
    renderForm();
    fillStep1AndAdvance();
    await waitFor(() =>
      expect(screen.getByText("Activity Information")).toBeInTheDocument(),
    );
  });
  it("goes back to step 1 from step 2 when Back is clicked", async () => {
    renderForm();
    fillStep1AndAdvance();
    await waitFor(() =>
      expect(screen.getByText("Activity Information")).toBeInTheDocument(),
    );
    fireEvent.click(screen.getByRole("button", { name: /back/i }));
    expect(screen.getByText("Personal Details")).toBeInTheDocument();
  });
  it("shows a Back to Dashboard link in the progress bar", () => {
    renderForm();
    expect(
      screen.getByRole("link", { name: /back to dashboard/i }),
    ).toBeInTheDocument();
  });
});
// ─── Step 1 validation ────────────────────────────────────────────────────────
describe("ApplicationForm – Step 1 validation", () => {
  beforeEach(() => vi.clearAllMocks());
  it("shows an error when state is not MO", async () => {
    renderForm();
    fireEvent.change(screen.getByLabelText(/date of birth/i), {
      target: { name: "dob", value: "1990-01-01" },
    });
    fireEvent.change(screen.getByLabelText(/household size/i), {
      target: { name: "householdSize", value: "1" },
    });
    fireEvent.change(screen.getByLabelText(/last 4 digits of ssn/i), {
      target: { name: "ssnLast4", value: "1234" },
    });
    fireEvent.change(screen.getByLabelText(/street address/i), {
      target: { name: "streetAddress", value: "1 Test St" },
    });
    fireEvent.change(screen.getByLabelText(/^city/i), {
      target: { name: "city", value: "Chicago" },
    });
    fireEvent.change(screen.getByLabelText(/^state/i), {
      target: { name: "state", value: "IL" },
    });
    fireEvent.change(screen.getByLabelText(/zip code/i), {
      target: { name: "zipCode", value: "60601" },
    });
    fireEvent.click(screen.getByRole("button", { name: /continue/i }));
    await waitFor(() =>
      expect(
        screen.getAllByText(/you must be a Missouri resident to apply/i)[0],
      ).toBeInTheDocument(),
    );
  });
  it("shows an error when SSN is not exactly 4 digits", async () => {
    renderForm();
    fireEvent.change(screen.getByLabelText(/last 4 digits of ssn/i), {
      target: { name: "ssnLast4", value: "12" },
    });
    fireEvent.click(screen.getByRole("button", { name: /continue/i }));
    await waitFor(() =>
      expect(
        screen.getAllByText(/exactly 4 digits required/i)[0],
      ).toBeInTheDocument(),
    );
  });
  it("shows an error when the residency checkbox is unchecked", async () => {
    renderForm();
    fireEvent.change(screen.getByLabelText(/date of birth/i), {
      target: { name: "dob", value: "1990-01-01" },
    });
    fireEvent.change(screen.getByLabelText(/household size/i), {
      target: { name: "householdSize", value: "1" },
    });
    fireEvent.change(screen.getByLabelText(/last 4 digits of ssn/i), {
      target: { name: "ssnLast4", value: "1234" },
    });
    fireEvent.change(screen.getByLabelText(/street address/i), {
      target: { name: "streetAddress", value: "1 Test St" },
    });
    fireEvent.change(screen.getByLabelText(/^city/i), {
      target: { name: "city", value: "St. Louis" },
    });
    fireEvent.change(screen.getByLabelText(/^state/i), {
      target: { name: "state", value: "MO" },
    });
    fireEvent.change(screen.getByLabelText(/zip code/i), {
      target: { name: "zipCode", value: "63101" },
    });
    // intentionally skip the checkbox
    fireEvent.click(screen.getByRole("button", { name: /continue/i }));
    await waitFor(() =>
      expect(
        screen.getAllByText(/you must confirm your Missouri residency/i)[0],
      ).toBeInTheDocument(),
    );
  });
  it("pre-populates first name, last name and email from the auth user", () => {
    renderForm();
    expect(screen.getByDisplayValue("Jane")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Doe")).toBeInTheDocument();
    expect(screen.getByDisplayValue("jane@example.com")).toBeInTheDocument();
  });
});
// ─── Step 2 validation ────────────────────────────────────────────────────────
describe("ApplicationForm – Step 2 validation", () => {
  beforeEach(() => vi.clearAllMocks());
  const goToStep2 = async () => {
    renderForm();
    fillStep1AndAdvance();
    await waitFor(() =>
      expect(screen.getByText("Activity Information")).toBeInTheDocument(),
    );
  };
  it("shows an error when no activity type is selected", async () => {
    await goToStep2();
    fireEvent.click(screen.getByRole("button", { name: /continue/i }));
    await waitFor(() =>
      expect(
        screen.getAllByText(/please select activity type/i)[0],
      ).toBeInTheDocument(),
    );
  });
  it("shows an error when organization name is blank", async () => {
    await goToStep2();
    fireEvent.click(screen.getByRole("button", { name: /employment/i }));
    fireEvent.change(screen.getByLabelText(/hours per month/i), {
      target: { name: "hoursPerMonth", value: "80" },
    });
    fireEvent.click(screen.getByRole("button", { name: /continue/i }));
    await waitFor(() =>
      expect(
        screen.getAllByText(/employer name is required/i)[0],
      ).toBeInTheDocument(),
    );
  });
  it("shows an error when hoursPerMonth is missing", async () => {
    await goToStep2();
    fireEvent.click(screen.getByRole("button", { name: /employment/i }));
    fireEvent.change(screen.getByLabelText(/employer name/i), {
      target: { name: "organizationName", value: "Acme Corp" },
    });
    fireEvent.click(screen.getByRole("button", { name: /continue/i }));
    await waitFor(() =>
      expect(
        screen.getAllByText(/hours per month must be at least 1/i)[0],
      ).toBeInTheDocument(),
    );
  });
  it("shows the below-80-hours warning text in the activity info panel", async () => {
    await goToStep2();
    fireEvent.click(screen.getByRole("button", { name: /employment/i }));
    fireEvent.change(screen.getByLabelText(/hours per month/i), {
      target: { name: "hoursPerMonth", value: "40" },
    });
    expect(
      screen.getByText(/below the 80-hour requirement/i),
    ).toBeInTheDocument();
  });
  it("shows the meets-requirement text when hours >= 80", async () => {
    await goToStep2();
    fireEvent.click(screen.getByRole("button", { name: /employment/i }));
    fireEvent.change(screen.getByLabelText(/hours per month/i), {
      target: { name: "hoursPerMonth", value: "80" },
    });
    expect(
      screen.getByText(/you meet the 80\+ hours\/month requirement/i),
    ).toBeInTheDocument();
  });
  it("advances to step 3 when all activity fields are valid", async () => {
    await goToStep2();
    fillStep2AndAdvance();
    await waitFor(() =>
      expect(
        screen.getByText(/upload required documents/i),
      ).toBeInTheDocument(),
    );
  });
});
// ─── Step 3 (Documentation) ───────────────────────────────────────────────────
describe("ApplicationForm – Step 3 Documentation", () => {
  beforeEach(() => vi.clearAllMocks());
  const goToStep3 = async () => {
    renderForm();
    fillStep1AndAdvance();
    await waitFor(() =>
      expect(screen.getByText("Activity Information")).toBeInTheDocument(),
    );
    fillStep2AndAdvance();
    await waitFor(() =>
      expect(
        screen.getByText(/upload required documents/i),
      ).toBeInTheDocument(),
    );
  };
  it("shows an error when no file is uploaded and Continue is clicked", async () => {
    await goToStep3();
    fireEvent.click(screen.getByRole("button", { name: /continue/i }));
    await waitFor(() =>
      expect(
        screen.getAllByText(/please upload proof of activity document/i)[0],
      ).toBeInTheDocument(),
    );
  });
  it("shows the file name after a valid upload", async () => {
    await goToStep3();
    const file = new File(["content"], "proof.pdf", {
      type: "application/pdf",
    });
    await userEvent.upload(
      document.querySelector('input[type="file"]'),
      file,
    );
    expect(screen.getByText("proof.pdf")).toBeInTheDocument();
  });
  it("shows an error when the uploaded file exceeds 10 MB", async () => {
    await goToStep3();
    const big = new File([new ArrayBuffer(11 * 1024 * 1024)], "big.pdf", {
      type: "application/pdf",
    });
    await userEvent.upload(
      document.querySelector('input[type="file"]'),
      big,
    );
    await waitFor(() =>
      expect(
        screen.getAllByText(/file size exceeds 10mb/i)[0],
      ).toBeInTheDocument(),
    );
  });
  it("advances to Review after a valid file is uploaded", async () => {
    await goToStep3();
    await uploadFileAndAdvance();
    await waitFor(() =>
      expect(screen.getByText("Review & Submit")).toBeInTheDocument(),
    );
  });
});
// ─── Step 4 (Review & Submit) ─────────────────────────────────────────────────
describe("ApplicationForm – Step 4 Review & Submit", () => {
  beforeEach(() => vi.clearAllMocks());
  it("displays entered personal information in the review", async () => {
    await reachReview();
    expect(screen.getByText("Jane Doe")).toBeInTheDocument();
    expect(screen.getByText("Kansas City, MO 64101")).toBeInTheDocument();
    expect(screen.getByText("***-**-1234")).toBeInTheDocument();
  });
  it("formats the date of birth as MM-DD-YYYY", async () => {
    await reachReview();
    expect(screen.getByText("06-15-1990")).toBeInTheDocument();
  });
  it("displays entered activity information in the review", async () => {
    await reachReview();
    expect(screen.getByText("Employment")).toBeInTheDocument();
    expect(screen.getByText("Acme Corp")).toBeInTheDocument();
  });
  it("shows the uploaded document file name", async () => {
    await reachReview();
    expect(screen.getByText("proof.pdf")).toBeInTheDocument();
  });
  it("shows the eligibility banner when the user meets requirements", async () => {
    await reachReview();
    expect(
      screen.getByText(/you appear to be eligible!/i),
    ).toBeInTheDocument();
  });
  it("calls applicationApi.submitApplication when Submit is clicked", async () => {
    applicationApi.submitApplication.mockResolvedValue({
      success: true,
      data: { applicationId: "APP-001" },
    });
    vi.spyOn(window, "alert").mockImplementation(() => {});
    await reachReview();
    fireEvent.click(
      screen.getByRole("button", { name: /submit application/i }),
    );
    await waitFor(() =>
      expect(applicationApi.submitApplication).toHaveBeenCalledTimes(1),
    );
  });
  it("resets to step 1 after a successful submission", async () => {
    applicationApi.submitApplication.mockResolvedValue({
      success: true,
      data: { applicationId: "APP-001" },
    });
    vi.spyOn(window, "alert").mockImplementation(() => {});
    await reachReview();
    fireEvent.click(
      screen.getByRole("button", { name: /submit application/i }),
    );
    await waitFor(() =>
      expect(screen.getByText("Personal Details")).toBeInTheDocument(),
    );
  });
  it("shows an alert with the error when the API returns failure", async () => {
    applicationApi.submitApplication.mockResolvedValue({
      success: false,
      error: "Server unavailable",
    });
    const alertMock = vi
      .spyOn(window, "alert")
      .mockImplementation(() => {});
    await reachReview();
    fireEvent.click(
      screen.getByRole("button", { name: /submit application/i }),
    );
    await waitFor(() =>
      expect(alertMock).toHaveBeenCalledWith(
        expect.stringContaining("Server unavailable"),
      ),
    );
  });
  it("goes back to step 3 when 'Back to Edit' is clicked", async () => {
    await reachReview();
    fireEvent.click(
      screen.getByRole("button", { name: /back to edit/i }),
    );
    await waitFor(() =>
      expect(
        screen.getByText(/upload required documents/i),
      ).toBeInTheDocument(),
    );
  });
});

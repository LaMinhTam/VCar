export const ENDPOINTS = {
  // [REQUEST]
  RENT_REQUEST: "/rental/rent-request",
  LESSOR_APPROVE_REQUEST: "/rental-requests/approve",
  LESSOR_REJECT_REQUEST: "/rental-requests/reject",
  GET_LESSEE_REQUESTS: "/rental-requests/lessee",
  GET_LESSOR_REQUESTS: "/rental-requests/lessor",
  // [CONTRACT]
  GET_LESSEE_CONTRACTS: "/rental-contracts/lessee",
  GET_LESSOR_CONTRACTS: "/rental-contracts/lessor",
  GET_CONTRACT_BY_ID: (id: string) => `/rental-contracts/${id}`,
  LESSEE_APPROVE_CONTRACT: "/rental-contracts/lessee-approve",
};

export const RentalRequestParams = {
  sortDescending: "true",
  page: "1",
  size: "10",
  status: "APPROVED",
};

export const ContractParams = {
  sortDescending: "true",
  page: "1",
  size: "10",
};

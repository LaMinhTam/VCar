export const ENDPOINTS = {
  // [REQUEST]
  RENT_REQUEST: "/rental-requests/rent",
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
  sortDescending: "",
  page: "0",
  size: "10",
  status: "",
};

export const ContractParams = {
  sortDescending: "",
  page: "0",
  size: "10",
};

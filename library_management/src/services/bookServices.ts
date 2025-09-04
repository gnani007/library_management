import { backend } from "../api/mockBackend"

export const bookServices = {
  getBooks: () => backend.getBooks(),
}
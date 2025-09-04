import type { Books } from "../types"

const books: Books[] = [
  { id: '101', title: 'React Typescript', author: 'Alex ', stock: 2 },
  { id: '103', title: 'React Mastering', author: 'Jonnathan', stock: 1 },
]
// simulate api delay
const wait = (ms = 200) => new Promise(res => setTimeout(res, ms))

export const backend = {
  async getBooks(): Promise<Books[]> {
    await wait()
    // return deep copy to avoid mutation from callers
    return JSON.parse(JSON.stringify(books))
  },
}
const http = require("http")
const getBodyData = require("./util")
const { v4 } = require("uuid")

let books = [
    {
        id: "1",
        title: "My Book",
        pages: "245",
        author: "Writer 0"
    }
]

const server = http.createServer(async (req, res,) => {
    // Get all books
    if (req.url === "/books" && req.method === "GET") {
        res.writeHead(200, {
            "Content-Type": "application/json charset=utf8"
        })
        const resp = {
            status: "ok",
            books
        }
        res.end(JSON.stringify(resp))
    }
    else if (req.url === "/books" && req.method === "POST") {
        const data = await getBodyData(req)
        const { title, pages, author } = JSON.parse(data)
        const newBook = {
            id: v4(),
            title,
            pages,
            author
        }
        books.push(newBook)
        const resp = {
            status: "Created",
            book: newBook
        }
        res.writeHead(200, {
            "Content-Type": "application/json charset=utf8"
        })
        res.end(JSON.stringify(resp))
    }
    else if (req.url.match(/\/books\/\w+/) === "/books/:id" && req.method === "GET") {
        const id = req.url.split("/")[2]
        const book = books.find(b => b.id === id)
        res.writeHead(200, {
            "Content-Type": "application/json charset=utf8"
        })
        const resp = {
            status: "ok",
            book
        }
        res.end(JSON.stringify(resp))
    }
    else if (req.url.match(/\/books\/\w+/) && req.method === "PUT") {
        const id = req.url.split("/")[2]
        const idx = books.findIndex(b => b.id === id)
        const data = await getBodyData(req)
        const { title, pages, author } = JSON.parse(data)
        const newBook = {
            id: v4(),
            title,
            pages,
            author
        }
        const changedBook = {
            id: books[idx].id,
            title: title || books[idx].title,
            pages: pages || books[idx].pages,
            author: author || books[idx].author
        }
        books[idx] = changedBook
        res.writeHead(200, {
            "Content-Type": "application/json charset=utf8"
        })
        const resp = {
            status: "ok",
            book: changedBook
        }
        res.end(JSON.stringify(resp))
    }
    else if (req.url.match(/\/books\/\w+/) && req.method === "DELETE") {
        const id = req.url.split("/")[2]
        books = books.filter(b => b.id !== id)
        res.writeHead(200, {
            "Content-Type": "application/json charset=utf8"
        })
        const resp = {
            status: "DEleted ok",
        }
        res.end(JSON.stringify(resp))
    }
})
server.listen(3000, () => console.log("server running on port 3000"))
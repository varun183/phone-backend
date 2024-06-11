const express = require("express");
const morgan = require("morgan");
const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json());

morgan.token("body", (req) => JSON.stringify(req.body));
const customFormat =
  ":method :url :status :res[content-length] - :response-time ms :body";

app.use(morgan(customFormat));

app.use(express.static("dist"));

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/info", (request, response) => {
  const utcDate1 = new Date(Date.now());
  response.send(`
  <p>Phonebook has info for ${persons.length} people</p>
  <p>${utcDate1.toUTCString()}</p>`);
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);
  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

const generateId = () => {
  return Math.floor(Math.random() * 1000000);
};

app.post("/api/persons", (request, response) => {
  const body = request.body;

  const existingName = persons.find((person) => person.name === body.name);

  if (!(body.name && body.number)) {
    return response.status(400).json({
      error: "name or number is missing",
    });
  }

  if (existingName) {
    return response.status(400).json({
      error: "name must be unique",
    });
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number,
  };

  persons = persons.concat(person);

  response.json(person);
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);

  response.status(204).end();
});

app.use(unknownEndpoint);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

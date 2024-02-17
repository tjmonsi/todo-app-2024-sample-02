import Fastify from 'fastify';
import { v4 } from 'uuid';
import { saveDB, readDB, deleteItemDB } from './db.js';

export async function build () {
  const fastify = Fastify({ logger: true });

  fastify.get('/', async () => {
    return { hello: 'TJ' }
  })

  fastify.post('/todo', async (request) => {
    const { body: todo } = request;
    todo.id = v4();
    todo.dateCreated = new Date().getTime();
    await saveDB('todo', todo);
    return { todo }
  });

  fastify.get('/todo', async () => {
    const todos = readDB('todo');
    // descending order of dateCreated
    todos.sort((todo1, todo2) => todo2.dateCreated - todo1.dateCreated);
    return { todos }
  })

  fastify.get('/todo/:id', async (request) => {
    const { params } = request;
    const { id } = params;
    const todo = readDB('todo', id);
    return { todo }
  })

  fastify.patch('/todo/:id', async (request) => {
    const { params, body } = request;
    const { id } = params;
    const { title = null, description = null, done = null } = body;
    const todo = readDB('todo', id);

    if (title) todo.title = title;
    if (description) todo.description = description;
    if (done !== null) todo.done = done;

    await saveDB('todo', todo);
    return { todo }
  });

  fastify.delete('/todo/:id', async (request) => {
    const { params } = request;
    const { id } = params;
    deleteItemDB('todo', id);
    return { success: true }
  });

  return fastify
}
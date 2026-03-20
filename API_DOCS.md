# API Documentation

Base URL: `http://localhost:5000/api`

## Auth

### `POST /auth/register`

```json
{
  "name": "Harish Kaushik",
  "email": "harish@example.com",
  "password": "secret123"
}
```

### `POST /auth/login`

```json
{
  "email": "harish@example.com",
  "password": "secret123"
}
```

### `GET /auth/me`

Requires `Authorization: Bearer <token>`

### `PUT /auth/me`

Update `name`, `bio`, `avatar`, or `password`

## Items

### `GET /items`

Query params:

- `category=lost|found`
- `status=open|resolved`
- `location=<text>`
- `keyword=<text>`

### `POST /items`

Requires auth.

```json
{
  "title": "Black Backpack",
  "description": "Lost near campus gate",
  "location": "Bangalore",
  "category": "lost",
  "imageUrl": "https://res.cloudinary.com/...jpg",
  "imagePublicId": "lost-found/abc123"
}
```

### `GET /items/:id`

Returns the item and AI similarity matches.

### `GET /items/:id/matches`

Returns only similarity matches with cosine similarity scores.

### `PUT /items/:id`

Supports `title`, `description`, `location`, `category`, `status`, `imageUrl`, `imagePublicId`

### `DELETE /items/:id`

Owner only.

### `GET /items/me/list`

Returns current user's posts.

## Uploads

### `POST /uploads/image`

Requires `multipart/form-data` with `image`.

## Chat

### `GET /chat/conversations`

### `POST /chat/conversations`

```json
{
  "itemId": "item-object-id"
}
```

### `GET /chat/conversations/:id/messages`

## Socket Events

Client emits:

- `conversation:join`
- `message:send`

Server emits:

- `message:new`
- `conversation:updated`

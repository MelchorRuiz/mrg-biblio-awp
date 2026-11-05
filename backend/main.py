import hashlib
import secrets
import sqlite3
from contextlib import contextmanager

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class Image(BaseModel):
    title: str
    description: str
    url: str
    category: str
    author: str = ""


class ImageUpdate(BaseModel):
    title: str = None
    description: str = None
    url: str = None
    category: str = None
    author: str = None


class UserCreate(BaseModel):
    name: str
    email: str
    password: str


class UserLogin(BaseModel):
    email: str
    password: str


class TokenBody(BaseModel):
    token: str


DATABASE = "images.db"


def hash_password(password, salt=None):
    if salt is None:
        salt = secrets.token_hex(16)
    hashed = hashlib.sha256(f"{salt}{password}".encode()).hexdigest()
    return salt, hashed


def verify_password(password, salt, stored_hash):
    _, hashed = hash_password(password, salt)
    return hashed == stored_hash


def init_db():
    with sqlite3.connect(DATABASE) as conn:
        cursor = conn.cursor()
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS images (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                description TEXT NOT NULL,
                url TEXT NOT NULL,
                category TEXT NOT NULL,
                author TEXT
            )
        """)
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT NOT NULL UNIQUE,
                password_hash TEXT NOT NULL,
                salt TEXT NOT NULL
            )
        """)
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS sessions (
                token TEXT PRIMARY KEY,
                user_id INTEGER NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id)
            )
        """)
        conn.commit()


@contextmanager
def get_db():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    try:
        yield conn
    finally:
        conn.close()


@app.on_event("startup")
def startup():
    init_db()


@app.post("/register")
def register(user: UserCreate):
    if not user.name.strip():
        raise HTTPException(status_code=400, detail="Nombre es requerido")
    if not user.email.strip():
        raise HTTPException(status_code=400, detail="Correo es requerido")
    if len(user.password) < 6:
        raise HTTPException(status_code=400, detail="La contraseña debe ser de al menos 6 caracteres")

    salt, password_hash = hash_password(user.password)

    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT id FROM users WHERE email = ?", (user.email,))
        if cursor.fetchone():
            raise HTTPException(status_code=400, detail="Correo ya registrado")

        cursor.execute(
            "INSERT INTO users (name, email, password_hash, salt) VALUES (?, ?, ?, ?)",
            (user.name.strip(), user.email.strip(), password_hash, salt),
        )
        conn.commit()
        user_id = cursor.lastrowid

        token = secrets.token_hex(32)
        cursor.execute(
            "INSERT INTO sessions (token, user_id) VALUES (?, ?)",
            (token, user_id),
        )
        conn.commit()

        return {
            "token": token,
            "user": {"id": user_id, "name": user.name.strip(), "email": user.email.strip()},
        }


@app.post("/login")
def login(credentials: UserLogin):
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM users WHERE email = ?", (credentials.email,))
        user = cursor.fetchone()
        if not user:
            raise HTTPException(status_code=400, detail="Correo y/o contraseña invalidos")

        if not verify_password(credentials.password, user["salt"], user["password_hash"]):
            raise HTTPException(status_code=400, detail="Correo y/o contraseña invalidos")

        token = secrets.token_hex(32)
        cursor.execute(
            "INSERT INTO sessions (token, user_id) VALUES (?, ?)",
            (token, user["id"]),
        )
        conn.commit()

        return {
            "token": token,
            "user": {"id": user["id"], "name": user["name"], "email": user["email"]},
        }


@app.post("/logout")
def logout(body: TokenBody):
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("DELETE FROM sessions WHERE token = ?", (body.token,))
        conn.commit()
        if cursor.rowcount == 0:
            raise HTTPException(status_code=400, detail="Invalid token")
        return {"message": "Logged out successfully"}


@app.get("/images")
def get_images():
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM images")
        images = [dict(row) for row in cursor.fetchall()]
        return images


@app.get("/images/{image_id}")
def get_image(image_id: int):
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM images WHERE id = ?", (image_id,))
        image = cursor.fetchone()
        if not image:
            raise HTTPException(status_code=404, detail="Imagen no encontrada")
        return dict(image)


@app.post("/images")
def create_image(image: Image):
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute(
            """
            INSERT INTO images (title, description, url, category, author)
            VALUES (?, ?, ?, ?, ?)
        """,
            (image.title, image.description, image.url, image.category, image.author),
        )
        conn.commit()
        image_id = cursor.lastrowid
        cursor.execute("SELECT * FROM images WHERE id = ?", (image_id,))
        return dict(cursor.fetchone())


@app.put("/images/{image_id}")
def update_image(image_id: int, image: ImageUpdate):
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM images WHERE id = ?", (image_id,))
        existing = cursor.fetchone()
        if not existing:
            raise HTTPException(status_code=404, detail="Imagen no encontrada")

        update_data = {
            "title": image.title if image.title is not None else existing["title"],
            "description": image.description if image.description is not None else existing["description"],
            "url": image.url if image.url is not None else existing["url"],
            "category": image.category if image.category is not None else existing["category"],
            "author": image.author if image.author is not None else existing["author"],
        }

        cursor.execute(
            """
            UPDATE images
            SET title = ?, description = ?, url = ?, category = ?, author = ?
            WHERE id = ?
        """,
            (update_data["title"], update_data["description"], update_data["url"], update_data["category"], update_data["author"], image_id),
        )
        conn.commit()
        cursor.execute("SELECT * FROM images WHERE id = ?", (image_id,))
        return dict(cursor.fetchone())


@app.delete("/images/{image_id}")
def delete_image(image_id: int):
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM images WHERE id = ?", (image_id,))
        image = cursor.fetchone()
        if not image:
            raise HTTPException(status_code=404, detail="Imagen no encontrada")

        cursor.execute("DELETE FROM images WHERE id = ?", (image_id,))
        conn.commit()
        return {"message": "Imagen eliminada exitosamente"}

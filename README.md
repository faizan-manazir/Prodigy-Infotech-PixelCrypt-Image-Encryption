# PixelCrypt 🔒🖼️

> Secure image encryption through pixel-level transformations.

PixelCrypt is a modern full-stack web application that allows users to encrypt and decrypt images using mathematically reversible pixel manipulations.

## Features

- **XOR Cipher**: Fast bitwise manipulation of pixel data.
- **Pixel Permutation**: Cryptographically shuffles the location of every pixel in the image based on the key seed.
- **Channel Shift**: Permutes RGB channels.
- **Hybrid Mode**: Combines permutation, channel shifting, and XOR for maximum obfuscation.
- **Lossless Recovery**: Reversible algorithms guarantee a 100% pixel-perfect image reconstruction.

## Tech Stack

- **Frontend**: Next.js (App Router), TypeScript, Tailwind CSS, Lucide Icons
- **Backend**: Python, FastAPI, Pillow, NumPy

## Getting Started

### 1. Backend Setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```
The backend API will run on `http://localhost:8000`.

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```
The frontend UI will run on `http://localhost:3000`.

## Architecture

- **`backend/algorithms/`**: Contains the core logic for pixel manipulation using NumPy.
- **`backend/services/`**: Image I/O handling using Pillow.
- **`backend/api/`**: FastAPI routing and endpoints.
- **`frontend/app/`**: Next.js routing, pages, and global styling.
- **`frontend/components/`**: Reusable React UI elements.

## Disclaimer

This project is built for educational and demonstrative purposes to showcase image processing algorithms and web development. It is not intended to replace established encryption standards (like AES-256) for highly sensitive data.

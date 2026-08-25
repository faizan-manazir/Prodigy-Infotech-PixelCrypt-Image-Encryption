# PixelCrypt

> **A full-stack educational web application for reversible image transformation through pixel-level manipulation.**

PixelCrypt allows users to upload an image, choose a transformation method, provide a key, generate an encrypted-looking PNG, and later recover the original pixel data using the correct key and method.

The application is built as **Task 2: Pixel Manipulation for Image Encryption** and focuses on practical image processing, reversible transformations, backend validation, and a modern web interface.

---

## Screenshots

### Home

![PixelCrypt Home](screenshots/01-home.png)

### Encryption Workspace

![Encryption Workspace](screenshots/02-encryption-workspace.png)

### Encrypted Result

![Encrypted Result](screenshots/03-encrypted-result.png)

### Decryption Workspace

![Decryption Workspace](screenshots/04-decryption-workspace.png)

### Verified Decryption Result

![Verified Decryption Result](screenshots/05-decrypted-result.png)

---

## Features

- Modern responsive cybersecurity-inspired interface
- Drag-and-drop image upload
- Image preview before processing
- PNG, JPG, JPEG, WEBP, and BMP input support
- 10 MB upload limit
- Four reversible pixel-transformation methods
- Hybrid mode combining multiple transformations
- Key visibility toggle
- Processing progress states
- Original versus encrypted result comparison
- Downloadable PNG output
- Key and method verification during decryption
- Wrong-key detection
- Wrong-method detection
- Pixel checksum verification after recovery
- Backend-side validation
- Configurable API URL and CORS settings
- Unit tests for transformation and validation logic

---

## Transformation Methods

### Hybrid Mode

The recommended educational mode combines:

```text
Original Image
      |
      v
Pixel Permutation
      |
      v
RGB Channel Permutation
      |
      v
XOR Pixel Transformation
      |
      v
Encrypted PNG
```

Decryption reverses the sequence:

```text
Encrypted PNG
      |
      v
Reverse XOR
      |
      v
Reverse RGB Channel Permutation
      |
      v
Reverse Pixel Permutation
      |
      v
Recovered Image
```

### XOR Pixel Transformation

A deterministic key-derived byte stream is XORed with the image pixel values.

Because XOR is self-inverse, the same key-derived stream is used to reverse the operation.

### Pixel Permutation

Complete pixels are deterministically rearranged according to a key-derived permutation.

### RGB Channel Permutation

The RGB channels are rearranged using a deterministic permutation while preserving the alpha channel.

---

## Verified Decryption

PixelCrypt encrypted PNG files contain a small metadata envelope that records:

- PixelCrypt format identifier
- Format version
- Selected transformation method
- SHA-256 checksum of the original decoded pixel data
- Key-derived integrity verifier

During decryption, the application:

1. Reads the PixelCrypt metadata.
2. Checks that the selected method matches.
3. Validates the verifier using the supplied key.
4. Rejects an incorrect key or method.
5. Reverses the pixel transformation.
6. Calculates the recovered pixel checksum.
7. Confirms that the recovered pixels match the original checksum.

```text
Correct Key + Correct Method
            |
            v
    Verification Passes
            |
            v
 Reverse Transformation
            |
            v
 Recovered Checksum Matches
            |
            v
       SUCCESS
```

```text
Wrong Key / Wrong Method
            |
            v
   Verification Fails
            |
            v
 Request Rejected
```

> This verification mechanism is intended for this educational reversible-image workflow. It does not turn the custom transformation algorithms into a replacement for established authenticated encryption.

---

## Technology Stack

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- Lucide React
- Axios

### Backend

- Python
- FastAPI
- Pillow
- NumPy
- Pytest

---

## Project Structure

```text
PixelCrypt/
│
├── README.md
├── LICENSE
├── .gitignore
├── .env.example
│
├── screenshots/
│   ├── 01-home.png
│   ├── 02-encryption-workspace.png
│   ├── 03-encrypted-result.png
│   ├── 04-decryption-workspace.png
│   └── 05-decrypted-result.png
│
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   │
│   ├── algorithms/
│   │   ├── __init__.py
│   │   ├── utils.py
│   │   ├── xor_cipher.py
│   │   ├── pixel_swap.py
│   │   ├── channel_shift.py
│   │   └── hybrid.py
│   │
│   ├── api/
│   │   ├── __init__.py
│   │   └── routes.py
│   │
│   ├── models/
│   │   ├── __init__.py
│   │   └── schemas.py
│   │
│   ├── services/
│   │   ├── __init__.py
│   │   └── image_processor.py
│   │
│   └── tests/
│       ├── test_crypto.py
│       └── test_validation.py
│
└── frontend/
    ├── app/
    │   ├── layout.tsx
    │   ├── page.tsx
    │   ├── globals.css
    │   ├── encrypt/
    │   │   └── page.tsx
    │   ├── decrypt/
    │   │   └── page.tsx
    │   ├── how-it-works/
    │   │   └── page.tsx
    │   └── about/
    │       └── page.tsx
    │
    ├── components/
    │   ├── Navbar.tsx
    │   ├── Footer.tsx
    │   ├── ImageUploader.tsx
    │   └── Toast.tsx
    │
    ├── lib/
    │   └── api.ts
    │
    ├── public/
    ├── .env.example
    ├── package.json
    ├── package-lock.json
    ├── tsconfig.json
    ├── next.config.ts
    └── .gitignore
```

---

## Requirements

### Backend

- Python 3.10 or newer
- pip

### Frontend

- Node.js 18 or newer
- npm

---

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/faizan-manazir/Prodigy-Infotech-PixelCrypt-Image-Encryption.git
cd Prodigy-Infotech-PixelCrypt-Image-Encryption
```

### 2. Start the Backend

Open a terminal:

```bash
cd backend
```

Create a virtual environment:

**Windows**

```bash
python -m venv venv
venv\Scripts\activate
```

**Linux/macOS**

```bash
python3 -m venv venv
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Run the API:

```bash
uvicorn main:app --reload
```

The backend runs at:

```text
http://localhost:8000
```

API documentation is available at:

```text
http://localhost:8000/docs
```

### 3. Start the Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Open:

```text
http://localhost:3000
```

---

## Environment Configuration

The frontend API URL can be configured with:

```text
frontend/.env.local
```

Example:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

The backend CORS origins can be configured with:

```env
PIXELCRYPT_CORS_ORIGINS=http://localhost:3000
```

For multiple origins:

```env
PIXELCRYPT_CORS_ORIGINS=http://localhost:3000,https://your-domain.example
```

---

## API Endpoints

### Health Check

```http
GET /api/health
```

### Encrypt an Image

```http
POST /api/encrypt
```

Form fields:

```text
image   Image file
key     8–128 character key
method  hybrid | xor | swap | channel
```

### Decrypt an Image

```http
POST /api/decrypt
```

Form fields:

```text
image   PixelCrypt encrypted PNG
key     Original 8–128 character key
method  Original method
```

### Image Information

```http
POST /api/image/info
```

---

## Validation

The backend independently validates:

- Allowed MIME types
- Empty uploads
- 10 MB maximum file size
- Corrupted or unsupported images
- Maximum image dimensions
- Encryption key length
- Supported transformation methods

Frontend validation improves the user experience, but backend validation remains the authoritative security boundary.

---

## Testing

Run the backend tests:

```bash
cd backend
pytest -q
```

The test suite covers:

- XOR reversibility
- Pixel permutation reversibility
- RGB channel transformation reversibility
- Hybrid transformation reversibility
- Deterministic checksums
- Key verifier behavior
- Empty-key rejection

---

## Important Output Behavior

Encrypted images are always exported as **PNG**.

This is intentional because PNG preserves transformed pixel values without introducing lossy compression artifacts.

If a JPG, WEBP, or BMP image is uploaded:

- The decoded image pixels are transformed.
- The encrypted output is a PNG.
- Decryption recovers the decoded pixel data as a PNG.
- Original file bytes, original filename, EXIF metadata, and original lossy compression are not reconstructed.

---

## Security Disclaimer

PixelCrypt is an **educational image-processing and reversible pixel-transformation project**.

Its custom algorithms should **not** be considered a replacement for standard cryptographic encryption such as:

- AES-GCM
- ChaCha20-Poly1305

For real sensitive data, use established, peer-reviewed authenticated encryption libraries and protocols.

---

## Repository Cleanup

The repository intentionally excludes generated dependencies and runtime artifacts such as:

```text
backend/venv/
frontend/node_modules/
frontend/.next/
**/__pycache__/
backend/.pytest_cache/
```

Install dependencies locally using:

```bash
pip install -r backend/requirements.txt
```

and:

```bash
cd frontend
npm install
```

---

## Academic Context

**Task 2 — Pixel Manipulation for Image Encryption**

The project implements the internship requirement of encrypting and decrypting images through pixel-level operations such as mathematical pixel transformations and pixel swapping, while extending the task into a complete full-stack portfolio application.

---

## License

See the [LICENSE](LICENSE) file for licensing information.

---

**Built for education, image processing, and practical cybersecurity learning.**

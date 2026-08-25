Copy and paste this entire content into your `README.md`:

````md
# 🔐 PixelCrypt — Image Encryption Through Pixel Manipulation

![PixelCrypt Home](screenshots/home.png)

A modern full-stack web application for **encrypting and decrypting images through reversible pixel-level transformations**.

PixelCrypt allows users to upload an image, select an encryption method, provide a secret key, encrypt the image, and later recover it using the correct key and method. The application combines a polished cybersecurity-inspired interface with multiple educational image-transformation algorithms.

> **Project Context:** Developed as **Task 2 — Pixel Manipulation for Image Encryption** during the Prodigy InfoTech Cyber Security Internship.

---

## ✨ Features

- 🖼️ Upload and process images through a modern web interface
- 🔐 Key-based image transformation
- 🔄 Image encryption and decryption workflows
- 🧩 Multiple reversible pixel manipulation methods
- ⚡ Hybrid encryption mode
- 🔢 XOR pixel transformation
- 🔀 Pixel position permutation
- 🎨 RGB channel permutation
- 👁️ Original and processed image previews
- 📊 Image metadata display
- 🔑 Encryption key visibility toggle
- ❌ Wrong-key and incorrect-method detection
- 🛡️ Input and file validation
- 📱 Responsive interface
- 🌐 REST API backend
- 🧪 Automated backend tests

---

# 📸 Application Screenshots

## 🏠 Home Page

The landing page introduces PixelCrypt and provides access to the encryption and decryption tools.

![PixelCrypt Home Page](screenshots/home.png)

---

## 🔐 Encryption Workspace

Users can upload an image, choose an encryption method, enter a secret key, and start the encryption process.

![Encryption Page](screenshots/encryption-page.png)

---

## 🔒 Encrypted Image Result

After processing, PixelCrypt displays the encrypted image and allows the user to download the result.

![Encrypted Result](screenshots/encrypted-result.png)

---

## 🔓 Decryption Workspace

Users can upload an encrypted image and provide the correct encryption method and key to recover the original image.

![Decryption Page](screenshots/decryption-page.png)

---

## ✅ Decrypted Image Result

When the correct key and method are provided, the image is successfully recovered and verified.

![Decrypted Result](screenshots/decrypted-result.png)

---

## ❌ Incorrect Key Detection

PixelCrypt validates the decryption process and prevents the application from falsely reporting a successful recovery when an incorrect key or method is used.

![Incorrect Key Detection](screenshots/incorrect_key.png)

---

## 🧠 How It Works

The application includes a dedicated page explaining the pixel-level transformation process and the available encryption methods.

![How It Works](screenshots/how-it-works.png)

---

# ⚙️ How PixelCrypt Works

```text
                     ┌─────────────────┐
                     │   Upload Image  │
                     └────────┬────────┘
                              │
                              ▼
                     ┌─────────────────┐
                     │ Select Method   │
                     └────────┬────────┘
                              │
                              ▼
                     ┌─────────────────┐
                     │  Enter Secret   │
                     │       Key       │
                     └────────┬────────┘
                              │
                              ▼
                     ┌─────────────────┐
                     │ Pixel-Level     │
                     │ Transformation  │
                     └────────┬────────┘
                              │
                              ▼
                     ┌─────────────────┐
                     │ Encrypted Image │
                     └────────┬────────┘
                              │
                              ▼
                         Download
````

For decryption:

```text
                     ┌─────────────────┐
                     │ Encrypted Image │
                     └────────┬────────┘
                              │
                              ▼
                     ┌─────────────────┐
                     │ Correct Method  │
                     └────────┬────────┘
                              │
                              ▼
                     ┌─────────────────┐
                     │ Correct Secret  │
                     │       Key       │
                     └────────┬────────┘
                              │
                              ▼
                     ┌─────────────────┐
                     │ Reverse Pixel   │
                     │ Transformation  │
                     └────────┬────────┘
                              │
                              ▼
                     ┌─────────────────┐
                     │ Verify Result   │
                     └────────┬────────┘
                              │
                              ▼
                     ┌─────────────────┐
                     │ Recovered Image │
                     └─────────────────┘
```

---

# 🔐 Encryption Methods

## 1. XOR Pixel Transformation

This method performs a reversible bitwise operation on pixel values using a key-derived transformation.

```text
Encrypted Pixel = Original Pixel XOR Key Stream
```

The same operation can be reversed with the correct key.

---

## 2. Pixel Position Permutation

Instead of only changing pixel values, this method rearranges pixel positions using a deterministic sequence generated from the encryption key.

```text
Original Image
A B C D
E F G H
I J K L

        │
        ▼

Pixel Permutation

        │
        ▼

Encrypted Image
G B K
A I C
L E H
```

The correct key reproduces the same sequence, allowing the transformation to be reversed.

---

## 3. RGB Channel Permutation

This method rearranges the red, green, and blue channels.

Example:

```text
Original Pixel

R = 120
G = 80
B = 200

        │
        ▼

Channel Permutation

        │
        ▼

Transformed Pixel

R = G
G = B
B = R
```

---

## 4. Hybrid Mode ⭐

Hybrid Mode combines multiple reversible transformations.

```text
Original Image
      │
      ▼
Key-Derived Seed
      │
      ▼
Pixel Position Permutation
      │
      ▼
RGB Channel Transformation
      │
      ▼
XOR Pixel Transformation
      │
      ▼
Encrypted Image
```

During decryption, the transformations are reversed in the correct order.

```text
Encrypted Image
      │
      ▼
Reverse XOR
      │
      ▼
Reverse RGB Transformation
      │
      ▼
Reverse Pixel Permutation
      │
      ▼
Recovered Image
```

---

# 🛡️ Validation and Verification

The application includes validation for:

* Supported image formats
* Invalid files
* Corrupted images
* Empty uploads
* File size limits
* Invalid encryption methods
* Empty encryption keys
* Short encryption keys
* Incorrect decryption keys
* Incorrect decryption methods

The application also verifies the recovered image to reduce the risk of falsely reporting a successful decryption when the wrong key or transformation method is supplied.

---

# 🧰 Technology Stack

## Frontend

* Next.js
* TypeScript
* React
* Tailwind CSS
* Lucide Icons

## Backend

* Python
* FastAPI
* Pillow
* NumPy
* Uvicorn

## Testing

* Pytest

---

# 📂 Repository Structure

```text
Prodigy-Infotech-PixelCrypt-Image-Encryption/
│
├── README.md
├── LICENSE
├── .gitignore
├── .env.example
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
│       ├── test_api.py
│       └── test_validation.py
│
├── frontend/
│   ├── app/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   │
│   │   ├── encrypt/
│   │   │   └── page.tsx
│   │   │
│   │   ├── decrypt/
│   │   │   └── page.tsx
│   │   │
│   │   ├── how-it-works/
│   │   │   └── page.tsx
│   │   │
│   │   └── about/
│   │       └── page.tsx
│   │
│   ├── components/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── ImageUploader.tsx
│   │   ├── ImagePreview.tsx
│   │   ├── KeyInput.tsx
│   │   ├── MethodSelector.tsx
│   │   └── ProcessingStatus.tsx
│   │
│   ├── lib/
│   │   └── api.ts
│   │
│   ├── public/
│   │
│   ├── package.json
│   ├── package-lock.json
│   ├── tsconfig.json
│   └── .gitignore
│
└── screenshots/
    ├── decrypted-result.png
    ├── decryption-page.png
    ├── encrypted-result.png
    ├── encryption-page.png
    ├── home.png
    ├── how-it-works.png
    └── incorrect_key.png
```

---

# 🚀 Installation

## Prerequisites

Make sure you have installed:

* Python 3.10 or later
* Node.js 18 or later
* npm

---

# 🖥️ Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Create a virtual environment:

```bash
python -m venv venv
```

Activate the environment.

### Windows

```bash
venv\Scripts\activate
```

### Linux/macOS

```bash
source venv/bin/activate
```

Install the required dependencies:

```bash
pip install -r requirements.txt
```

Start the FastAPI server:

```bash
uvicorn main:app --reload --port 8000
```

The backend should run at:

```text
http://localhost:8000
```

API documentation is available at:

```text
http://localhost:8000/docs
```

---

# 🌐 Frontend Setup

Open another terminal and navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the application:

```text
http://localhost:3000
```

---

# 🧪 Running Tests

Navigate to the backend directory:

```bash
cd backend
```

Activate the virtual environment and run:

```bash
pytest
```

Or:

```bash
python -m pytest
```

The tests cover the core reversible transformation logic and validation functionality.

---

# 🔌 API Endpoints

## Health Check

```http
GET /api/health
```

## Encrypt Image

```http
POST /api/encrypt
```

## Decrypt Image

```http
POST /api/decrypt
```

## Get Image Information

```http
POST /api/image/info
```

---

# 🧪 Testing the Application

A typical workflow is:

```text
1. Start the backend
        │
        ▼
2. Start the frontend
        │
        ▼
3. Upload an image
        │
        ▼
4. Select Hybrid Mode
        │
        ▼
5. Enter a secret key
        │
        ▼
6. Encrypt the image
        │
        ▼
7. Download encrypted image
        │
        ▼
8. Open Decrypt page
        │
        ▼
9. Upload encrypted image
        │
        ▼
10. Use the same method and key
        │
        ▼
11. Verify and recover the image
```

---

# ⚠️ Important Security Note

PixelCrypt is an **educational project focused on reversible pixel manipulation and image transformation**.

The included algorithms are designed to demonstrate concepts such as:

* XOR operations
* Deterministic transformations
* Pixel permutation
* RGB channel manipulation
* Key-derived random sequences
* Reversible image processing

This project should **not be considered a replacement for established cryptographic systems** such as authenticated encryption using AES-GCM or ChaCha20-Poly1305.

For real-world protection of sensitive images, established and peer-reviewed cryptographic libraries and authenticated encryption standards should be used.

---

# 🎓 Internship Context

This project was developed as part of the:

**Prodigy InfoTech Cyber Security Internship**

### Task 2

> **Pixel Manipulation for Image Encryption**

The task focuses on developing an image encryption tool that performs operations on pixel values and allows users to encrypt and decrypt images.

PixelCrypt expands this concept into a complete full-stack web application with multiple reversible pixel-transformation methods, validation, verification, testing, and a modern graphical user interface.

---

# 🚀 Future Improvements

Possible future enhancements include:

* AES-GCM encryption mode for actual cryptographic protection
* Password-based key derivation using Argon2 or PBKDF2
* Drag-and-drop batch processing
* Image comparison slider
* Encryption history
* User authentication
* Temporary encrypted file storage
* Cloud deployment
* Docker support
* Rate limiting
* Advanced metadata sanitization
* Additional image transformation modes
* Progressive Web App support

---

# 📜 License

This project is licensed under the terms specified in the [LICENSE](LICENSE) file.

---

## 🔐 PixelCrypt

**Upload • Transform • Encrypt • Verify • Recover**

A portfolio project demonstrating pixel-level image transformation, reversible algorithms, full-stack development, API design, validation, and cybersecurity concepts.

````

This matches your **current screenshot filenames exactly**:

```text
decrypted-result.png
decryption-page.png
encrypted-result.png
encryption-page.png
home.png
how-it-works.png
incorrect_key.png
````

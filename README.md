# BookBoxd 📚

## **Project Overview**
This is a **book tracking and recommendation web app**, similar to Goodreads or a Letterboxd but for books. Users can:
- 📖 **Search for books** using Google Books API.
- ✅ **Mark books as "Read" or "Want to Read"**.
- ⭐ **Rate books and write reviews**.
- 🧠 **Get book recommendations** based on ratings & reading history.
- 👥 **Follow friends and see their book activity**.
- 📊 **Track reading progress** with analytics.

---

## **🛠 Intended Tech Stack**
| Feature | Technology |
|------------|--------------|
| **Frontend** | Next.js, Tailwind CSS |
| **Backend** | FastAPI  |
| **Database** | PostgreSQL (for structured data like users & books) |
| **Auth** | Firebase Auth |
| **Search** | Elasticsearch (for book search & recommendations) |
| **Caching** | Redis |
| **Recommendation System** | Collaborative Filtering + NLP (spaCy / Hugging Face) |
| **APIs** | Google Books API |

---

## **🔨 Development Plan**
### **1️⃣ Phase 1: Core Features (MVP)**
📆 *Timeline:* 2-3 months
✅ **User Authentication** (Google OAuth / Firebase Auth)
✅ **Database setup (PostgreSQL)**
✅  **Book Search Page** (Google Books API / Open Library API)
- [ ] **Add Books to "Read" or "Want to Read" lists**
✅ **Rate books**

### **2️⃣ Phase 2: Recommendations & Personalization**
📆 *Timeline:* 3-4 months
- [ ] **NLP/TF-IDF suggestion system**
- [ ] **Reading Analytics Dashboard**
- [ ] **Friend Activity Feed**
- [ ] **Written Reviews**

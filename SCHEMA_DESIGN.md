# Database Schema Design for Multi-Language Platform

## 1. Language Model (`Language.js`)
Stores the improved metadata for each supported language.

```javascript
{
    name: { type: String, required: true, unique: true }, // e.g., 'Marathi'
    code: { type: String, required: true }, // e.g., 'MR', 'HI', 'ES'
    nativeName: String, // e.g., 'मराठी'
    flag: String, // Emoji or Image URL
    enabled: { type: Boolean, default: true },
    order: { type: Number, default: 100 }
}
```

## 2. Section Template Model (`SectionTemplate.js`)
Defines the **Master Structure** that applies to ALL languages (e.g., Greetings, Alphabet).

```javascript
{
    templateId: { type: String, required: true, unique: true }, // e.g., 'greetings', 'numbers'
    title: { type: String, required: true }, // e.g., 'Greetings & Basics'
    description: String,
    icon: String,
    order: { type: Number, default: 100 },
    enabled: { type: Boolean, default: true }
}
```

## 3. Vocabulary Model (`Vocabulary.js`)
Stores the actual content for each language. This is the **scalable** part.

```javascript
{
    language: { type: String, required: true, index: true }, // e.g., 'Marathi'
    category: { type: String, required: true, index: true }, // Matches SectionTemplate.templateId (e.g., 'greetings')
    word: { type: String, required: true }, // e.g., 'नमस्कार'
    transliteration: String, // e.g., 'Namaskar'
    meaning: String, // e.g., 'Hello'
    pronunciation: String,
    example: {
        native: String,
        transliteration: String,
        english: String
    },
    imagePrompt: String,
    ttsText: String
}
```

## 4. Course Model (Dynamic)
The `Course` model is now dynamically populated or can be a lightweight reference.
We use a **Hybrid Approach**:
- If `Language` and `SectionTemplate` exist, `Courses` are generated on the fly.
- We resolve courses by `_id`, `code` (e.g. 'HI'), or `title`.

## 5. Lesson Model (`Lesson.js`)
Stores generated lesson instances (runtime data).

```javascript
{
    chapterId: String, // e.g., 'mr_greetings'
    language: String,
    level: String,
    vocabulary: [VocabularySchema], // Embedded vocabulary for the specific lesson
    exercises: [ExerciseSchema] // Generated exercises
}
```

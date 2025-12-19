# PDF Extraction & Organization Prompt

Use this prompt when you have a large PDF that needs to be broken down into digestible chunks.

---

## Prompt Template

```
I have a PDF file that's too large to process at once. I need you to:

1. **Extract the PDF into manageable chunks** using Python (pdfplumber or pypdf)
   - Break it down page by page into separate text files
   - Make each chunk easy to read and reference

2. **Ask me for organization preferences for the extracted files:**
   - Where should the chunk files go? (e.g., pdf_chunks/, extracted_pages/, custom folder name)
   - How should the files be named?
     * By page number: page_0001.txt, page_0002.txt
     * By chapter: chapter_01_intro.txt, chapter_02_validation.txt
     * By topic/section: intro.txt, methodology.txt, case_studies.txt
     * Custom naming pattern
   - Should chunks be grouped into subfolders? (e.g., chapters/ch1/, chapters/ch2/)
   - Do I want an index/table of contents file that maps page numbers to topics?
   - Should you extract ALL pages or specific ranges?

3. **Process the PDF:**
   - Set up a virtual environment if needed
   - Install required libraries (pypdf, pdfplumber)
   - Extract content with proper error handling
   - Show me a preview of the first few pages to confirm it worked

4. **Provide guidance on working with the chunks:**
   - How to read individual sections
   - How to search across all chunks
   - Token-efficient strategies for exploring the content

PDF Location: [PASTE YOUR PDF PATH HERE]
```

---

## Example Usage

**User says:**
"I have a PDF at `/path/to/my/document.pdf` that's breaking the system. Let's chunk it."

**Claude should:**
1. Acknowledge the PDF location
2. Ask: "How would you like me to organize the output? Should I create chunks by page, chapter, or custom sections? Where should they go?"
3. Wait for user preferences
4. Execute the extraction
5. Provide working instructions

---

## What This Replicates

This process replicates what we did with "Starting A Startup" PDF:
- ✓ Created virtual environment for Python libraries
- ✓ Installed pdfplumber
- ✓ Extracted 266 pages into individual text files
- ✓ Named them systematically (page_0001.txt, page_0002.txt, etc.)
- ✓ Provided preview and usage instructions
- ✓ Enabled token-efficient exploration of large content

---

## Benefits

- **Token efficiency:** Read only what you need, when you need it
- **Better comprehension:** Work through content in small, digestible pieces
- **Easy reference:** Jump to specific sections by file name
- **Searchable:** Grep across all chunks for specific topics
- **Flexible:** Can read individual pages or ranges as needed

---

## Files Created During Process

- Python extraction script (`/tmp/extract_pdf.py`)
- Virtual environment (`/tmp/pdf_venv`)
- Output directory with chunk files
- Optional: Index file listing all chunks

---

## Quick Start Command

When user provides a PDF path, start with:

```bash
# Check if PDF exists
ls -lh [PDF_PATH]

# Ask user for organization preferences
# Then proceed with extraction
```

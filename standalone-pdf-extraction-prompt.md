# Standalone PDF Extraction Prompt
## For use with AI assistants without prior context

---

## Copy and paste this entire prompt to a new AI conversation:

```
I need help extracting and organizing a large PDF file that's too big to process at once.

CONTEXT:
- Large PDFs can overwhelm token limits and make it hard to work with content
- Breaking them into page-by-page chunks makes them manageable and token-efficient
- I want to be able to read individual pages or sections without loading the entire PDF

YOUR TASK:

1. FIRST, ask me these questions about file organization:
   - Where should the extracted chunk files be saved? (folder name/path)
   - How should the files be named?
     * By page number (page_0001.txt, page_0002.txt, etc.)
     * By chapter (chapter_01_intro.txt, chapter_02_methods.txt, etc.)
     * By topic/section (intro.txt, validation.txt, growth.txt, etc.)
     * Custom pattern (let me specify)
   - Should chunks be grouped into subfolders? (e.g., chapters/ch1/, chapters/ch2/)
   - Do I want an index file that maps pages to topics/chapters?
   - Should you extract ALL pages or specific page ranges?

2. THEN, extract the PDF using this approach:
   - Create a Python virtual environment at /tmp/pdf_venv
   - Install pdfplumber and pypdf libraries
   - Write a Python script to extract text page by page
   - Handle pages with no extractable text (images, blank pages)
   - Save each page to a separate .txt file based on my preferences
   - Show me a preview of the first 2-3 pages to confirm it worked

3. AFTER extraction, provide:
   - Total page count
   - Location of output files
   - Preview of extracted content
   - Instructions for how to work with the chunks:
     * How to read specific pages
     * How to search across all chunks
     * Token-efficient strategies for exploring content

4. WORKING WITH CHUNKS:
   - Offer to break down content into easier-to-read format
   - Help organize key insights into markdown files
   - Suggest pedagogical approaches for dense material
   - Be ready to analyze specific sections when I paste them or tell you page numbers

TECHNICAL REQUIREMENTS:
- Use pdfplumber for extraction (better text handling)
- Create virtual environment to avoid system package conflicts
- Include error handling for unreadable pages
- Use proper file naming with leading zeros (page_0001 not page_1)
- Show progress during extraction for long PDFs

PDF FILE LOCATION:
[I will provide the path to the PDF]

IMPORTANT:
- Ask about file organization preferences BEFORE starting extraction
- Don't assume a naming/folder structure - let me decide
- Keep responses concise and token-efficient
- Focus on making the content accessible and digestible
```

---

## Instructions for You

When using this prompt with a new AI:

1. **Copy the entire prompt above** (everything in the code block)
2. **Paste it into a new conversation** with another AI assistant
3. **Add your PDF file path** at the bottom where it says "[I will provide the path to the PDF]"
4. **Answer their questions** about file organization
5. **Let them process** the PDF

The AI will have all the context it needs to replicate what we did together.

---

## What This Achieves

This prompt gives a fresh AI everything needed to:
- Understand why we're chunking PDFs
- Ask you how to organize the output
- Execute the extraction properly
- Provide useful working instructions
- Help you analyze the content afterward

No prior conversation history needed!

Got it. You’re essentially building a developer / data-worker utility surface, and you want genuinely useful, non-gimmicky features—not AI fluff.

I’ll approach this analytically and add features only where there is a real, recurring workflow pain.

Below is a curated expansion, grouped by category, with brief justification so you can judge value.

1. Text & String Utilities (high-frequency, low-friction)

These are used constantly and justify their existence.

Case & Formatting (beyond what you have)

Sentence case – useful for UI labels

Constant case (FOO_BAR) – env vars

Slugify – URLs, IDs

Remove diacritics – normalization for search/indexing

Normalize whitespace – tabs → spaces, smart quotes → ASCII

Content Cleanup

Remove duplicate lines

Sort lines (asc / desc)

Filter lines (contains / regex)

Prefix / suffix each line

Number lines

Wrap lines at N characters

2. JSON Utilities (very high value for your target users)

You already have basics; here’s what people actually need next.

Inspection & Safety

JSON diff (side-by-side)

Sort keys (deep) – stable comparisons

Detect duplicate keys

Find paths (JSONPath auto-suggest)

Flatten / unflatten JSON

Redact fields (PII-safe copy)

Transformation

JSON → CSV

JSON → SQL INSERT

JSON → OpenAPI schema

JSON → TypeScript type

JSON → Zod schema

Filter JSON by path

Map/rename keys

These are massively useful in data + backend workflows.

3. SQL Utilities (strong overlap with your SQL explorer)

These directly complement your product.

Query Helpers

Explain plan formatter

Auto-parameterize query

Extract table/column lineage

Detect anti-patterns

SELECT *

missing LIMIT

cartesian joins

Data Conversion

Result → Markdown table

Result → JSON schema

Result → CSV

Result → chart-ready JSON

This is where your AI visualization flow plugs in naturally.

4. Date & Time Utilities (surprisingly under-served)

Painful, repetitive tasks.

Timestamp ↔ ISO ↔ human

Timezone conversion

Date math (add/subtract)

Generate date ranges

Detect invalid dates

Bucket timestamps (hour/day/week)

Extremely useful for analytics and debugging.

5. Array / List Utilities (practical, not toy)

Beyond reverse/sort/unique:

Chunk array

Group by key

Frequency count

Intersection / union / diff

Stable sort by key

Deduplicate by field

6. Regex & Pattern Tools (power users)

These save minutes per use.

Regex tester with explanations

Generate regex from example text

Extract matches as JSON

Replace with preview

Named capture group viewer

7. Encoding & Decoding (debugging essentials)

Base64 encode/decode

URL encode/decode

JWT decode (no verify)

HTML escape/unescape

Unicode inspector

8. Schema & Type Utilities (modern dev workflows)

High leverage, low UI cost.

SQL schema → TypeScript

SQL schema → Prisma

JSON → Avro / Parquet schema

Validate data against schema

Schema diff

9. Data Quality & Validation (very relevant to analytics)

Null / empty analysis

Outlier detection (simple stats)

Column profiling

min / max

cardinality

% null

Type inference

Sample rows

This dovetails perfectly with your AI insights + visualization layer.

10. AI-Assisted (only where it actually helps)

Avoid “AI everywhere”. Use it surgically.

Explain this data

Suggest visualizations

Generate summary stats

Detect anomalies

Rewrite query safely

Generate dashboard JSON (your json-render use case)

These should always be:

optional

constrained

inspectable

11. Meta Utilities (small but loved)

These improve daily ergonomics.

Clipboard history

Favorite tools

Recent transformations

Shareable links

Command palette

Keyboard-only mode

12. What I would not add (important restraint)

Avoid:

Novelty AI tools without determinism

Code generators without validation

Features that hide transformations

“Magic” buttons with no preview

They reduce trust.

Strategic takeaway

You’re not building:

“a bunch of utilities”

You’re building:

a high-trust transformation layer between raw data and insight

Every feature should answer:

Does this remove a repetitive step?

Is the output inspectable?

Can it compose with SQL + JSON + AI visualization?

If you want next, I can:

Prioritize these into MVP vs Phase 2

Map features → personas (analyst, backend, PM)

Show where AI visualization fits naturally without feeling bolted on

Just tell me how you want to slice it.
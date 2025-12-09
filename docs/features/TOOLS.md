# Tools Implementation Guide

This document outlines the architecture and implementation details of the "Tools" system (Calculators, etc.) in the CMS.

## Overview

The Tools system allows administrators to create and manage interactive tools (primarily pharmaceutical calculators) that run via Supabase Edge Functions. The system consists of:

1.  **Database**: A `tools` table storing configuration and metadata.
2.  **Frontend**: A dynamic `ToolRunner` component that renders forms based on JSON configuration.
3.  **Backend**: Supabase Edge Functions that perform the actual calculations/logic.
4.  **Admin UI**: A builder interface for creating and managing tools.

## 1. Database Schema

The core of the system is the `tools` table in Supabase.

### Table: `tools`

| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | `uuid` | Primary Key (auto-generated) |
| `title` | `text` | Display title of the tool |
| `description` | `text` | Short description shown on cards |
| `category` | `text` | Grouping category (e.g., "Body Metrics", "Renal Function") |
| `endpoint_url` | `text` | Name of the Supabase Edge Function (e.g., `ibw-calculator`) |
| `inputs` | `jsonb` | Array defining the form fields (see below) |
| `content` | `text` | Rich text content/documentation for the tool page |
| `seo_title` | `text` | SEO Meta Title |
| `seo_description` | `text` | SEO Meta Description |
| `seo_keywords` | `text` | SEO Keywords |
| `slug` | `text` | URL slug for the tool page |
| `created_at` | `timestamptz` | Creation timestamp |

### Input Configuration (`inputs` JSONB)

The `inputs` column stores an array of objects defining the form fields:

```json
[
  {
    "key": "weight",
    "label": "Weight (kg)",
    "type": "number"
  },
  {
    "key": "gender",
    "label": "Gender",
    "type": "select",
    "options": [
      { "label": "Male", "value": "male" },
      { "label": "Female", "value": "female" }
    ]
  }
]
```

## 2. Frontend Architecture

### `ToolRunner` Component
**Location**: `components/ToolRunner.tsx`

This is the main engine that renders the tool interface.
- **Props**: Accepts a `tool` object (from the database).
- **State**: Manages `formData` (inputs) and `result` (outputs).
- **Execution**:
    1. Collects user input.
    2. Calls `supabase.functions.invoke(endpoint_url, { body: formData })`.
    3. Displays the result (Success, Warning, Error) or renders 3D structures if returned.

### Admin Tool Builder
**Location**: `app/admin/tools/create/page.tsx`

Allows admins to:
- Define tool metadata (Title, Category, SEO).
- Configure the Edge Function endpoint.
- Visually build the input form (Add fields, set types, define dropdown options).

## 3. Backend Architecture (Edge Functions)

Each tool corresponds to a Supabase Edge Function.

**Location**: `supabase/functions/<function-name>/index.ts`

### Standard Pattern
1.  **Receive Input**: Parse JSON body for input keys (e.g., `weight`, `height`).
2.  **Validate**: Check for missing or invalid values.
3.  **Calculate**: Perform the business logic.
4.  **Return Response**: Return a JSON object with the standard result structure.

### Response Format
The Edge Function must return a JSON object matching this interface:

```typescript
interface ToolResult {
    status?: 'SAFE' | 'WARNING' | 'ERROR'; // Optional status for styling
    message?: string; // Main result message (if simple text)
    result?: string | number; // Raw result value
    html?: string; // Optional HTML to render instead of message
    calculation_steps?: string[]; // Optional array of steps to show breakdown
    interpretation?: string; // Optional text explaining the result
    structures?: { // Optional 3D molecule data
        cid: number;
        info: string;
        sdf?: string;
    };
}
```

## 4. How to Add a New Tool

### Step 1: Create the Edge Function
1.  Create a new directory: `supabase/functions/my-new-calculator`.
2.  Create `index.ts` and implement the logic (follow existing examples like `abw-calculator`).
3.  Deploy the function: `supabase functions deploy my-new-calculator`.

### Step 2: Register in Admin UI
1.  Go to `/admin/tools/create`.
2.  **Title**: "My New Calculator".
3.  **Endpoint URL**: `my-new-calculator` (must match the folder name).
4.  **Inputs**: Add fields that match the JSON keys your function expects.
5.  **Publish**: Click "Publish Tool".

### Step 3: Verify
1.  Go to the public tools page.
2.  Open your new tool.
3.  Test with valid and invalid inputs to ensure the Edge Function is connected correctly.

## 5. Advanced Features: Steps, Interpretations & Warnings

The system supports rich feedback for calculations beyond just a simple result number.

### Calculation Steps (`calculation_steps`)
- **Type**: `string[]`
- **Purpose**: To show the user exactly how the result was derived (transparency).
- **Usage**: Return an array of strings in the JSON response.
- **Example**:
  ```json
  {
    "calculation_steps": [
      "Converted weight to kg: 150 lbs / 2.2 = 68.18 kg",
      "Calculated BSA: ... = 1.78 m²"
    ]
  }
  ```

### Interpretation (`interpretation`)
- **Type**: `string`
- **Purpose**: To provide clinical context or explanation for the result.
- **Usage**: Return a string in the JSON response.
- **Example**: "This patient is considered Obese Class I."

### Status & Warnings (`status`)
- **Type**: `'SAFE' | 'WARNING' | 'ERROR'`
- **Purpose**: To visually color-code the result based on clinical safety or validity.
- **UI Behavior**:
  - `SAFE` (Green): Normal/Safe range.
  - `WARNING` (Red/Orange): Abnormal, high risk, or requires attention.
  - `ERROR` (Yellow): Input error or calculation failure.

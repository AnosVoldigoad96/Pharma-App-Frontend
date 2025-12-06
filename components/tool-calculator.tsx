"use client";

import { useState, useEffect, useMemo, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Loader2, CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import type { Tool } from "@/lib/supabase/types";
import { supabase } from "@/lib/supabase/client";

interface ToolCalculatorProps {
  tool: Tool;
}

// Component to fetch and display PubChem structure data using API
function StructureViewer({ cid, smiles }: { cid?: number; smiles?: string }) {
  const [structureData, setStructureData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [structureImage, setStructureImage] = useState<string | null>(null);

  // Debug logging
  useEffect(() => {
    console.log('StructureViewer props:', { cid, smiles });
  }, [cid, smiles]);

  useEffect(() => {
    // Immediately set structure image if SMILES is provided
    if (smiles) {
      console.log('Setting structure image from SMILES:', smiles);
      setStructureImage(
        `https://www.molview.org/smiles/${encodeURIComponent(smiles)}?width=600&height=400`
      );
      setLoading(false); // Don't wait for API if we have SMILES
    }

    const fetchStructureData = async () => {
      if (!cid) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        console.log('Fetching PubChem data for CID:', cid);
        // Fetch compound data from PubChem REST API
        const response = await fetch(
          `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cid}/JSON`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch compound data');
        }

        const data = await response.json();
        const compound = data.PC_Compounds?.[0];
        
        if (compound) {
          // Extract properties
          const props = compound.props || [];
          const extractedData: any = {};

          props.forEach((prop: any) => {
            const label = prop.urn?.label;
            if (label) {
              if (prop.value) {
                if (prop.value.sval) {
                  extractedData[label] = prop.value.sval;
                } else if (prop.value.fval) {
                  extractedData[label] = prop.value.fval;
                } else if (prop.value.ival) {
                  extractedData[label] = prop.value.ival;
                }
              }
            }
          });

          console.log('Extracted structure data:', extractedData);
          setStructureData(extractedData);

          // Generate structure image URL from SMILES (if not already set)
          if (!smiles && extractedData['Canonical SMILES']) {
            console.log('Setting structure image from API SMILES:', extractedData['Canonical SMILES']);
            setStructureImage(
              `https://www.molview.org/smiles/${encodeURIComponent(extractedData['Canonical SMILES'])}?width=600&height=400`
            );
          }
        }
      } catch (err) {
        console.error('Error fetching structure data:', err);
        // Don't set error if we have SMILES - we can still display structures
        if (!smiles) {
          setError(err instanceof Error ? err.message : 'Failed to load structure data');
        }
      } finally {
        setLoading(false);
      }
    };

    if (cid) {
      fetchStructureData();
    } else if (!smiles) {
      // If we have neither CID nor SMILES, set loading to false
      setLoading(false);
    }
  }, [cid, smiles]);

  const smilesString = smiles || structureData?.['Canonical SMILES'] || '';
  const structure2DUrl = structureImage || (smilesString 
    ? `https://www.molview.org/smiles/${encodeURIComponent(smilesString)}?width=600&height=400`
    : null);
  const structure3DUrl = smilesString 
    ? `https://www.molview.org/smiles/${encodeURIComponent(smilesString)}?width=600&height=500&view=3d`
    : null;

  // Show loading only if we don't have SMILES and are still fetching
  if (loading && !smilesString) {
    return (
      <div className="bg-muted/30 rounded-lg border border-border p-8 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-primary" />
          <p className="text-sm text-muted-foreground">Loading structure data...</p>
        </div>
      </div>
    );
  }

  // Show error only if we have no SMILES and no structure image
  if (error && !smilesString && !structure2DUrl) {
    return (
      <div className="bg-muted/30 rounded-lg border border-border p-8 text-center min-h-[400px] flex items-center justify-center">
        <div>
          <AlertTriangle className="w-8 h-8 mx-auto mb-2 text-destructive" />
          <p className="text-sm text-destructive mb-2">{error}</p>
          <p className="text-xs text-muted-foreground">Unable to load structure visualization</p>
        </div>
      </div>
    );
  }

  // If no structures can be displayed, show message
  if (!structure2DUrl && !structure3DUrl) {
    return (
      <div className="bg-muted/30 rounded-lg border border-border p-8 text-center min-h-[400px] flex items-center justify-center">
        <div>
          <p className="text-sm text-muted-foreground mb-2">Structure visualization unavailable</p>
          <p className="text-xs text-muted-foreground">SMILES notation or CID required</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 2D Structure Section */}
      {structure2DUrl && (
        <div>
          <h6 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-primary"></span>
            2D Structure
          </h6>
          <div className="bg-card rounded-lg p-4 border border-border shadow-sm">
            <img
              src={structure2DUrl}
              alt="2D Molecular Structure"
              className="w-full h-auto max-w-full rounded mx-auto"
              style={{ maxWidth: '600px' }}
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
        </div>
      )}

      {/* 3D Structure Section */}
      {structure3DUrl && (
        <div>
          <h6 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-primary"></span>
            3D Structure
          </h6>
          <div className="bg-card rounded-lg p-4 border border-border shadow-sm">
            <img
              src={structure3DUrl}
              alt="3D Molecular Structure"
              className="w-full h-auto max-w-full rounded mx-auto"
              style={{ maxWidth: '600px' }}
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
                const parent = (e.target as HTMLImageElement).parentElement;
                if (parent) {
                  parent.innerHTML = `
                    <div class="text-center p-8 bg-muted/30 rounded">
                      <p class="text-sm text-muted-foreground mb-3">3D structure preview unavailable</p>
                      <a href="https://www.molview.org/?smiles=${encodeURIComponent(smilesString)}&view=3d" 
                         target="_blank" 
                         rel="noopener noreferrer"
                         class="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors text-sm font-medium">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        Open Interactive 3D Viewer
                      </a>
                    </div>
                  `;
                }
              }}
            />
          </div>
        </div>
      )}

      {/* Additional Structure Properties */}
      {structureData && Object.keys(structureData).length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          {structureData['Molecular Formula'] && (
            <div className="bg-muted/50 p-3 rounded border border-border">
              <div className="text-xs font-semibold text-muted-foreground uppercase mb-1">
                Molecular Formula
              </div>
              <div className="font-mono font-bold text-foreground">
                {structureData['Molecular Formula']}
              </div>
            </div>
          )}
          {structureData['Molecular Weight'] && (
            <div className="bg-muted/50 p-3 rounded border border-border">
              <div className="text-xs font-semibold text-muted-foreground uppercase mb-1">
                Molecular Weight
              </div>
              <div className="font-bold text-foreground">
                {structureData['Molecular Weight']} g/mol
              </div>
            </div>
          )}
        </div>
      )}

      {/* Interactive Viewers */}
      {smilesString && (
        <div className="flex flex-wrap gap-3 justify-center pt-2 border-t border-border">
          <a
            href={`https://www.molview.org/?smiles=${encodeURIComponent(smilesString)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors text-sm font-medium"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Interactive 2D Viewer
          </a>
          <a
            href={`https://www.molview.org/?smiles=${encodeURIComponent(smilesString)}&view=3d`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors text-sm font-medium"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            Interactive 3D Viewer
          </a>
        </div>
      )}
    </div>
  );
}

interface InputField {
  key?: string; // Primary identifier (from CMS implementation)
  name?: string; // Fallback identifier
  type: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  options?: string[] | { value: string; label: string }[];
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  default?: string | number;
}

// Support both simple string steps and detailed step objects
type CalculationStep = string | {
  step?: number;
  description: string;
  formula?: string;
  value?: string | number;
  unit?: string;
};

interface ReferenceRange {
  label: string;
  range: string; // e.g., "18.5-24.9" or "<18.5"
  description?: string; // Optional description for the range
}

interface ToolResult {
  status?: 'SAFE' | 'WARNING' | 'ERROR';
  message?: string;
  result?: string | number;
  html?: string;
  steps?: CalculationStep[]; // Can be string[] or detailed step objects[]
  calculation_steps?: string[]; // Simple string array (per TOOLS_IMPLEMENTATION.md)
  interpretation?: string; // Clinical context/explanation
  ranges?: ReferenceRange[]; // Reference ranges (e.g., normal, underweight, overweight)
  structures?: {
    cid: number;
    info?: string;
    sdf?: string;
    molecular_formula?: string;
    molecular_weight?: string | number;
    iupac_name?: string;
    canonical_smiles?: string;
  };
}

export function ToolCalculator({ tool }: ToolCalculatorProps) {
  // Parse inputs from JSONB - handle both array and object formats
  // According to TOOLS_IMPLEMENTATION.md, inputs use 'key' as primary identifier
  const parseInputs = (): InputField[] => {
    if (!tool.inputs) return [];
    
    // If it's already an array, normalize it
    if (Array.isArray(tool.inputs)) {
      return (tool.inputs as InputField[]).map((input, index) => {
        // Use 'key' as primary identifier, fallback to 'name', then generate one
        const identifier = input.key || input.name || `input_${index}`;
        return { 
          ...input, 
          key: input.key || identifier,
          name: identifier // Use name internally for formData keys
        };
      });
    }
    
    // If it's an object, try to convert it to an array
    if (typeof tool.inputs === 'object') {
      const obj = tool.inputs as Record<string, unknown>;
      
      // Check if it has a 'fields' or 'inputs' property
      if (Array.isArray(obj.fields)) {
        return (obj.fields as InputField[]).map((input, index) => {
          const identifier = input.key || input.name || `field_${index}`;
          return { 
            ...input, 
            key: input.key || identifier,
            name: identifier
          };
        });
      }
      if (Array.isArray(obj.inputs)) {
        return (obj.inputs as InputField[]).map((input, index) => {
          const identifier = input.key || input.name || `input_${index}`;
          return { 
            ...input, 
            key: input.key || identifier,
            name: identifier
          };
        });
      }
      
      // If it's an object with field definitions, convert to array
      return Object.entries(obj).map(([key, config]) => {
        if (typeof config === 'object' && config !== null) {
          const inputConfig = config as Omit<InputField, 'key' | 'name'>;
          return { 
            key, 
            name: key, // Use the object key as both key and name
            ...inputConfig 
          } as InputField;
        }
        return { key, name: key, type: 'text', label: key } as InputField;
      });
    }
    
    return [];
  };

  // Memoize inputs to prevent unnecessary re-renders
  const inputs = useMemo(() => parseInputs(), [tool.inputs, tool.id]);

  // Initialize form data with defaults immediately
  const getInitialFormData = (): Record<string, string | number> => {
    const initial: Record<string, string | number> = {};
    inputs.forEach((input) => {
      // Use name (which is set from key or name) as the formData key
      const fieldName = input.name || input.key;
      if (!fieldName) return;
      
      // Initialize fields with default value or empty string
      // Note: Select fields will use empty string but we'll convert to undefined for the component
      if (input.default !== undefined) {
        initial[fieldName] = input.default;
      } else if (input.type === "select" || input.type === "dropdown") {
        // For Select, we'll use empty string in formData but pass undefined to the component
        // This keeps formData consistent while allowing Select to be uncontrolled initially
        initial[fieldName] = "";
      } else {
        // Initialize text/number inputs with empty string to keep them controlled
        initial[fieldName] = "";
      }
    });
    return initial;
  };

  const [formData, setFormData] = useState<Record<string, string | number>>(() => getInitialFormData());
  const [result, setResult] = useState<ToolResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Update form data when tool changes
  useEffect(() => {
    setFormData(getInitialFormData());
    setResult(null);
    setError(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tool.id]);

  const handleInputChange = (name: string, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(null);
    setResult(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);
    setIsLoading(true);

    try {
      // Prepare data for API call using 'key' as the field identifier (per TOOLS_IMPLEMENTATION.md)
      const payload: Record<string, string | number> = {};
      inputs.forEach((input) => {
        const fieldKey = input.key || input.name; // Use 'key' as primary, fallback to 'name'
        if (!fieldKey) {
          console.warn('Input missing key/name:', input);
          return;
        }
        
        const value = formData[input.name || fieldKey];
        if (value !== undefined && value !== "" && value !== null) {
          // Convert to number if input type is number
          if (input.type === "number") {
            const numValue = typeof value === "string" ? parseFloat(value) : Number(value);
            if (!isNaN(numValue)) {
              payload[fieldKey] = numValue; // Use 'key' in payload
            } else {
              throw new Error(`${input.label || fieldKey} must be a valid number`);
            }
          } else {
            payload[fieldKey] = value; // Use 'key' in payload
          }
        } else if (input.required) {
          throw new Error(`${input.label || fieldKey} is required`);
        }
      });

      // Call Supabase Edge Function (per TOOLS_IMPLEMENTATION.md)
      // endpoint_url is the function name (e.g., 'ibw-calculator')
      const { data, error: functionError } = await supabase.functions.invoke(tool.endpoint_url, {
        body: payload,
      });

      if (functionError) {
        throw new Error(functionError.message || "Failed to execute tool");
      }

      // Handle ToolResult format
      if (data) {
        console.log('Tool response data:', data);
        // Handle both 'steps' (camelCase) and 'calculation_steps' (snake_case) from Edge Functions
        const responseData = data as any;
        const steps = responseData.steps || responseData.calculation_steps;
        console.log('Steps in response:', steps);
        console.log('Interpretation:', responseData.interpretation);
        
        // Normalize the response to use 'steps' consistently
        // Support both string[] (simple) and object[] (detailed) formats
        const normalizedData: ToolResult = {
          ...responseData,
          steps: steps || undefined,
          calculation_steps: responseData.calculation_steps || undefined,
          interpretation: responseData.interpretation || undefined,
          ranges: responseData.ranges || responseData.reference_ranges || undefined,
        };
        
        setResult(normalizedData);
      } else {
        throw new Error("No data returned from tool");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setFormData(getInitialFormData());
    setResult(null);
    setError(null);
  };

  const renderInput = (input: InputField) => {
    // Ensure input has a name (use key as fallback)
    const fieldName = input.name || input.key;
    if (!fieldName) {
      console.error('Input missing name/key property:', input);
      return <div className="text-destructive">Error: Input missing name/key property</div>;
    }
    
    // Get value - ensure it's always a string for controlled inputs
    const rawValue = formData[fieldName];
    const value = rawValue !== undefined && rawValue !== null ? String(rawValue) : "";
    
    const hasError = error && (value === "" || formData[fieldName] === undefined) && input.required;

    switch (input.type) {
      case "select":
      case "dropdown":
        // Radix UI Select requires undefined for uncontrolled (no selection)
        // or a valid option value for controlled (selection made)
        // We use empty string in formData but convert to undefined for Select
        // This ensures Select is always uncontrolled when empty, preventing the warning
        return (
          <Select
            value={value === "" ? undefined : value}
            onValueChange={(val) => handleInputChange(fieldName, val || "")}
            required={input.required}
          >
            <SelectTrigger className={hasError ? "border-destructive" : ""}>
              <SelectValue placeholder={input.placeholder || `Select ${input.label || fieldName}`} />
            </SelectTrigger>
            <SelectContent>
              {input.options?.map((option) => {
                const optionValue = typeof option === "string" ? option : option.value;
                const optionLabel = typeof option === "string" ? option : option.label;
                return (
                  <SelectItem key={optionValue} value={optionValue}>
                    {optionLabel}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        );

      case "number":
        return (
          <Input
            type="number"
            id={fieldName}
            name={fieldName}
            value={value}
            onChange={(e) => {
              const val = e.target.value;
              // Allow empty string and keep as string while typing, convert to number on submit
              handleInputChange(fieldName, val);
            }}
            placeholder={input.placeholder}
            required={input.required}
            min={input.min}
            max={input.max}
            step={input.step || 1}
            className={hasError ? "border-destructive" : ""}
          />
        );

      case "text":
      case "email":
      default:
        return (
          <Input
            type={input.type || "text"}
            id={fieldName}
            name={fieldName}
            value={value}
            onChange={(e) => {
              handleInputChange(fieldName, e.target.value);
            }}
            placeholder={input.placeholder}
            required={input.required}
            className={hasError ? "border-destructive" : ""}
          />
        );
    }
  };

  // Debug: Log inputs to console (remove in production)
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Tool inputs:', tool.inputs);
      console.log('Parsed inputs:', inputs);
      console.log('Inputs with keys:', inputs.map(i => ({ key: i.key, name: i.name, type: i.type, label: i.label })));
    }
  }, [tool.id, inputs]);

  if (inputs.length === 0) {
    return (
      <div className="bg-card border rounded-lg p-6">
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-4">
            No input fields configured for this tool.
          </p>
          <p className="text-sm text-muted-foreground">
            Please configure the inputs field in the database.
          </p>
          <pre className="mt-4 p-4 bg-muted rounded text-xs overflow-auto text-left">
            {JSON.stringify(tool.inputs, null, 2)}
          </pre>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border rounded-lg p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {inputs.map((input, index) => {
          const fieldName = input.name || input.key || `input-${index}`;
          return (
            <div key={fieldName} className="space-y-2">
              <Label htmlFor={fieldName}>
                {input.label || fieldName}
                {input.required && <span className="text-destructive ml-1">*</span>}
                {input.unit && (
                  <span className="text-muted-foreground ml-2">({input.unit})</span>
                )}
              </Label>
              {renderInput(input)}
            </div>
          );
        })}

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-md text-destructive flex items-start gap-2">
            <XCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold">Error</p>
              <p>{error}</p>
            </div>
          </div>
        )}

        {/* Result - Handle ToolResult format with status, message, html, structures, steps */}
        {result && (
          <div
            className={`p-6 rounded-lg border ${
              result.status === 'ERROR'
                ? 'bg-destructive/10 border-destructive/20 text-destructive'
                : result.status === 'WARNING'
                ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-700 dark:text-yellow-400'
                : 'bg-primary/10 border-primary/20 text-primary'
            }`}
          >
            {/* Status Icon */}
            <div className="flex items-center gap-2 mb-3">
              {result.status === 'ERROR' && <XCircle className="h-5 w-5" />}
              {result.status === 'WARNING' && <AlertTriangle className="h-5 w-5" />}
              {(result.status === 'SAFE' || !result.status) && <CheckCircle2 className="h-5 w-5" />}
              <h3 className="text-lg font-semibold">Result</h3>
            </div>

            {/* HTML Content (if provided) */}
            {result.html && (
              <div
                className="prose prose-sm max-w-none dark:prose-invert mb-4"
                dangerouslySetInnerHTML={{ __html: result.html }}
              />
            )}

            {/* Calculation Steps (if provided) - Support both string[] and object[] */}
            {((result.steps && Array.isArray(result.steps) && result.steps.length > 0) ||
              (result.calculation_steps && Array.isArray(result.calculation_steps) && result.calculation_steps.length > 0)) && (
              <div className="mb-4">
                <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-bold">
                    =
                  </span>
                  Calculation Steps
                </h4>
                <div className="space-y-3">
                  {(result.steps || result.calculation_steps || []).map((step, index) => {
                    // Handle simple string format (per TOOLS_IMPLEMENTATION.md)
                    if (typeof step === 'string') {
                      return (
                        <div
                          key={index}
                          className="p-3 bg-muted/50 rounded-md border-l-4 border-primary/50"
                        >
                          <div className="flex items-start gap-3">
                            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex-shrink-0 mt-0.5">
                              {index + 1}
                            </span>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium">{step}</p>
                            </div>
                          </div>
                        </div>
                      );
                    }
                    
                    // Handle detailed object format
                    if (typeof step === 'object' && step !== null) {
                      const stepObj = step as {
                        step?: number;
                        description?: string;
                        formula?: string;
                        value?: string | number;
                        unit?: string;
                      };
                      
                      // Skip if no meaningful content
                      if (!stepObj.description && !stepObj.formula && stepObj.value === undefined) {
                        return null;
                      }
                      
                      return (
                        <div
                          key={index}
                          className="p-3 bg-muted/50 rounded-md border-l-4 border-primary/50"
                        >
                          <div className="flex items-start gap-3">
                            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex-shrink-0 mt-0.5">
                              {stepObj.step !== undefined && stepObj.step !== null ? stepObj.step : index + 1}
                            </span>
                            <div className="flex-1 min-w-0">
                              {stepObj.description && (
                                <p className="text-sm font-medium mb-1">{stepObj.description}</p>
                              )}
                              {stepObj.formula && (
                                <div className="mt-2 p-2 bg-background rounded border font-mono text-xs break-all">
                                  {stepObj.formula}
                                </div>
                              )}
                              {stepObj.value !== undefined && stepObj.value !== null && (
                                <div className="mt-2 flex items-baseline gap-2">
                                  <span className="text-lg font-semibold text-primary">
                                    {stepObj.value}
                                  </span>
                                  {stepObj.unit && (
                                    <span className="text-sm text-muted-foreground">
                                      {stepObj.unit}
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    }
                    
                    return null;
                  })}
                </div>
              </div>
            )}

            {/* Interpretation (if provided) */}
            {result.interpretation && (
              <div className="mb-4 p-4 bg-muted/30 rounded-md border border-border">
                <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary/20 text-primary text-xs">
                    ℹ
                  </span>
                  Interpretation
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                  {result.interpretation}
                </p>
                
                {/* Reference Ranges (if provided) */}
                {result.ranges && Array.isArray(result.ranges) && result.ranges.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-border">
                    <h5 className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
                      Reference Ranges
                    </h5>
                    <div className="space-y-2">
                      {result.ranges.map((range, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-2 text-xs"
                        >
                          <span className="font-medium text-foreground min-w-[80px]">
                            {range.label}:
                          </span>
                          <div className="flex-1">
                            <span className="font-mono text-primary font-semibold">
                              {range.range}
                            </span>
                            {range.description && (
                              <span className="text-muted-foreground ml-2">
                                ({range.description})
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* Ranges without interpretation (if only ranges are provided) */}
            {!result.interpretation && result.ranges && Array.isArray(result.ranges) && result.ranges.length > 0 && (
              <div className="mb-4 p-4 bg-muted/30 rounded-md border border-border">
                <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary/20 text-primary text-xs">
                    📊
                  </span>
                  Reference Ranges
                </h4>
                <div className="space-y-2">
                  {result.ranges.map((range, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-2 text-sm"
                    >
                      <span className="font-medium text-foreground min-w-[100px]">
                        {range.label}:
                      </span>
                      <div className="flex-1">
                        <span className="font-mono text-primary font-semibold">
                          {range.range}
                        </span>
                        {range.description && (
                          <span className="text-muted-foreground ml-2">
                            ({range.description})
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Final Message or Result Value */}
            {!result.html && (result.message || result.result !== undefined) && (
              <div className="mb-4">
                <p className="text-2xl font-bold">
                  {result.message || result.result}
                </p>
              </div>
            )}

            {/* PubChem Structures (if provided) */}
            {result.structures && result.structures.cid && (
              <div className="mt-4 space-y-6">
                {/* Compound Overview Section */}
                <div className="bg-card rounded-lg border border-border shadow-sm p-6">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-foreground mb-4 pb-3 border-b-2 border-primary">
                      Compound Overview
                    </h2>
                  </div>
                  
                  <div className="space-y-4">
                    {/* PubChem CID - Featured Card */}
                    <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 p-5 rounded-lg border border-primary/30 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-primary font-semibold text-sm uppercase tracking-wide">
                          PubChem CID
                        </span>
                        <span className="text-xs text-muted-foreground bg-primary/10 px-2 py-1 rounded">
                          Identifier
                        </span>
                      </div>
                      <div className="text-3xl font-bold text-foreground font-mono">
                        {result.structures.cid}
                      </div>
                    </div>

                    {/* Grid Layout for Formula and Weight */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Molecular Formula */}
                      {result.structures.molecular_formula && (
                        <div className="bg-card p-5 rounded-lg border border-border shadow-sm hover:shadow-md transition-shadow">
                          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                            Molecular Formula
                          </div>
                          <div className="text-2xl font-mono font-bold text-foreground">
                            {result.structures.molecular_formula}
                          </div>
                        </div>
                      )}

                      {/* Molecular Weight */}
                      {result.structures.molecular_weight && (
                        <div className="bg-card p-5 rounded-lg border border-border shadow-sm hover:shadow-md transition-shadow">
                          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                            Molecular Weight
                          </div>
                          <div className="text-2xl font-bold text-foreground">
                            {result.structures.molecular_weight} {typeof result.structures.molecular_weight === 'number' ? 'g/mol' : ''}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* IUPAC Name */}
                    {result.structures.iupac_name && (
                      <div className="bg-card p-5 rounded-lg border border-border shadow-sm hover:shadow-md transition-shadow">
                        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                          IUPAC Name
                        </div>
                        <div className="text-sm text-foreground break-words leading-relaxed font-medium">
                          {result.structures.iupac_name}
                        </div>
                      </div>
                    )}

                    {/* Canonical SMILES */}
                    {result.structures.canonical_smiles && (
                      <div className="bg-card p-5 rounded-lg border border-border shadow-sm hover:shadow-md transition-shadow">
                        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                          Canonical SMILES
                        </div>
                        <div className="bg-muted/50 p-4 rounded-lg border border-border overflow-x-auto">
                          <code className="text-xs font-mono text-foreground break-all block">
                            {result.structures.canonical_smiles}
                          </code>
                        </div>
                      </div>
                    )}

                    {/* Info/Description */}
                    {result.structures.info && (
                      <div className="bg-card p-5 rounded-lg border border-border shadow-sm hover:shadow-md transition-shadow">
                        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                          Description
                        </div>
                        <div className="text-sm text-foreground leading-relaxed">
                          {result.structures.info}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Minimal Data Source Attribution */}
                  {result.structures.cid && (
                    <div className="mt-6 pt-4 border-t border-border">
                      <div className="flex items-center justify-end text-xs text-muted-foreground">
                        <span className="opacity-60">CID: {result.structures.cid}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Structure Visualization Section - Custom Component with API Fetching */}
                {(result.structures?.cid || result.structures?.canonical_smiles) && (
                  <div className="bg-card rounded-lg border border-border shadow-sm p-6 space-y-6">
                    <h2 className="text-2xl font-bold text-foreground mb-4 pb-3 border-b-2 border-primary">
                      Structure Visualization
                    </h2>

                    {/* Custom Structure Viewer Component - Shows both 2D and 3D */}
                    <div className="bg-muted/30 rounded-lg border border-border p-6">
                      <StructureViewer
                        cid={result.structures?.cid}
                        smiles={result.structures?.canonical_smiles}
                      />
                    </div>

                    {/* Additional Resources */}
                    <div className="pt-4 border-t border-border">
                      <h5 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wide flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                        Additional Resources
                      </h5>
                      <div className="flex flex-wrap gap-3">
                        <a
                          href={`https://pubchem.ncbi.nlm.nih.gov/compound/${result.structures.cid}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-3 py-2 bg-muted hover:bg-muted/80 rounded-md text-sm text-foreground transition-colors"
                        >
                          View Full Compound Data
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                        {result.structures.canonical_smiles && (
                          <a
                            href={`https://www.molview.org/?smiles=${encodeURIComponent(result.structures.canonical_smiles)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-3 py-2 bg-muted hover:bg-muted/80 rounded-md text-sm text-foreground transition-colors"
                          >
                            Open in MolView
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button type="submit" disabled={isLoading} className="flex-1">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Calculating...
              </>
            ) : (
              "Calculate"
            )}
          </Button>
          <Button type="button" variant="outline" onClick={handleReset}>
            Reset
          </Button>
        </div>
      </form>
    </div>
  );
}


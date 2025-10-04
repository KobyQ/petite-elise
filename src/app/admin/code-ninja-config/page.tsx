"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// Using normal HTML inputs instead of UI components
import { toast } from "react-toastify";
import { FaSave, FaPlus, FaTrash } from "react-icons/fa";

interface Program {
  id: string;
  title: string;
  description: string;
  features: string[];
}

interface CodeNinjaConfig {
  id?: string;
  registration_deadline: string;
  cohort_starts: string;
  programs: Program[];
}

const CodeNinjaConfig = () => {
  const [config, setConfig] = useState<CodeNinjaConfig>({
    registration_deadline: "",
    cohort_starts: "",
    programs: []
  });
  const [originalConfig, setOriginalConfig] = useState<CodeNinjaConfig>({
    registration_deadline: "",
    cohort_starts: "",
    programs: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/code-ninja-config");
      const result = await response.json();
      
      if (response.ok && result.data) {
        // Convert ISO strings back to datetime-local format for inputs
        const formattedData = {
          ...result.data,
          registration_deadline: result.data.registration_deadline 
            ? new Date(result.data.registration_deadline).toISOString().slice(0, 16)
            : "",
          cohort_starts: result.data.cohort_starts 
            ? new Date(result.data.cohort_starts).toISOString().slice(0, 16)
            : ""
        };
        setConfig(formattedData);
        setOriginalConfig(formattedData);
      }
    } catch (error) {
      console.error("Failed to fetch config:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const hasChanges = () => {
    return (
      config.registration_deadline !== originalConfig.registration_deadline ||
      config.cohort_starts !== originalConfig.cohort_starts ||
      JSON.stringify(config.programs) !== JSON.stringify(originalConfig.programs)
    );
  };

  const handleSave = async () => {
    if (!hasChanges()) {
      toast.warning("No changes to save");
      return;
    }

    setIsSaving(true);
    try {
      // Convert datetime-local values to ISO strings for Supabase
      const payload = {
        registrationDeadline: config.registration_deadline ? new Date(config.registration_deadline).toISOString() : null,
        cohortStarts: config.cohort_starts ? new Date(config.cohort_starts).toISOString() : null,
        programs: config.programs
      };

      console.log("Sending payload:", payload);

      const response = await fetch("/api/code-ninja-config", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("Configuration saved successfully!");
        // Convert ISO strings back to datetime-local format for inputs
        const formattedData = {
          ...result.data,
          registration_deadline: result.data.registration_deadline 
            ? new Date(result.data.registration_deadline).toISOString().slice(0, 16)
            : "",
          cohort_starts: result.data.cohort_starts 
            ? new Date(result.data.cohort_starts).toISOString().slice(0, 16)
            : ""
        };
        setConfig(formattedData);
        setOriginalConfig(formattedData);
      } else {
        toast.error(result.error || "Failed to save configuration");
      }
    } catch (error) {
      toast.error("Failed to save configuration");
    } finally {
      setIsSaving(false);
    }
  };

  const addProgram = () => {
    const newProgram: Program = {
      id: Date.now().toString(),
      title: "",
      description: "",
      features: [""]
    };
    setConfig(prev => ({
      ...prev,
      programs: [...prev.programs, newProgram]
    }));
  };

  const removeProgram = (programId: string) => {
    setConfig(prev => ({
      ...prev,
      programs: prev.programs.filter(p => p.id !== programId)
    }));
  };

  const updateProgram = (programId: string, field: keyof Program, value: string | string[]) => {
    setConfig(prev => ({
      ...prev,
      programs: prev.programs.map(p => 
        p.id === programId ? { ...p, [field]: value } : p
      )
    }));
  };

  const addFeature = (programId: string) => {
    updateProgram(programId, "features", [...config.programs.find(p => p.id === programId)?.features || [], ""]);
  };

  const removeFeature = (programId: string, featureIndex: number) => {
    const program = config.programs.find(p => p.id === programId);
    if (program) {
      const newFeatures = program.features.filter((_, index) => index !== featureIndex);
      updateProgram(programId, "features", newFeatures);
    }
  };

  const updateFeature = (programId: string, featureIndex: number, value: string) => {
    const program = config.programs.find(p => p.id === programId);
    if (program) {
      const newFeatures = [...program.features];
      newFeatures[featureIndex] = value;
      updateProgram(programId, "features", newFeatures);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading configuration...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Code Ninja Configuration</h1>
          <p className="text-gray-600 mt-2">Configure registration deadlines, cohort start dates, and program details</p>
        </div>
        <Button 
          onClick={handleSave} 
          disabled={isSaving || !hasChanges()}
          className="bg-primary hover:bg-primary/90 text-white disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          <FaSave className="mr-2" />
          {isSaving ? "Saving..." : "Save Configuration"}
        </Button>
      </div>

      {/* Basic Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Configuration</CardTitle>
          <CardDescription>Set the key dates for the Code Ninja program</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-1">Registration Deadline</label>
              <input
                type="datetime-local"
                id="registrationDeadline"
                value={config.registration_deadline}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfig(prev => ({ ...prev, registration_deadline: e.target.value }))}
                className="w-full border rounded p-2"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Cohort Starts</label>
              <input
                type="datetime-local"
                id="cohortStarts"
                value={config.cohort_starts}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfig(prev => ({ ...prev, cohort_starts: e.target.value }))}
                className="w-full border rounded p-2"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Programs Configuration */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Programs Configuration</CardTitle>
              <CardDescription>Configure the available coding programs and their features</CardDescription>
            </div>
            <Button onClick={addProgram} variant="outline">
              <FaPlus className="mr-2" />
              Add Program
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {config.programs.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No programs configured yet. Click "Add Program" to get started.</p>
            </div>
          ) : (
            config.programs.map((program, index) => (
            <Card key={program.id} className="border border-gray-200">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1 space-y-4">
                    <div>
                      <label className="block font-semibold mb-1">Program Title</label>
                      <input
                        type="text"
                        id={`program-title-${program.id}`}
                        value={program.title}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateProgram(program.id, "title", e.target.value)}
                        placeholder="Enter program title"
                        className="w-full border rounded p-2"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">Program Description</label>
                      <textarea
                        id={`program-description-${program.id}`}
                        value={program.description}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateProgram(program.id, "description", e.target.value)}
                        placeholder="Enter program description"
                        rows={2}
                        className="w-full border rounded p-2"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="block font-semibold">Program Features</label>
                        <Button 
                          onClick={() => addFeature(program.id)} 
                          variant="outline" 
                          size="sm"
                        >
                          <FaPlus className="mr-1" />
                          Add Feature
                        </Button>
                      </div>
                      <div className="space-y-2">
                        {program.features.map((feature, featureIndex) => (
                          <div key={featureIndex} className="flex gap-2">
                            <input
                              type="text"
                              value={feature}
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateFeature(program.id, featureIndex, e.target.value)}
                              placeholder="Enter feature"
                              className="flex-1 border rounded p-2"
                            />
                            <Button
                              onClick={() => removeFeature(program.id, featureIndex)}
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:text-red-700"
                            >
                              <FaTrash />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  {config.programs.length > 1 && (
                    <Button
                      onClick={() => removeProgram(program.id)}
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700 ml-4"
                    >
                      <FaTrash />
                    </Button>
                  )}
                </div>
              </CardHeader>
            </Card>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CodeNinjaConfig;

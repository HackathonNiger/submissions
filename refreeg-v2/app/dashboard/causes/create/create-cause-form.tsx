"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Icons } from "@/components/icons";
import { useAuth } from "@/hooks/use-auth";
import { useCause } from "@/hooks/use-cause";
import { Progress } from "@/components/ui/progress";
import { ImageUpload } from "@/components/ui/image-upload";
import { categories } from "@/lib/categories";
import { sendCauseUnderReviewEmail } from "@/services/mail";
import {
  format,
  addDays,
  isAfter,
  isBefore,
  differenceInDays,
  startOfDay,
} from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import MultimediaCarousel from "@/components/MultimediaCarousel";

const currencies = [{ id: "NGN", name: "Naira (₦)" }];

type FormData = {
  title: string;
  category: string;
  goal: string;
  currency: string;
  coverImage: File | null;
  sections: { heading: string; description: string }[];
  startDate: Date | undefined;
  endDate: Date | undefined;
  multimedia: File[];
  videoLinks: string[]; // NEW
};

type FormErrors = {
  title?: string;
  category?: string;
  goal?: string;
  coverImage?: string;
  startDate?: string;
  endDate?: string;
  multimedia?: string;
  sections?: { heading?: string; description?: string }[];
};

type CauseFormData = {
  title: string;
  category: string;
  goal: string;
  currency: string;
  coverImage: File | null;
  sections: { heading: string; description: string }[];
  startDate: Date | undefined;
  endDate: Date | undefined;
  multimedia: File[];
  video_links: string[]; // NEW
};

const validateForm = (formData: FormData): FormErrors => {
  const errors: FormErrors = {};

  if (!formData.title.trim()) {
    errors.title = "Title is required";
  } else if (formData.title.length < 5) {
    errors.title = "Title must be at least 5 characters long";
  }

  if (!formData.category) {
    errors.category = "Category is required";
  }

  if (!formData.goal) {
    errors.goal = "Funding goal is required";
  } else if (isNaN(Number(formData.goal)) || Number(formData.goal) <= 0) {
    errors.goal = "Please enter a valid amount";
  }

  if (!formData.coverImage) {
    errors.coverImage = "Cover image is required";
  }

  if (!formData.startDate) {
    errors.startDate = "Start date is required";
  }

  if (!formData.endDate) {
    errors.endDate = "End date is required";
  } else if (formData.startDate && formData.endDate) {
    const daysDiff = differenceInDays(formData.endDate, formData.startDate);
    if (daysDiff > 60) {
      errors.endDate = "Cause duration cannot exceed 60 days";
    }
    if (daysDiff < 1) {
      errors.endDate = "End date must be after start date";
    }
  }

  // Validate sections
  if (formData.sections && formData.sections.length > 0) {
    const sectionErrorsArray = formData.sections.map((section) => {
      const sectionErrors: { heading?: string; description?: string } = {};
      if (!section.heading.trim())
        sectionErrors.heading = "Heading is required";
      if (!section.description || !section.description.trim())
        sectionErrors.description = "Sub-description is required";
      return sectionErrors;
    });

    // Only add sections errors if there are actual errors
    if (sectionErrorsArray.some((err) => Object.keys(err).length > 0)) {
      errors.sections = sectionErrorsArray;
    }
  }

  // Check total multimedia size
  const MAX_TOTAL_SIZE = 100 * 1024 * 1024; // 100MB in bytes
  const totalSize =
    formData.multimedia && formData.multimedia.length > 0
      ? formData.multimedia.reduce((acc, file) => acc + file.size, 0)
      : 0;
  if (totalSize > MAX_TOTAL_SIZE) {
    errors.multimedia = "Total multimedia size must be less than 100MB";
  }

  return errors;
};

export default function CreateCauseForm() {
  const { user } = useAuth();
  const { isLoading, createCause } = useCause();
  const [currentStep, setCurrentStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    title: "",
    category: "",
    goal: "",
    currency: "NGN",
    coverImage: null,
    sections: [{ heading: "", description: "" }],
    startDate: undefined,
    endDate: undefined,
    multimedia: [],
    videoLinks: [], // NEW
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [videoLinkInput, setVideoLinkInput] = useState("");
  const [videoLinkError, setVideoLinkError] = useState<string | null>(null);

  // Auto-save draft to localStorage
  useEffect(() => {
    const savedDraft = localStorage.getItem("causeDraft");
    if (savedDraft) {
      const parsedDraft = JSON.parse(savedDraft);
      setFormData((prev) => ({
        ...parsedDraft,
        coverImage: prev.coverImage,
        startDate: parsedDraft.startDate
          ? new Date(parsedDraft.startDate)
          : undefined,
        endDate: parsedDraft.endDate
          ? new Date(parsedDraft.endDate)
          : undefined,
        multimedia: [],
        videoLinks: parsedDraft.videoLinks || [], // NEW
      }));
    }
  }, []);

  useEffect(() => {
    // Don't save files to localStorage, and properly serialize dates
    const { coverImage, multimedia, ...dataToSave } = formData;
    const serializedData = {
      ...dataToSave,
      startDate: dataToSave.startDate
        ? dataToSave.startDate.toISOString()
        : null,
      endDate: dataToSave.endDate ? dataToSave.endDate.toISOString() : null,
    };
    localStorage.setItem("causeDraft", JSON.stringify(serializedData));
  }, [formData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user makes a selection
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleDateChange = (
    date: Date | undefined,
    field: "startDate" | "endDate"
  ) => {
    setFormData((prev) => ({ ...prev, [field]: date }));
    // Clear error when user selects a date
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleImageUpload = (files: File[]) => {
    const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB in bytes
    const file = files[0];

    if (file && file.size > MAX_FILE_SIZE) {
      setErrors((prev) => ({
        ...prev,
        coverImage: "Cover image must be less than 100MB",
      }));
      return;
    }

    setFormData((prev) => ({ ...prev, coverImage: file }));
    if (errors.coverImage) {
      setErrors((prev) => ({ ...prev, coverImage: undefined }));
    }
  };

  const handleMultimediaUpload = (files: File[]) => {
    const MAX_TOTAL_SIZE = 100 * 1024 * 1024; // 100MB in bytes
    const currentSize =
      formData.multimedia && formData.multimedia.length > 0
        ? formData.multimedia.reduce((acc, file) => acc + file.size, 0)
        : 0;
    const newFilesSize = files.reduce((acc, file) => acc + file.size, 0);

    if (currentSize + newFilesSize > MAX_TOTAL_SIZE) {
      setErrors((prev) => ({
        ...prev,
        multimedia: "Total multimedia size must be less than 100MB",
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      multimedia: Array.isArray(prev.multimedia)
        ? [...prev.multimedia, ...files]
        : [...files],
    }));

    if (errors.multimedia) {
      setErrors((prev) => ({ ...prev, multimedia: undefined }));
    }
  };

  const removeMultimedia = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      multimedia: Array.isArray(prev.multimedia)
        ? prev.multimedia.filter((_, i) => i !== index)
        : [],
    }));
  };

  const validateStep = (step: number): boolean => {
    const currentErrors = validateForm(formData);
    setErrors(currentErrors);

    switch (step) {
      case 1:
        return (
          !currentErrors.title && !currentErrors.category && !currentErrors.goal
        );
      case 2:
        // Check for section errors
        if (currentErrors.sections) {
          // If there are section errors, check if any sections have errors
          return !currentErrors.sections.some(
            (err) => err.heading || err.description
          );
        }
        // If there are no section errors in the currentErrors object, validate directly
        return formData.sections.every(
          (section) =>
            section.heading.trim() !== "" && section.description.trim() !== ""
        );
      case 3:
        return !currentErrors.startDate && !currentErrors.endDate;
      case 4:
        return !currentErrors.coverImage;
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (currentStep < 5 && validateStep(currentStep)) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) return;
    // Only allow submit on last step

    if (currentStep < 5) {
      nextStep();
      return;
    }

    setSubmitting(true);
    const validationErrors = validateForm(formData);

    // Check if there are any validation errors
    const hasErrors = Object.keys(validationErrors).some((key) => {
      if (key === "sections" && validationErrors.sections) {
        // For sections, check if any section has actual errors
        return validationErrors.sections.some(
          (section) => Object.keys(section).length > 0
        );
      }
      return validationErrors[key as keyof FormErrors] !== undefined;
    });

    if (hasErrors) {
      console.log("Found validation errors:", validationErrors);
      setErrors(validationErrors);
      setSubmitting(false);
      return;
    }
    const causeData: CauseFormData = {
      title: formData.title,
      category: formData.category,
      goal: formData.goal,
      currency: formData.currency,
      coverImage: formData.coverImage,
      sections: formData.sections,
      startDate: formData.startDate,
      endDate: formData.endDate,
      multimedia: formData.multimedia,
      video_links: formData.videoLinks, // <-- map to backend
    };
    try {
      await sendCauseUnderReviewEmail({
        causeName: causeData.title,
        reviewTimeframe: "3-5 business days",
      });
      await createCause(user.id, causeData);
      localStorage.removeItem("causeDraft");
    } catch (error) {
      console.error("Error submitting cause:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep((prev) => prev - 1);
  };

  const addSection = () => {
    setFormData((prev) => ({
      ...prev,
      sections: [...prev.sections, { heading: "", description: "" }],
    }));
  };

  const removeSection = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      sections: prev.sections.filter((_, i) => i !== index),
    }));
  };

  const updateSection = (
    index: number,
    field: "heading" | "description",
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      sections: prev.sections.map((section, i) =>
        i === index ? { ...section, [field]: value } : section
      ),
    }));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Cause Title</Label>
              <Input
                id="title"
                name="title"
                placeholder="Enter a clear, specific title"
                value={formData.title}
                onChange={handleChange}
                className={errors.title ? "border-red-500" : ""}
              />
              {errors.title && (
                <p className="text-sm text-red-500">{errors.title}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => handleSelectChange("category", value)}
              >
                <SelectTrigger
                  className={errors.category ? "border-red-500" : ""}
                >
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && (
                <p className="text-sm text-red-500">{errors.category}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="goal">Funding Goal</Label>
                <Input
                  id="goal"
                  name="goal"
                  type="number"
                  placeholder="Enter amount"
                  value={formData.goal}
                  onChange={handleChange}
                  className={errors.goal ? "border-red-500" : ""}
                />
                {errors.goal && (
                  <p className="text-sm text-red-500">{errors.goal}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Select
                  value={formData.currency}
                  onValueChange={(value) =>
                    handleSelectChange("currency", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map((currency) => (
                      <SelectItem key={currency.id} value={currency.id}>
                        {currency.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Additional Sections</h3>
              <Button type="button" onClick={addSection} variant="outline">
                Add Section
              </Button>
            </div>
            {formData.sections.map((section, index) => (
              <Card key={index} className="p-4">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-medium">Section {index + 1}</h4>
                    {index > 0 && (
                      <Button
                        type="button"
                        onClick={() => removeSection(index)}
                        variant="ghost"
                        size="sm"
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`section-heading-${index}`}>
                      Sub-heading
                    </Label>
                    <Input
                      id={`section-heading-${index}`}
                      value={section.heading}
                      onChange={(e) =>
                        updateSection(index, "heading", e.target.value)
                      }
                      placeholder="Enter sub-heading"
                      className={
                        errors.sections && errors.sections[index]?.heading
                          ? "border-red-500"
                          : ""
                      }
                    />
                    {errors.sections && errors.sections[index]?.heading && (
                      <p className="text-sm text-red-500">
                        {errors.sections[index]?.heading}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`section-description-${index}`}>
                      Sub-description
                    </Label>
                    <Textarea
                      id={`section-description-${index}`}
                      value={section.description}
                      onChange={(e) =>
                        updateSection(index, "description", e.target.value)
                      }
                      placeholder="Enter sub-description"
                      className={
                        errors.sections && errors.sections[index]?.description
                          ? "border-red-500"
                          : ""
                      }
                    />
                    {errors.sections && errors.sections[index]?.description && (
                      <p className="text-sm text-red-500">
                        {errors.sections[index]?.description}
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Cause Duration</h3>
              <p className="text-sm text-muted-foreground">
                Select when your cause should start and end. Maximum duration is
                60 days.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.startDate && "text-muted-foreground",
                        errors.startDate && "border-red-500"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.startDate
                        ? format(formData.startDate, "PPP")
                        : "Pick a start date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.startDate}
                      onSelect={(date) => handleDateChange(date, "startDate")}
                      disabled={(date) =>
                        isBefore(date, startOfDay(new Date()))
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {errors.startDate && (
                  <p className="text-sm text-red-500">{errors.startDate}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>End Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.endDate && "text-muted-foreground",
                        errors.endDate && "border-red-500"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.endDate
                        ? format(formData.endDate, "PPP")
                        : "Pick an end date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.endDate}
                      onSelect={(date) => handleDateChange(date, "endDate")}
                      disabled={(date) => {
                        const isPast = isBefore(date, startOfDay(new Date()));
                        const isBeforeStart = formData.startDate
                          ? isBefore(date, formData.startDate)
                          : false;
                        const isOver60Days = formData.startDate
                          ? differenceInDays(date, formData.startDate) > 60
                          : false;
                        return isPast || isBeforeStart || isOver60Days;
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {errors.endDate && (
                  <p className="text-sm text-red-500">{errors.endDate}</p>
                )}
              </div>
            </div>

            {formData.startDate && formData.endDate && (
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm">
                  <span className="font-medium">Duration:</span>{" "}
                  {differenceInDays(formData.endDate, formData.startDate)} days
                </p>
                <p className="text-sm text-muted-foreground">
                  {format(formData.startDate, "PPP")} -{" "}
                  {format(formData.endDate, "PPP")}
                </p>
              </div>
            )}
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Cover Image</Label>
              <ImageUpload
                onUpload={(files) => handleImageUpload(files)}
                maxFiles={1}
                accept="image/*"
              />
              {errors.coverImage && (
                <p className="text-sm text-red-500">{errors.coverImage}</p>
              )}
              {formData.coverImage && (
                <div className="mt-2">
                  <img
                    src={URL.createObjectURL(formData.coverImage)}
                    alt="Cover preview"
                    className="h-32 w-full object-cover rounded-md"
                  />
                </div>
              )}
            </div>
            <div className="mt-8 space-y-4">
              <div className="space-y-2">
                <Label>Additional Images</Label>
                <p className="text-sm text-muted-foreground">
                  Enhance your cause with images. Total size must not exceed
                  100MB.
                </p>
                <ImageUpload
                  onUpload={(files) => handleMultimediaUpload(files)}
                  maxFiles={10}
                  accept="image/*"
                />
                {errors.multimedia && (
                  <p className="text-sm text-red-500">{errors.multimedia}</p>
                )}
              </div>
              {formData.multimedia &&
                Array.isArray(formData.multimedia) &&
                formData.multimedia.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium">
                      Uploaded Images ({formData.multimedia.length})
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {formData.multimedia.map((file, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`Multimedia ${index + 1}`}
                            className="h-32 w-full object-cover rounded-md"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => removeMultimedia(index)}
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
            </div>
            {/* Video Links */}
            <div className="mt-8 space-y-2">
              <Label>Video Links (YouTube, TikTok, etc.)</Label>
              <div className="flex gap-2">
                <Input
                  type="url"
                  placeholder="Paste video link and press Add"
                  value={videoLinkInput}
                  onChange={(e) => setVideoLinkInput(e.target.value)}
                  className="flex-1"
                />
                <Button
                  type="button"
                  onClick={() => {
                    // Basic URL validation
                    try {
                      const url = new URL(videoLinkInput);
                      if (!/^https?:\/\//.test(videoLinkInput)) {
                        setVideoLinkError("Enter a valid URL");
                        return;
                      }
                      setFormData((prev) => ({
                        ...prev,
                        videoLinks: [...prev.videoLinks, videoLinkInput],
                      }));
                      setVideoLinkInput("");
                      setVideoLinkError(null);
                    } catch {
                      setVideoLinkError("Enter a valid URL");
                    }
                  }}
                  disabled={!videoLinkInput}
                >
                  Add
                </Button>
              </div>
              {videoLinkError && (
                <p className="text-sm text-red-500">{videoLinkError}</p>
              )}
              {formData.videoLinks.length > 0 && (
                <ul className="mt-2 space-y-1">
                  {formData.videoLinks.map((link, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <a
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline truncate max-w-xs"
                      >
                        {link}
                      </a>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            videoLinks: prev.videoLinks.filter(
                              (_, i) => i !== idx
                            ),
                          }))
                        }
                      >
                        Remove
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">{formData.title}</h3>
              <p className="text-sm text-muted-foreground">
                {categories.find((c) => c.id === formData.category)?.name}
              </p>
            </div>
            <div className="space-y-2">
              {formData.sections.map((section, index) => (
                <div key={index} className="space-y-2">
                  <h5 className="font-medium">{section.heading}</h5>
                  <p className="text-sm text-muted-foreground">
                    {section.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Funding Goal</h4>
              <p className="text-sm">
                {formData.currency} {formData.goal}
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Duration</h4>
              {formData.startDate && formData.endDate && (
                <p className="text-sm">
                  {differenceInDays(formData.endDate, formData.startDate)} days:{" "}
                  {format(formData.startDate, "PPP")} -{" "}
                  {format(formData.endDate, "PPP")}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Media Preview</h4>
              <MultimediaCarousel
                media={[
                  ...formData.multimedia.map((file) =>
                    URL.createObjectURL(file)
                  ),
                  ...formData.videoLinks,
                ]}
                coverImage={
                  formData.coverImage
                    ? URL.createObjectURL(formData.coverImage)
                    : undefined
                }
                title={formData.title}
              />
            </div>

            {formData.multimedia &&
              Array.isArray(formData.multimedia) &&
              formData.multimedia.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium">Multimedia Files</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {formData.multimedia.map((file, index) => (
                      <div key={index} className="flex flex-col">
                        <p className="text-sm font-medium">{file.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {file.type.startsWith("image/")
                            ? "Image file"
                            : "Video file"}{" "}
                          - {Math.round(file.size / 1024)} KB
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create a New Cause</CardTitle>
        <CardDescription>
          Fill out the form below to create a new fundraising cause. All causes
          require approval before going live.
        </CardDescription>
        <Progress value={(currentStep / 5) * 100} className="mt-4" />
      </CardHeader>
      <form
        className="space-y-8"
        autoComplete="off"
        onKeyDown={(e) => {
          if (
            currentStep === 5 &&
            e.key === "Enter" &&
            e.target instanceof HTMLElement &&
            e.target.tagName !== "TEXTAREA" &&
            e.target.tagName !== "BUTTON"
          ) {
            e.preventDefault();
          }
        }}
      >
        <CardContent className="space-y-4">{renderStep()}</CardContent>

        <CardFooter className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
          >
            Back
          </Button>
          {currentStep < 5 ? (
            <Button type="button" onClick={nextStep}>
              Next
            </Button>
          ) : (
            <Button
              type="button"
              disabled={isLoading || submitting}
              onClick={handleSubmit}
            >
              {isLoading || submitting ? (
                <>
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Cause"
              )}
            </Button>
          )}
        </CardFooter>
      </form>
    </Card>
  );
}
